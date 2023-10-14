-- SQLite
CREATE TABLE test(n REAL);
INSERT INTO test(n) VALUES (10.0);
SELECT rowid, * from test;

CREATE TRIGGER IF NOT EXISTS test_trigger
AFTER UPDATE ON test
WHEN NEW.n <> 0.0 
BEGIN
    -- Calculate the relative delta and update the row being modified
    UPDATE test
    SET n = NEW.n / OLD.n
    WHERE rowid = OLD.rowid;
END;

-- Update a row
UPDATE test
SET n = 5.0
WHERE rowid = 1;

-- Check the result
SELECT rowid, * FROM test;

-- Drop the trigger
DROP TRIGGER IF EXISTS test_trigger;