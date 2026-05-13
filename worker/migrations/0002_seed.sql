INSERT INTO products (id, name, description, price_range, image_url, shopee_url, gender_target) VALUES
('p1', 'Cozy Weighted Blanket', 'A premium weighted blanket for ultimate relaxation.', 'RM 150 - 200', 'https://images.unsplash.com/photo-1585255474780-e889b70b58e1?w=400', 'https://shopee.com.my', 'U'),
('p2', 'Minimalist Leather Wallet', 'Sleek, slim, and perfect for carrying essentials.', 'RM 80 - 120', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400', 'https://shopee.com.my', 'M'),
('p3', 'Aromatherapy Diffuser Set', 'Create a calming atmosphere with essential oils.', 'RM 90 - 150', 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=400', 'https://shopee.com.my', 'F'),
('p4', 'High-End Coffee Maker', 'For the ultimate morning ritual.', 'RM 300 - 500', 'https://images.unsplash.com/photo-1517246281691-881b5c46d396?w=400', 'https://shopee.com.my', 'U'),
('p5', 'Fitness Smartwatch', 'Track health and workouts seamlessly.', 'RM 250 - 400', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', 'https://shopee.com.my', 'U');

INSERT INTO product_zodiac_tags (product_id, zodiac_sign, match_score, reason) VALUES
('p1', 'Taurus', 95, 'Taurus values comfort and luxury above all. A weighted blanket provides the ultimate cozy feeling they crave.'),
('p1', 'Cancer', 90, 'Cancers are homebodies who love feeling secure. This is basically a warm hug in blanket form.'),
('p2', 'Capricorn', 95, 'Practical, durable, and unpretentious. Capricorns will appreciate this high-quality, no-nonsense wallet.'),
('p2', 'Virgo', 90, 'Virgos love organization and efficiency. A slim wallet keeps their essentials perfectly arranged.'),
('p3', 'Pisces', 95, 'Pisces are deeply sensitive and spiritual. An aromatherapy diffuser helps them create their dreamy sanctuary.'),
('p3', 'Libra', 85, 'Libras appreciate beauty and harmony in their environment. This adds both to their living space.'),
('p4', 'Aries', 90, 'Aries have boundless energy but often need a quick caffeine boost to keep conquering the world.'),
('p4', 'Leo', 85, 'Leos love premium experiences. They will enjoy hosting and serving high-quality coffee to guests.'),
('p5', 'Sagittarius', 95, 'Always on the go! A smartwatch helps them track their endless adventures and activities.'),
('p5', 'Gemini', 85, 'Geminis love gadgets and data. They will have fun exploring all the features of a new smartwatch.');
