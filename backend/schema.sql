-- Drops and recreates all tables. Run through `npm run db:reset`, never by hand on a DB you care about.
DROP TABLE IF EXISTS order_items, orders, cart_items, products, categories, stores, users;

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  -- _ci collation makes the unique index case-insensitive (BR-04)
  email         VARCHAR(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  password_hash CHAR(60)     NOT NULL,
  role          ENUM('buyer', 'seller', 'admin') NOT NULL DEFAULT 'buyer',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
);

CREATE TABLE stores (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  name       VARCHAR(100) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stores_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE categories (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  UNIQUE KEY uq_categories_slug (slug)
);

CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  store_id    INT          NOT NULL,
  category_id INT          NOT NULL,
  name        VARCHAR(150) NOT NULL,
  description TEXT         NOT NULL,
  price       INT          NOT NULL,
  stock       INT          NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_products_price CHECK (price > 0),
  CONSTRAINT chk_products_stock CHECK (stock >= 0),
  CONSTRAINT fk_products_store    FOREIGN KEY (store_id)    REFERENCES stores (id),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE cart_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT      NOT NULL,
  product_id INT      NOT NULL,
  quantity   INT      NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_cart_quantity CHECK (quantity >= 1),
  UNIQUE KEY uq_cart_user_product (user_id, product_id), -- BR-09
  CONSTRAINT fk_cart_user    FOREIGN KEY (user_id)    REFERENCES users (id),
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT          NOT NULL,
  status           ENUM('PENDING_PAYMENT', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  subtotal         INT          NOT NULL,
  shipping_cost    INT          NOT NULL,
  total            INT          NOT NULL,
  shipping_address VARCHAR(255) NOT NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_orders_total CHECK (total = subtotal + shipping_cost), -- BR-10 safety net
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE order_items (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  order_id          INT          NOT NULL,
  product_id        INT          NOT NULL,
  product_name      VARCHAR(150) NOT NULL, -- copied at checkout (BR-13)
  price_at_purchase INT          NOT NULL, -- copied at checkout (BR-13)
  quantity          INT          NOT NULL,
  CONSTRAINT chk_order_items_quantity CHECK (quantity >= 1),
  CONSTRAINT fk_order_items_order   FOREIGN KEY (order_id)   REFERENCES orders (id),
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id)
);
