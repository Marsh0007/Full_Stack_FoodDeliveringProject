CREATE DATABASE food_delivery_db;

USE food_delivery_db;

select * from users;
select * from products;
select * from categories;
select * from cart_items;
select * from orders;
describe products;

UPDATE users
SET role = 'admin'
WHERE email = 'admin1@gmail.com';
