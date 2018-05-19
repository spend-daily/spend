set search_path = spend;

--CREATE OR REPLACE VIEW transaction_and_schedules AS

drop function get_transactions_for_date(date, text);
CREATE OR REPLACE FUNCTION get_transactions_for_date(
	search_date date
) RETURNS TABLE(
	id uuid,
	memo text,
	amount double precision,
	"time" timestamp with time zone,
	recurring boolean,
	spread boolean
)
AS $$
	WITH transactions_and_schedules AS (
		SELECT 
			transactions.id,
			transactions.memo,
			transactions.amount,
			transactions.time,
			false AS recurring
		FROM transactions
		WHERE time::date = search_date::date
		UNION ALL
		SELECT
			transactions.id,
			transactions.memo,
			transactions.amount,
			generate_series(
				transaction_schedules.start,
				transaction_schedules.end,
				(transaction_schedules.frequency || ' ' || transaction_schedules.unit)::interval
			) AS time,
			true AS recurring
		FROM transactions
		JOIN transaction_schedules ON transactions.id = transaction_id
		WHERE time::date = search_date::date
	)
	SELECT
		*,
		false AS spread
	FROM transactions_and_schedules
	WHERE NOT EXISTS (
		SELECT 1
		FROM transaction_spreads
		WHERE transaction_spreads.transaction_id = transactions_and_schedules.id
	)
	UNION ALL
	SELECT
		transactions_and_schedules.id,
		transactions_and_schedules.memo,
		transactions_and_schedules.amount / date_part('day', (count || ' ' || unit)::interval) as amount,
		generate_series(
			transactions_and_schedules.time,
			transactions_and_schedules.time + (count || ' ' || unit)::interval - '1 day'::interval,
			'1 day'
		) as time,
		transactions_and_schedules.recurring,
		true AS spread
	FROM transaction_spreads
	JOIN transactions_and_schedules on transactions_and_schedules.id = transaction_id
	WHERE time::date = search_date::date;
$$ LANGUAGE SQL;

select * from get_transactions_for_date('2-12-2018'::date);

	WITH transactions_and_schedules AS (
		SELECT 
			transactions.id,
			transactions.memo,
			transactions.amount,
			transactions.time,
			false AS recurring
		FROM transactions
		WHERE time::date = '2018-1-1'
		UNION ALL
		SELECT
			transactions.id,
			transactions.memo,
			transactions.amount,
			generate_series(
				transaction_schedules.start,
				transaction_schedules.end,
				(transaction_schedules.frequency || ' ' || transaction_schedules.unit)::interval
			) AS time,
			true AS recurring
		FROM transactions
		JOIN transaction_schedules ON transactions.id = transaction_id
	)
	SELECT
		*,
		false AS spread
	FROM transactions_and_schedules
	WHERE NOT EXISTS (
		SELECT 1
		FROM transaction_spreads
		WHERE transaction_spreads.transaction_id = transactions_and_schedules.id
	)
	AND time::date = '2018-1-1'::date
	UNION ALL
	SELECT
		transactions_and_schedules.id,
		transactions_and_schedules.memo,
		transactions_and_schedules.amount / date_part('day', (count || ' ' || unit)::interval) as amount,
		generate_series(
			transactions_and_schedules.time,
			transactions_and_schedules.time + (count || ' ' || unit)::interval - '1 day'::interval,
			'1 day'
		) as time,
		transactions_and_schedules.recurring,
		true AS spread
	FROM transaction_spreads
	JOIN transactions_and_schedules on transactions_and_schedules.id = transaction_id

