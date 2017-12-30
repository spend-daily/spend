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
    "id" uuid,
    "user_id" uuid,
    "memo" text,
    "amount" numeric,
    "time" timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

CREATE TABLE spend.tags {
    "id" uuid,
    "user_id" uuid,
    "label" text NOT NULL,
    PRIMARY KEY ("id")
};

CREATE TABLE spend.transaction_tags {
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
    PRIMARY KEY ("tansaction_id", "tag_id")
};

-- views
CREATE OR REPLACE VIEW spend.transaction_list AS
 SELECT transactions."time"::date AS day,
    transactions.*,
    COALESCE(json_agg(tags) FILTER (WHERE tags.id IS NOT NULL), '[]')::json AS tags
   FROM spend.transactions
     LEFT JOIN spend.transaction_tags ON transaction_tags.transaction_id = transactions.id
     LEFT JOIN spend.tags ON transaction_tags.tag_id = tags.id
  GROUP BY transactions.id;

CREATE OR REPLACE VIEW transaction_days AS
	SELECT
		date_part('year', time) "year",
		date_part('month', time) "month",
		date_part('day', time) "day",
		sum(amount),
		count(id),
		user_id
	FROM transactions
	GROUP BY
		"user_id",
		"year",
		"month",
		"day";

CREATE OR REPLACE VIEW transaction_months AS
	SELECT
		date_part('year', time) "year",
		date_part('month', time) "month",
		sum(amount),
		count(id),
		user_id
	FROM spend.transactions
	GROUP BY
		"user_id",
		"year",
		"month";

CREATE OR REPLACE VIEW transaction_years AS
	SELECT
		date_part('year', time) "year",
		sum(amount),
		count(id),
		user_id
	FROM spend.transactions
	GROUP BY
		"user_id",
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
