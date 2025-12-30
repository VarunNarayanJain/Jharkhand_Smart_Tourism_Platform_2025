-- =============================================
-- CLEAR EXISTING DATA
-- =============================================
TRUNCATE TABLE destinations RESTART IDENTITY CASCADE;
TRUNCATE TABLE marketplace_items RESTART IDENTITY CASCADE;
TRUNCATE TABLE cultural_events RESTART IDENTITY CASCADE;
TRUNCATE TABLE guides RESTART IDENTITY CASCADE;
TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE;
TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;
TRUNCATE TABLE analytics RESTART IDENTITY CASCADE;

-- =============================================
-- INSERT SAMPLE DATA FOR JHARKHAND TOURISM
-- =============================================

-- =============================================
-- 1. INSERT DESTINATIONS
-- =============================================
INSERT INTO destinations (id, name, tagline, story, image, best_season, distance, location, activities, highlights, video_url) VALUES
(1, 'Netarhat', 'Queen of Chotanagpur Plateau', 'Famous for sunrise views and pine forests that create a magical morning mist', '/n1.jpg', 'Oct-Mar', '156 km from Ranchi', 'Netarhat, Jharkhand', 
 ARRAY['Sunrise Viewing', 'Pine Forest Walks', 'Photography', 'Nature Trails', 'Hill Station Experience'],
 ARRAY['Stunning sunrise views', 'Pine forests', 'Cool climate', 'Scenic viewpoints', 'Colonial architecture'],
 '/Netarhat.mp4'),

(2, 'Hundru Falls', 'Thundering Beauty', 'Where Subarnarekha river creates a spectacular 98-meter waterfall', '/h1.jpg', 'Jul-Jan', '45 km from Ranchi', 'Ranchi, Jharkhand',
 ARRAY['Waterfall Photography', 'Trekking', 'Rock Climbing', 'Picnicking', 'Swimming'],
 ARRAY['98-meter high waterfall', 'Subarnarekha river', 'Rocky terrain', 'Natural pools', 'Adventure activities'],
 NULL),

(3, 'Betla National Park', 'Wildlife Paradise', 'Home to tigers, elephants and rich biodiversity in the Palamau region', '/b1.jpg', 'Nov-Apr', '170 km from Ranchi', 'Palamau, Jharkhand',
 ARRAY['Wildlife Safari', 'Bird Watching', 'Nature Photography', 'Elephant Spotting', 'Tiger Tracking'],
 ARRAY['Tiger reserve', 'Elephant herds', 'Rich biodiversity', 'Sal forests', 'Wildlife sanctuary'],
 NULL),

(4, 'Deoghar', 'Abode of Gods', 'Sacred temple town famous for Baba Baidyanath Dham and spiritual energy', '/deo1.jpeg', 'Oct-Mar', '250 km from Ranchi', 'Deoghar, Jharkhand',
 ARRAY['Temple Visits', 'Spiritual Journey', 'Cultural Tours', 'Festival Participation', 'Religious Ceremonies'],
 ARRAY['Baba Baidyanath Dham', 'Jyotirlinga temple', 'Spiritual atmosphere', 'Religious festivals', 'Ancient architecture'],
 '/Deogarh.mp4'),

(5, 'Hazaribagh', 'Land of Thousand Gardens', 'Rolling hills, wildlife sanctuary and serene lakes create perfect retreat', '/haz1.jpg', 'Sep-Mar', '91 km from Ranchi', 'Hazaribagh, Jharkhand',
 ARRAY['Lake Boating', 'Wildlife Viewing', 'Hill Hiking', 'Garden Tours', 'Photography'],
 ARRAY['Hazaribagh Lake', 'Wildlife sanctuary', 'Rolling hills', 'Gardens', 'Peaceful environment'],
 NULL);

-- =============================================
-- 2. INSERT MARKETPLACE ITEMS
-- =============================================
INSERT INTO marketplace_items (title, artisan_name, artisan_location, price, image, story, rating, category, verified, badge, in_stock) VALUES
('Handwoven Bamboo Baskets', 'Mina Devi', 'Khunti Village', '₹850', '/n1.jpg', 'Traditional baskets made using ancient weaving techniques passed down through generations', 4.8, 'handicrafts', TRUE, 'Community Endorsed', TRUE),

('Authentic Tribal Homestay', 'Rajesh Oraon', 'Netarhat Hills', '₹1,200/night', '/n2.jpg', 'Experience traditional tribal lifestyle with organic meals and cultural activities', 4.9, 'homestays', TRUE, 'Verified', TRUE),

('Certified Nature Guide', 'Amit Kumar Singh', 'Betla National Park', '₹2,500/day', '/Priya.jpg', 'Expert guide with 15+ years experience in wildlife tracking and nature photography', 4.7, 'guides', TRUE, 'Expert Certified', TRUE),

