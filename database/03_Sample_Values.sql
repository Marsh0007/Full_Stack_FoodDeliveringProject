INSERT INTO categories (category_name) VALUES
('Burger'),
('Pizza'),
('Drinks'),
('Dessert'),
('Local Food');

INSERT INTO products (product_name, description, price, image_url, stock, category_id) VALUES
('Cheese Burger', 'Juicy beef burger with cheese', 8.99, 'assets/images/cheeseburger.jpg', 20, 1),
('Chicken Burger', 'Grilled chicken burger with sauce', 7.99, 'assets/images/chickenburger.jpg', 20, 1),
('Pepperoni Pizza', 'Classic pepperoni pizza', 12.50, 'assets/images/pepperoni.jpg', 15, 2),
('Margherita Pizza', 'Cheese and tomato pizza', 11.00, 'assets/images/margherita.jpg', 15, 2),
('Coke', 'Cold soft drink', 2.50, 'assets/images/coke.jpg', 50, 3),
('Cake', 'Sweet dessert cake slice', 4.50, 'assets/images/cake.jpg', 25, 4),
('Gado Gado', 'Traditional Indonesian salad', 6.50, 'assets/images/gadogado.jpg', 18, 5),
('Batagor', 'Fried fish dumplings', 5.99, 'assets/images/batagor.jpg', 18, 5);

select * from users;