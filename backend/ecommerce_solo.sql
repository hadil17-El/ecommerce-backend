SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Elimina tabelle se esistono già (per evitare errori)
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `cart`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `password_resets`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS=1;

-- Tabella users
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=3;

INSERT INTO `users` (`id`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'admin@test.com', '$2y$10$QLkOGbAgxCZ4Jy7LhuD/6O0ybwxeRc0iShSmC6q5FQZLC8sQPaISS', 'admin', '2026-06-08 15:21:38'),
(2, 'houna@test.com', '$2y$10$SMUju111MkLxMMqpwadVc.qkV55yw7zgyy4QoSuuC8WCwLer4xbQm', 'customer', '2026-06-09 09:57:57');

-- Tabella products
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `gender` enum('men','women','unisex') DEFAULT 'unisex',
  `sale` tinyint(1) DEFAULT 0,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=9;

INSERT INTO `products` (`id`, `name`, `price`, `description`, `image`, `category`, `gender`, `sale`, `discount_price`, `stock`, `created_at`) VALUES
(3, 'hoodie', 30.00, NULL, 'hoodie.jpg', 'clothing', 'unisex', 0, NULL, 0, '2026-06-09 09:36:21'),
(4, 'sneakers', 50.00, NULL, 'sneakers.jpg', 'shoes', 'unisex', 0, NULL, 0, '2026-06-09 09:46:49'),
(5, 'Jeans Uomo', 15.00, NULL, 'jeans-uomo.jpg', 'clothing', 'unisex', 0, NULL, 0, '2026-06-09 09:47:24'),
(6, 'Lorena Silaj', 40.00, NULL, 'lorena-silaj.jpg', 'clothing', 'unisex', 0, NULL, 0, '2026-06-09 09:51:38'),
(8, 'Black Stoneray', 60.00, NULL, 'blackstoneray.jpg', 'accessory', 'unisex', 0, NULL, 0, '2026-06-09 09:53:43');

-- Tabella cart
CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=15;

-- Tabella favorites
CREATE TABLE `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=7;

INSERT INTO `favorites` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 2, 4, '2026-06-09 09:59:31'),
(2, 2, 3, '2026-06-09 09:59:32'),
(3, 1, 8, '2026-06-15 10:52:55'),
(4, 1, 6, '2026-06-15 10:52:56'),
(5, 1, 5, '2026-06-15 10:52:59'),
(6, 1, 4, '2026-06-15 10:53:00');

-- Tabella orders
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=4;

INSERT INTO `orders` (`id`, `user_id`, `total`, `status`, `created_at`) VALUES
(1, 2, 115.00, 'pending', '2026-06-09 10:02:11'),
(2, 2, 90.00, 'pending', '2026-06-09 12:35:17'),
(3, 1, 105.00, 'pending', '2026-06-15 12:25:39');

-- Tabella order_items
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=8;

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 8, 1, 60.00),
(2, 1, 6, 1, 40.00),
(3, 1, 5, 1, 15.00),
(4, 2, 5, 6, 15.00),
(5, 3, 6, 1, 40.00),
(6, 3, 5, 1, 15.00),
(7, 3, 4, 1, 50.00);

-- Tabella password_resets
CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;