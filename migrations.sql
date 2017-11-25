create extension if not exists "postgis";
create extension if not exists "uuid-ossp";

create schema spend;

CREATE TABLE spend.transactions (
    "id" uuid,
    "user_id" uuid,
    "memo" text,
    "amount" numeric,
    "time" timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

create role spend with login;
grant all on all tables in schema spend to spend;

create role spender;
grant all on schema spend to spender;
grant all on all tables in schema spend to spender;
--create role "f6c7b76d-3510-4cff-9e65-126ee26eb909" inherit;
--grant "f6c7b76d-3510-4cff-9e65-126ee26eb909" to spend;
--grant spender to "f6c7b76d-3510-4cff-9e65-126ee26eb909";

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
