DROP DATABASE IF EXISTS food_system;
CREATE DATABASE food_system;

USE food_system;

CREATE TABLE users (
 user_id int NOT NULL AUTO_INCREMENT,
 user_name varchar(255) NOT NULL,
 user_role varchar(255) NOT NULL,
 password varchar(255) NOT NULL,
 email varchar(255) NOT NULL,
 phone bigint NOT NULL,
 PRIMARY KEY (user_id)
);

CREATE TABLE primary_categories (
    category_id int NOT NULL AUTO_INCREMENT,
    category_name varchar(255) NOT NULL,
    PRIMARY KEY (category_id)
);

CREATE TABLE menu (
 item_id int NOT NULL AUTO_INCREMENT,
 item_name varchar(255) NOT NULL,
 price int NOT NULL,
 image_url varchar(500) NOT NULL,
 primary_category_id int NOT NULL,
 FOREIGN KEY (primary_category_id) REFERENCES primary_categories(category_id) ON DELETE CASCADE,
 PRIMARY KEY (item_id)
);

CREATE TABLE orders (
 order_id int NOT NULL AUTO_INCREMENT,
 user_id int NOT NULL,
 table_no int NOT NULL,
 status ENUM('Ongoing', 'Served', 'Payment Pending', 'Complete') NOT NULL,
 custom_inst text DEFAULT NULL,
 time_stamp time NOT NULL,
 total_price int NOT NULL,
 PRIMARY KEY (order_id),
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE order_details (
 order_id int NOT NULL,
 item_id int NOT NULL,
 quantity int NOT NULL,
 PRIMARY KEY (order_id, item_id),
 FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
 FOREIGN KEY (item_id) REFERENCES menu(item_id) ON DELETE CASCADE
);

CREATE TABLE secondary_categories (
    category_id int NOT NULL AUTO_INCREMENT,
    category_name varchar(255) NOT NULL,
    PRIMARY KEY (category_id)
);

CREATE TABLE item_description (
    item_id int NOT NULL,
    category_id int NOT NULL,
    PRIMARY KEY (item_id, category_id),
    FOREIGN KEY (item_id) REFERENCES menu(item_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES secondary_categories(category_id) ON DELETE CASCADE
);

-- admin account
INSERT INTO users (user_name, user_role, password, email, phone) VALUES ('admin', 'Admin',  '$2b$10$08tG4oeQ2nlns47hWdDuiu0t7VRRhHHrWjbrV0iTswrHS6QXOgw3C', 'admin@admin.com', 9876543210);
