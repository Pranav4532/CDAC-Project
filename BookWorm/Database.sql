-- Create the database and use it
CREATE DATABASE IF NOT EXISTS project_db;
USE project_db;

-- Unified Users table for all roles
CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Role ENUM('Admin', 'Seller', 'Buyer') NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    PhoneNo VARCHAR(15),
    Field1 VARCHAR(255) NULL,
    Field2 VARCHAR(255) NULL,
    Field3 VARCHAR(255) NULL,
    Field4 VARCHAR(255) NULL,
    Field5 VARCHAR(255) NULL
);

-- Unified Address and Location table
CREATE TABLE Addresses (
    AddressId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    City VARCHAR(100),
    State VARCHAR(100),
    Country VARCHAR(100),
    PostalCode VARCHAR(20),
    Field1 VARCHAR(255) NULL,
    Field2 VARCHAR(255) NULL,
    Field3 VARCHAR(255) NULL,
    Field4 VARCHAR(255) NULL,
    Field5 VARCHAR(255) NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Books table linked to Users (Sellers)
CREATE TABLE Books (
    BookId INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Author VARCHAR(255),
    Price DECIMAL(10, 2) NOT NULL,
    SellerId INT NOT NULL,
    ImagePath VARCHAR(255),
    Field1 VARCHAR(255) NULL,
    Field2 VARCHAR(255) NULL,
    Field3 VARCHAR(255) NULL,
    Field4 VARCHAR(255) NULL,
    Field5 VARCHAR(255) NULL,
    FOREIGN KEY (SellerId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Unified Cart and Order table
CREATE TABLE Transactions (
    TransactionId INT AUTO_INCREMENT PRIMARY KEY,
    BuyerId INT NOT NULL,
    TotalAmount DECIMAL(10, 2),
    TransactionDate DATE NOT NULL,
    Type ENUM('Cart', 'Order') NOT NULL,
    Status ENUM('Pending', 'Completed', 'Failed', 'Shipped', 'Processing') DEFAULT 'Pending',
    Field1 VARCHAR(255) NULL,
    Field2 VARCHAR(255) NULL,
    Field3 VARCHAR(255) NULL,
    Field4 VARCHAR(255) NULL,
    Field5 VARCHAR(255) NULL,
    FOREIGN KEY (BuyerId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Transaction Items (for both Cart and Order)
CREATE TABLE TransactionItems (
    TransactionItemId INT AUTO_INCREMENT PRIMARY KEY,
    TransactionId INT NOT NULL,
    BookId INT NOT NULL,
    Quantity INT NOT NULL,
    Field1 VARCHAR(255) NULL,
    Field2 VARCHAR(255) NULL,
    Field3 VARCHAR(255) NULL,
    Field4 VARCHAR(255) NULL,
    Field5 VARCHAR(255) NULL,
    FOREIGN KEY (TransactionId) REFERENCES Transactions(TransactionId) ON DELETE CASCADE,
    FOREIGN KEY (BookId) REFERENCES Books(BookId) ON DELETE CASCADE
);

-- Payment methods directly linked to Users
CREATE TABLE PaymentMethods (
    PaymentMethodId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    MethodDetails VARCHAR(255),
    MethodType VARCHAR(50),
    Field1 VARCHAR(255) NULL,
    Field2 VARCHAR(255) NULL,
    Field3 VARCHAR(255) NULL,
    Field4 VARCHAR(255) NULL,
    Field5 VARCHAR(255) NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Payments table linked to Transactions
CREATE TABLE Payments (
    PaymentId INT AUTO_INCREMENT PRIMARY KEY,
    TransactionId INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    Field1 VARCHAR(255) NULL,
    Field2 VARCHAR(255) NULL,
    Field3 VARCHAR(255) NULL,
    Field4 VARCHAR(255) NULL,
    Field5 VARCHAR(255) NULL,
    FOREIGN KEY (TransactionId) REFERENCES Transactions(TransactionId) ON DELETE CASCADE
);

-- Insert dummy data into Users table
INSERT INTO Users (Name, Role, Email, Password, PhoneNo) VALUES
('Alice', 'Admin', 'alice@example.com', 'password123', '1234567890'),
('Bob', 'Seller', 'bob@example.com', 'password123', '0987654321'),
('Charlie', 'Buyer', 'charlie@example.com', 'password123', '1122334455'),
('Dave', 'Buyer', 'dave@example.com', 'password123', '1231231234');

-- Insert dummy data into Addresses table
INSERT INTO Addresses (UserId, City, State, Country, PostalCode) VALUES
(1, 'New York', 'NY', 'USA', '10001'),
(2, 'Los Angeles', 'CA', 'USA', '90001'),
(3, 'Chicago', 'IL', 'USA', '60601'),
(4, 'Houston', 'TX', 'USA', '77001');

-- Insert dummy data into Books table
INSERT INTO Books (Title, Author, Price, SellerId, ImagePath) VALUES
('Book One', 'Author A', 19.99, 2, '/images/book1.jpg'),
('Book Two', 'Author B', 25.50, 2, '/images/book2.jpg'),
('Book Three', 'Author C', 15.75, 2, '/images/book3.jpg'),
('Book Four', 'Author D', 22.00, 2, '/images/book4.jpg');

-- Insert dummy data into Transactions table
INSERT INTO Transactions (BuyerId, TotalAmount, TransactionDate, Type, Status) VALUES
(3, NULL, CURRENT_DATE, 'Cart', 'Pending'),
(4, 67.25, '2024-12-02', 'Order', 'Completed');

-- Insert dummy data into TransactionItems table
INSERT INTO TransactionItems (TransactionId, BookId, Quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 3, 3);

-- Insert dummy data into PaymentMethods table
INSERT INTO PaymentMethods (UserId, MethodDetails, MethodType) VALUES
(3, 'Card ending in 1234', 'Credit Card'),
(4, 'PayPal Account: user@example.com', 'PayPal');

-- Insert dummy data into Payments table
INSERT INTO Payments (TransactionId, Amount, Status) VALUES
(2, 67.25, 'Completed');
