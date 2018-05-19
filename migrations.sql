-- extensions
create extension if not exists "postgis";
create extension if not exists "uuid-ossp";

-- schemas
CREATE SCHEMA spend;
SET search_path = spend, public;

-- root roles
create role spend with superuser;
grant all on all tables in schema spend to spend;

-- tables
CREATE TABLE spend.transactions (
    "id" uuid DEFAULT uuid_generate_v4(),
    "user_id" uuid,
    "memo" text,
    "amount" numeric,
    "time" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id")
);

CREATE TABLE spend.tags (
    "id" uuid DEFAULT uuid_generate_v4(),
    "user_id" uuid,
    "label" text NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE spend.transaction_tags (
    "transaction_id"
        uuid
        NOT NULL
        REFERENCES spend.transactions("id")
        ON DELETE CASCADE,
    "tag_id"
        uuid
        NOT NULL
        REFERENCES spend.tags("id")
        ON DELETE CASCADE,
    PRIMARY KEY ("transaction_id", "tag_id")
);

CREATE TYPE interval_unit AS ENUM (
	'hour',
	'day',
	'week',
	'month',
	'year'
);

CREATE TABLE spend.transaction_schedules (
	"id" uuid DEFAULT uuid_generate_v4(),
	"transaction_id"
		uuid
		NOT NULL
		REFERENCES spend.transactions("id")
		ON DELETE CASCADE,
	"start" date NOT NULL,
	"end" date,
	"frequency" numeric NOT NULL,
	"unit" interval_unit NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE spend.transaction_spreads (
	"id" uuid DEFAULT uuid_generate_v4(),
	"transaction_id"
		uuid
		NOT NULL
		REFERENCES spend.transactions("id")
		ON DELETE CASCADE,
	"count" numeric NOT NULL,
	"unit" interval_unit NOT NULL,
	PRIMARY KEY ("id")
);

-- views
CREATE OR REPLACE VIEW spend.transaction_and_tags AS
 SELECT transactions.id,
    transactions.user_id,
    transactions.memo,
    transactions.amount,
    transactions."time",
    COALESCE(json_agg(tags.*) FILTER (WHERE tags.id IS NOT NULL), '[]'::json) AS tags
   FROM transactions
     LEFT JOIN transaction_tags ON transaction_tags.transaction_id = transactions.id
     LEFT JOIN tags ON transaction_tags.tag_id = tags.id
  GROUP BY transactions.id;

CREATE OR REPLACE VIEW transaction_and_schedules AS
	SELECT 
		transaction_and_tags.id,
		transaction_and_tags.user_id,
		transaction_and_tags.memo,
		transaction_and_tags.amount,
		transaction_and_tags.time,
		transaction_and_tags.tags,
		false AS recurring
	FROM transaction_and_tags
	WHERE time is not null
	UNION ALL
	SELECT
		transaction_and_tags.id,
		transaction_and_tags.user_id,
		transaction_and_tags.memo,
		transaction_and_tags.amount,
		generate_series(
			transaction_schedules.start,
			transaction_schedules.end,
			(transaction_schedules.frequency || ' ' || transaction_schedules.unit)::interval
		) AS time,
		transaction_and_tags.tags,
		true AS recurring
	FROM transaction_and_tags
	JOIN transaction_schedules ON transaction_and_tags.id = transaction_id;

CREATE OR REPLACE VIEW transaction_and_spreads AS
	SELECT *, false AS spread
	FROM transaction_and_schedules
	WHERE NOT EXISTS (
		SELECT 1
		FROM transaction_spreads
		WHERE transaction_spreads.transaction_id = transaction_and_schedules.id
	)
	UNION ALL
	SELECT
		transaction_and_schedules.id,
		transaction_and_schedules.user_id,
		transaction_and_schedules.memo,
		transaction_and_schedules.amount / date_part('day', (count || ' ' || unit)::interval) as amount,
		generate_series(
			transaction_and_schedules.time,
			transaction_and_schedules.time + (count || ' ' || unit)::interval - '1 day'::interval,
			'1 day'
		) as time,
		transaction_and_schedules.tags,
		transaction_and_schedules.recurring,
		true AS spread
	FROM transaction_spreads
	JOIN transaction_and_schedules on transaction_and_schedules.id = transaction_id;
	
CREATE OR REPLACE VIEW transaction_by_day AS
	SELECT *, time::date as day
	FROM transaction_and_spreads;

CREATE OR REPLACE VIEW transaction_by_month AS
	SELECT
		date_trunc('month', day) as month,
		sum(amount),
		count(id),
		user_id
	FROM transaction_by_day
	GROUP BY
		user_id,
		"month";

CREATE OR REPLACE VIEW transaction_by_year AS
	SELECT
		date_trunc('year', month) as year,
		sum(sum),
		sum(count)::bigint as count,
		user_id
	FROM transaction_by_month
	GROUP BY
		user_id,
		"year";

-- application roles
create role spender;
grant all on schema spend to spender;
grant all on all tables in schema spend to spender;

-- row level security

--- transactions
alter table spend.transactions enable row level security;

create policy transaction_owner
on spend.transactions
	for all
	to spender
	using (
		current_user = transactions.user_id::text
	)
	with check (true);

CREATE OR REPLACE FUNCTION associate_transaction_with_user()
RETURNS trigger AS $associate_transaction_with_user$
BEGIN
    NEW.user_id := current_user;
    RETURN NEW;
END;
$associate_transaction_with_user$ LANGUAGE plpgsql;

CREATE TRIGGER associate_transaction_with_user_trigger
BEFORE INSERT ON spend.transactions
FOR EACH ROW EXECUTE PROCEDURE associate_transaction_with_user();

--- tags
alter table spend.tags enable row level security;

create policy tag_owner
on spend.tags
	for all
	to spender
	using (
		current_user = tags.user_id::text
	)
	with check (true);

CREATE OR REPLACE FUNCTION associate_tag_with_user()
RETURNS trigger AS $associate_tag_with_user$
BEGIN
    NEW.user_id := current_user;
    RETURN NEW;
END;
$associate_tag_with_user$ LANGUAGE plpgsql;

CREATE TRIGGER associate_tag_with_user_trigger
BEFORE INSERT ON spend.tags
FOR EACH ROW EXECUTE PROCEDURE associate_tag_with_user();

