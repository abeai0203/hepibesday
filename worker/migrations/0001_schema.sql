-- Core schemas
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  zodiac_sign TEXT,
  gender TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  price_range TEXT,
  image_url TEXT,
  shopee_url TEXT,
  gender_target TEXT, -- 'M', 'F', 'U' (Unisex)
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE product_zodiac_tags (
  product_id TEXT,
  zodiac_sign TEXT,
  match_score INTEGER,
  reason TEXT, -- "Why it fits" text
  PRIMARY KEY (product_id, zodiac_sign)
);

CREATE TABLE affiliate_clicks (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  product_id TEXT,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
