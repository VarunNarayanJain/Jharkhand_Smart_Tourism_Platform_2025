-- Test queries to check if data exists in tables

-- Check destinations
SELECT * FROM destinations WHERE id = 1;

-- Check restaurants for Netarhat (destination_id = 1)
SELECT * FROM restaurants WHERE destination_id = 1;

-- Check reviews for Netarhat (destination_id = 1)
SELECT * FROM reviews WHERE destination_id = 1;

-- Check guides
SELECT * FROM guides;

-- Check marketplace items
SELECT * FROM marketplace_items;

-- Check all tables row counts
SELECT 'destinations' as table_name, COUNT(*) as row_count FROM destinations
UNION ALL
SELECT 'restaurants', COUNT(*) FROM restaurants  
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'guides', COUNT(*) FROM guides
UNION ALL
SELECT 'marketplace_items', COUNT(*) FROM marketplace_items;