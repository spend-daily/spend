alter table transactions enable row level security;

create policy transaction_owner
on transactions
for all
to spender
using (
	current_user = transactions.user_id::text
)
with check (true);

drop policy transaction_owner
on transactions;

CREATE OR REPLACE FUNCTION associate_transaction_with_user()
RETURNS trigger AS $associate_transaction_with_user$
BEGIN
    NEW.user_id := current_user;
    RETURN NEW;
END;
$associate_transaction_with_user$ LANGUAGE plpgsql;

CREATE TRIGGER associate_transaction_with_user_trigger
BEFORE INSERT ON transactions
FOR EACH ROW EXECUTE PROCEDURE associate_transaction_with_user();
