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

-- views
CREATE OR REPLACE VIEW transactions_by_day AS
	SELECT
		*,
		time::date as "day"
	FROM transactions;
	
CREATE OR REPLACE VIEW transactions_by_time AS
	SELECT
		*,
		time::date as "day",
		date_part('week', time) week,
		date_part('month', time) "month",
		date_part('year', time) "year"
	FROM transactions;
	
CREATE OR REPLACE VIEW transaction_metrics_by_week AS
	SELECT
		user_id,
		"week",
		sum(amount),
		count(id)
	FROM transactions_by_time
	GROUP BY user_id, "week";
	
CREATE OR REPLACE VIEW transaction_metrics_by_month AS
	SELECT
		user_id,
		"month",
		sum(amount),
		count(id)
	FROM transactions_by_time
	GROUP BY user_id, "month";
	
CREATE OR REPLACE VIEW transaction_metrics_by_year AS
	SELECT
		user_id,
		"year",
		sum(amount),
		count(id)
	FROM transactions_by_time
	GROUP BY user_id, "year";
	
-- application roles	
create role spender;
grant all on schema spend to spender;
grant all on all tables in schema spend to spender;

-- row level security
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