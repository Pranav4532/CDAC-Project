CREATE DATABASE IF NOT EXISTS project_db;
USE project_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role ENUM('buyer', 'admin', 'seller') NOT NULL
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 10,
  seller_id INT NOT NULL,
  image_path VARCHAR(255),
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  seller_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  seller_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'shipped', 'delivered', 'canceled') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

INSERT INTO books (title, author, price, stock, seller_id, image_path) VALUES 
('Harry Potter', 'J.K. Rowling', 15.99, 20, 3, 'harry_potter.jpg'),
('Lord of the Rings', 'J.R.R. Tolkien', 25.50, 15, 3, 'lord_of_the_rings.jpg'),
('The Hobbit', 'J.R.R. Tolkien', 12.75, 30, 3, 'the_hobbit.jpg'),
('War and Peace', 'Leo Tolstoy', 18.99, 10, 4, 'war_and_peace.jpg'),
('Moby Dick', 'Herman Melville', 9.99, 25, 4, 'moby_dick.jpg'),
('Catcher in the Rye', 'J.D. Salinger', 14.50, 12, 4, 'catcher_in_the_rye.jpg'),
('Pride and Prejudice', 'Jane Austen', 10.99, 18, 3, 'pride_and_prejudice.jpg'),
('1984', 'George Orwell', 13.49, 22, 3, '1984.jpg'),
('To Kill a Mockingbird', 'Harper Lee', 11.75, 16, 4, 'to_kill_a_mockingbird.jpg'),
('The Great Gatsby', 'F. Scott Fitzgerald', 9.99, 20, 4, 'great_gatsby.jpg'),

