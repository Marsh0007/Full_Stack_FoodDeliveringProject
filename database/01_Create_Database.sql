-- Create database
CREATE DATABASE food_delivery_db;

USE food_delivery_db;


-- Assign admin role manually
UPDATE users
SET role = 'admin'
WHERE email = 'admin1@gmail.com';
