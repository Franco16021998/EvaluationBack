CREATE TABLE IF NOT EXISTS `product_types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY UQ_product_types_name(name)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `product_type_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY UQ_products_name(name),
  KEY IX_products_product_type_id(product_type_id),
  CONSTRAINT FK_products_product_type_id FOREIGN KEY(product_type_id) REFERENCES product_types(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;