('Handcrafted Dokra Art', 'Shanti Kumari', 'Dhanbad District', '₹1,500', '/deo1.jpeg', 'Traditional brass work using lost-wax casting technique, depicting tribal life and nature', 4.6, 'handicrafts', TRUE, 'Authentic Craft', TRUE),

('Organic Tribal Honey', 'Suresh Munda', 'Saraikela Forest', '₹400/kg', '/h1.jpg', 'Pure forest honey collected by tribal communities using traditional sustainable methods', 4.9, 'food', TRUE, 'Organic Certified', TRUE),

('Traditional Paitkar Paintings', 'Dulal Chitrakar', 'Amadubi Village', '₹2,200', '/b1.jpg', 'Scroll paintings depicting tribal folklore and Ramayana stories on handmade paper', 4.5, 'handicrafts', TRUE, 'Cultural Heritage', TRUE),

('Jharkhand Tribal Jewelry', 'Kamla Devi', 'Gumla District', '₹800', '/haz1.jpg', 'Authentic silver jewelry with traditional tribal designs and natural stones', 4.4, 'jewelry', TRUE, 'Handmade', TRUE),

('Tussar Silk Sarees', 'Radha Devi', 'Chatra District', '₹3,500', '/deo2.jpg', 'Handwoven tussar silk sarees with traditional motifs and natural dyes', 4.7, 'textiles', TRUE, 'Handloom', TRUE);

-- =============================================
-- 3. INSERT CULTURAL EVENTS
-- =============================================
INSERT INTO cultural_events (name, date, location, description, event_type) VALUES
('Karma Festival', '2025-08-15', 'Ranchi', 'Traditional tribal festival celebrating nature and harvest', 'Religious Festival'),
('Sarhul Festival', '2025-03-21', 'Khunti', 'Spring festival marking the beginning of the New Year for tribal communities', 'Cultural Festival'),
('Jani Shikar Festival', '2025-05-10', 'Hazaribagh', 'Traditional hunting festival of the tribal communities', 'Cultural Festival'),
('Baha Festival', '2025-02-14', 'Chaibasa', 'Flower festival celebrating the blooming of Sal trees', 'Cultural Festival'),
('Tusu Parab', '2025-01-14', 'Dhanbad', 'Harvest festival dedicated to Goddess Tusu', 'Religious Festival'),
('Chhath Puja', '2025-11-07', 'Deoghar', 'Sun worship festival celebrated across Jharkhand', 'Religious Festival');

-- =============================================
-- 4. INSERT GUIDES
-- =============================================
INSERT INTO guides (name, image, location, rating, specialties, verified, price_per_day, description, languages, experience_years) VALUES
('Priya Singh', '/Priya.jpg', 'Ranchi', 4.9, ARRAY['Cultural Tours', 'Temple Visits', 'Local Cuisine'], TRUE, '₹2,000', 'Expert local guide specializing in cultural heritage and spiritual tourism of Jharkhand', ARRAY['Hindi', 'English', 'Santhali'], 8),

('Ravi Oraon', '/Oraon.jpg', 'Netarhat', 4.8, ARRAY['Nature Trails', 'Tribal Culture', 'Photography'], TRUE, '₹2,200', 'Tribal community guide with deep knowledge of forest ecology and traditional practices', ARRAY['Hindi', 'Oraon', 'English'], 12),

('Santosh Kumar', '/Priya.jpg', 'Betla National Park', 4.7, ARRAY['Wildlife Safari', 'Bird Watching', 'Conservation'], TRUE, '₹2,800', 'Wildlife expert and conservationist with extensive knowledge of Jharkhand flora and fauna', ARRAY['Hindi', 'English'], 15),

('Maya Devi', '/Oraon.jpg', 'Hazaribagh', 4.6, ARRAY['Adventure Sports', 'Lake Activities', 'Hill Trekking'], TRUE, '₹1,800', 'Adventure guide specializing in outdoor activities and nature exploration', ARRAY['Hindi', 'English', 'Nagpuri'], 6);

-- =============================================
-- 5. INSERT RESTAURANTS DATA
-- =============================================
INSERT INTO restaurants (name, destination_id, cuisine, rating, price_range, specialties, image, address, phone, hours) VALUES
-- Netarhat restaurants
('Pine Valley Restaurant', 1, 'Multi-cuisine', 4.3, 'Mid-range', ARRAY['Thali', 'Chinese', 'Local Dishes'], '/FastFood.jpg', 'Main Road, Netarhat', '+91-9876543210', '7:00 AM - 10:00 PM'),
('Sunrise Dhaba', 1, 'Local Jharkhand', 4.1, 'Budget', ARRAY['Dal Bhat', 'Mutton Curry', 'Local Vegetables'], '/FastFood2.jpg', 'Near View Point, Netarhat', '+91-9876543211', '6:00 AM - 9:00 PM'),

