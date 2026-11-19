BEGIN;

LOCK TABLE "users" IN ACCESS EXCLUSIVE MODE;

DO $$
DECLARE
    incompatible_column text;
BEGIN
    SELECT a.attname
    INTO incompatible_column
    FROM pg_catalog.pg_attribute AS a
    LEFT JOIN pg_catalog.pg_attrdef AS d
      ON d.adrelid = a.attrelid AND d.adnum = a.attnum
    WHERE a.attrelid = '"users"'::regclass
      AND a.attnum > 0
      AND NOT a.attisdropped
      AND a.attname IN ('mustChangePassword', 'mustCompleteProfile')
      AND (
          a.atttypid <> 'boolean'::regtype
          OR NOT a.attnotnull
          OR pg_catalog.pg_get_expr(d.adbin, d.adrelid) IS DISTINCT FROM 'false'
      )
    LIMIT 1;

    IF FOUND THEN
        RAISE EXCEPTION 'Definição incompatível para a coluna users.%', incompatible_column;
    END IF;
END;
$$;

ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "mustCompleteProfile" BOOLEAN NOT NULL DEFAULT false;

COMMIT;
