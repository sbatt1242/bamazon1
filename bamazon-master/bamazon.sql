CREATE DATABASE IF NOT EXISTS bamazon;
USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
	item_id INT(10),
    product_name VARCHAR(100),
	department_name VARCHAR(50),
    price DECIMAL (7,2),
    stock_quantity INT(7),
    PRIMARY KEY (item_id)
);

LOCK TABLES products WRITE;

ALTER TABLE products DISABLE KEYS;

INSERT INTO products VALUES
(20101,'The Matrix','movies',9.99,20),
(20102,'Across the Universe','movies',4.99,10),
(20103,'La La Land - Special Edition','movies',24.99,100),
(20104,'The Dark Knight','movies',9.99,20),
(20105,'The Sound of Music - Sing-a-Long','movies',19.99,50),
(30101,'Run The Jewels 3','music',12.99,100),
(30102,'No Pads, No Helmets... Just Balls','music',7.99,10),
(30103,'I See You','music',12.99,100),
(30104,'American Idiot','music',9.99,20),
(30105,'The Color Before the Sun','music',7.99,20);

ALTER TABLE products ENABLE KEYS;

UNLOCK TABLES;