-- Hundru Falls restaurants
('Waterfall View Cafe', 2, 'Continental', 4.4, 'Mid-range', ARRAY['Sandwiches', 'Coffee', 'Fast Food'], '/FastFood3.jpeg', 'Near Falls Entrance', '+91-9876543212', '8:00 AM - 8:00 PM'),
('Local Taste Restaurant', 2, 'Traditional', 4.2, 'Budget', ARRAY['Rice Meals', 'Fish Curry', 'Tribal Dishes'], '/FastFood.jpg', 'Village Road, Hundru', '+91-9876543213', '7:00 AM - 9:00 PM'),

-- Betla National Park restaurants
('Forest Feast', 3, 'Multi-cuisine', 4.5, 'Mid-range', ARRAY['Tandoor', 'South Indian', 'Chinese'], '/FastFood2.jpg', 'Park Entry Road', '+91-9876543214', '7:00 AM - 10:00 PM'),
('Jungle Kitchen', 3, 'Local', 4.0, 'Budget', ARRAY['Khichdi', 'Dal Chawal', 'Pickles'], '/FastFood3.jpeg', 'Inside Park Premises', '+91-9876543215', '6:00 AM - 8:00 PM'),

-- Deoghar restaurants  
('Baba Baidyanath Bhojanalaya', 4, 'Vegetarian', 4.6, 'Mid-range', ARRAY['Pure Veg Thali', 'Sweets', 'Prasad'], '/FastFood.jpg', 'Temple Road, Deoghar', '+91-9876543216', '5:00 AM - 11:00 PM'),
('Satsang Restaurant', 4, 'Vegetarian', 4.3, 'Budget', ARRAY['North Indian', 'Snacks', 'Beverages'], '/FastFood2.jpg', 'Near Bus Stand, Deoghar', '+91-9876543217', '6:00 AM - 10:00 PM'),

-- Hazaribagh restaurants
('Lake View Dining', 5, 'Multi-cuisine', 4.4, 'Fine dining', ARRAY['Buffet', 'BBQ', 'Desserts'], '/FastFood3.jpeg', 'Lake Side, Hazaribagh', '+91-9876543218', '12:00 PM - 11:00 PM'),
('Hill Station Cafe', 5, 'Continental', 4.2, 'Mid-range', ARRAY['Pizza', 'Pasta', 'Coffee'], '/FastFood.jpg', 'Mall Road, Hazaribagh', '+91-9876543219', '9:00 AM - 10:00 PM');

-- =============================================
-- 6. INSERT SAMPLE REVIEWS DATA
-- =============================================
-- Note: Using dummy user IDs for demonstration
INSERT INTO reviews (destination_id, rating, comment, helpful_count) VALUES
(1, 5, 'Absolutely breathtaking sunrise views! The pine forests and cool climate make it a perfect getaway from city life.', 24),
(1, 4, 'Beautiful place but can get crowded during peak season. Best to visit early morning for the sunrise.', 18),
(1, 5, 'Heaven on earth! The misty mornings and serene environment are incredibly peaceful.', 31),

(2, 5, 'Spectacular waterfall! The 98-meter drop is magnificent. Great for photography and adventure lovers.', 42),
(2, 4, 'Amazing natural beauty but the trek can be challenging. Wear proper footwear.', 28),
(2, 5, 'One of the most beautiful waterfalls in India. The sound of cascading water is mesmerizing.', 35),

(3, 5, 'Excellent wildlife sanctuary! Saw tigers, elephants, and various bird species. Guide was very knowledgeable.', 19),
(3, 4, 'Great safari experience. The forest is well-maintained and animals are in their natural habitat.', 22),

(4, 5, 'Spiritual and peaceful place. The Baidyanath temple is magnificent and the atmosphere is divine.', 38),
(4, 4, 'Beautiful temple town with rich cultural heritage. Must visit during festival season.', 26),

(5, 4, 'Lovely hill station with great views of the lake. Perfect for family outings and nature walks.', 20),
(5, 5, 'Charming place with beautiful lake views. The boat rides are enjoyable and peaceful.', 15);

-- =============================================
-- 6. INSERT SAMPLE ANALYTICS DATA
-- =============================================
INSERT INTO analytics (destination_id, visits_count, bookings_count, rating_average) VALUES
(1, 15420, 342, 4.7),
(2, 12850, 289, 4.6),
(3, 8930, 156, 4.8),
(4, 18750, 420, 4.9),
(5, 6420, 98, 4.5);