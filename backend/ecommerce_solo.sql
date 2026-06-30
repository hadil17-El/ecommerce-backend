
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;


-- Tabella users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
); 

INSERT INTO users (email, password, role, created_at) VALUES
('admin@test.com', '$2y$10$QLkOGbAgxCZ4Jy7LhuD/6O0ybwxeRc0iShSmC6q5FQZLC8sQPaISS', 'admin', '2026-06-08 15:21:38'),
('houna@test.com', '$2y$10$SMUju111MkLxMMqpwadVc.qkV55yw7zgyy4QoSuuC8WCwLer4xbQm', 'customer', '2026-06-09 09:57:57');

-- Tabella products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  category VARCHAR(100),
  gender TEXT DEFAULT 'unisex'  CHECK (gender IN ('men','women','unisex')),
  sale BOOLEAN DEFAULT FALSE ,
  discount_price NUMERIC(10,2),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price, description, image, category, gender, sale, discount_price, stock, created_at) VALUES
('hoodie', 30.00, NULL, 'hoodie.jpg', 'clothing', 'unisex', FALSE, NULL, 0, '2026-06-09 09:36:21'),
('sneakers', 50.00, NULL, 'sneakers.jpg', 'shoes', 'unisex', FALSE, NULL, 0, '2026-06-09 09:46:49'),
('Jeans Uomo', 15.00, NULL, 'jeans-uomo.jpg', 'clothing', 'men', FALSE, NULL, 0, '2026-06-09 09:47:24'),
('Lorena Silaj', 40.00, NULL, 'lorena-silaj.jpg', 'clothing', 'women', FALSE, NULL, 0, '2026-06-09 09:51:38'),
('Black Stoneray', 60.00, NULL, 'blackstoneray.jpg', 'accessory', 'women', FALSE, NULL, 0, '2026-06-09 09:53:43');

-- Tabella cart
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE ,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
  
);

-- Tabella favorites
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO favorites (user_id, product_id, created_at) VALUES
(1, 5, '2026-06-15 10:52:55'),
(1, 4, '2026-06-15 10:52:56'),
(1, 3, '2026-06-15 10:52:59'),
(1, 2, '2026-06-15 10:53:00');

-- Tabella orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL,
  status  TEXT DEFAULT 'pending'
        CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

INSERT INTO orders (user_id, total, status, created_at) VALUES
(2, 115.00, 'pending', '2026-06-09 10:02:11'),
(2, 90.00, 'pending', '2026-06-09 12:35:17'),
(1, 105.00, 'pending', '2026-06-15 12:25:39');

-- Tabella order_items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 5, 1, 60.00),
(1, 4, 1, 40.00),
(1, 3, 1, 15.00),
(2, 3, 6, 15.00),
(3, 4, 1, 40.00),
(3, 3, 1, 15.00),
(3, 2, 1, 50.00);

-- Tabella password_resets
CREATE TABLE password_resets (
  id  SERIAL PRIMARY KEY,
  email VARCHAR(191) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
);

