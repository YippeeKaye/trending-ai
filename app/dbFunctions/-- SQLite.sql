CREATE TRIGGER IF NOT EXISTS update_lastUpdatedDate
AFTER UPDATE ON models
BEGIN
    -- Update the lastUpdatedDate column with the current UTC time
    UPDATE models
    SET lastUpdatedDate = datetime('now', 'utc')
    WHERE rowid = NEW.rowid;
END;

SELECT *
from models
ORDER BY delta desc;