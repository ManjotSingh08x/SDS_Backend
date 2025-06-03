CREATE DATABASE food_system;

USE food_system;

CREATE TABLE users (
 user_id int NOT NULL AUTO_INCREMENT,
 user_name varchar(255) DEFAULT NULL,
 user_role varchar(255) DEFAULT NULL,
 password varchar(255) DEFAULT NULL,
 PRIMARY KEY (user_id)
);

CREATE TABLE menu (
 menu_id int NOT NULL AUTO_INCREMENT,
 item_name varchar(255) DEFAULT NULL,
 price int DEFAULT NULL,
 image_url varchar(500) DEFAULT NULL,
 category varchar(255) DEFAULT NULL,
 PRIMARY KEY (menu_id)
);

CREATE TABLE orders (
 order_id int NOT NULL AUTO_INCREMENT,
 user_id int DEFAULT NULL,
 table_no int DEFAULT NULL,
 PRIMARY KEY (order_id),
 FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_details (
 order_id int NOT NULL,
 menu_id int NOT NULL,
 quantity int DEFAULT NULL,
 PRIMARY KEY (order_id, menu_id),
 FOREIGN KEY (order_id) REFERENCES orders(order_id),
 FOREIGN KEY (menu_id) REFERENCES menu(menu_id)
);