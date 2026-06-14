-- Quick setup script for Vacation Management System
-- Run this script to set up the database and sample data

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS vacation_management;
USE vacation_management;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vacations table
CREATE TABLE IF NOT EXISTS vacations (
    vacation_id INT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_filename VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
    user_id INT,
    vacation_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, vacation_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vacation_id) REFERENCES vacations(vacation_id) ON DELETE CASCADE
);

-- Insert admin user (password: admin123)
INSERT IGNORE INTO users (first_name, last_name, email, password, role) VALUES
('Admin', 'User', 'admin@vacation.com', '$2b$10$rQZ8K9mN2pL1oV3wX5yA6eB7cD8fE9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9', 'admin');

-- Insert sample regular users (password: password123)
INSERT IGNORE INTO users (first_name, last_name, email, password, role) VALUES
('John', 'Doe', 'john.doe@email.com', '$2b$10$rQZ8K9mN2pL1oV3wX5yA6eB7cD8fE9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9', 'user'),
('Jane', 'Smith', 'jane.smith@email.com', '$2b$10$rQZ8K9mN2pL1oV3wX5yA6eB7cD8fE9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9', 'user'),
('Mike', 'Johnson', 'mike.johnson@email.com', '$2b$10$rQZ8K9mN2pL1oV3wX5yA6eB7cD8fE9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9', 'user');

-- Insert sample vacations
INSERT IGNORE INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES
('Paris, France', 'Experience the City of Light with its iconic landmarks, world-class cuisine, and romantic atmosphere. Visit the Eiffel Tower, Louvre Museum, and stroll along the Seine River.', '2024-06-15', '2024-06-22', 2500.00, 'paris.jpg'),
('Tokyo, Japan', 'Discover the perfect blend of traditional culture and modern innovation. Explore ancient temples, enjoy authentic sushi, and experience the vibrant nightlife.', '2024-07-10', '2024-07-18', 3200.00, 'tokyo.jpg'),
('New York City, USA', 'The city that never sleeps offers Broadway shows, Central Park, world-famous museums, and incredible dining experiences.', '2024-08-05', '2024-08-12', 2800.00, 'newyork.jpg'),
('Rome, Italy', 'Walk through history in the Eternal City. Visit the Colosseum, Vatican City, and enjoy authentic Italian cuisine and gelato.', '2024-09-01', '2024-09-08', 2200.00, 'rome.jpg'),
('Barcelona, Spain', 'Explore Gaudí\'s architectural masterpieces, relax on beautiful beaches, and enjoy the vibrant Catalan culture and cuisine.', '2024-10-15', '2024-10-22', 1900.00, 'barcelona.jpg'),
('Sydney, Australia', 'Experience the iconic Opera House, beautiful harbor, and stunning beaches. Perfect for outdoor adventures and city exploration.', '2024-11-20', '2024-11-28', 3500.00, 'sydney.jpg'),
('London, England', 'Rich in history and culture, visit Buckingham Palace, the British Museum, and enjoy traditional afternoon tea.', '2024-12-10', '2024-12-17', 2400.00, 'london.jpg'),
('Dubai, UAE', 'Luxury shopping, stunning architecture, and desert adventures. Experience the world\'s tallest building and pristine beaches.', '2025-01-15', '2025-01-22', 2900.00, 'dubai.jpg'),
('Bali, Indonesia', 'Tropical paradise with beautiful beaches, ancient temples, and lush rice terraces. Perfect for relaxation and adventure.', '2025-02-10', '2025-02-18', 1800.00, 'bali.jpg'),
('Amsterdam, Netherlands', 'Charming canals, world-class museums, and cycling culture. Explore the Anne Frank House and enjoy Dutch cuisine.', '2025-03-05', '2025-03-12', 2100.00, 'amsterdam.jpg'),
('Santorini, Greece', 'Stunning sunsets, white-washed buildings, and crystal-clear waters. A romantic destination with incredible views.', '2025-04-20', '2025-04-27', 2300.00, 'santorini.jpg'),
('Machu Picchu, Peru', 'Ancient Incan ruins high in the Andes mountains. A once-in-a-lifetime adventure for history and nature lovers.', '2025-05-15', '2025-05-25', 2600.00, 'machupicchu.jpg'),
('Reykjavik, Iceland', 'Northern lights, geysers, and dramatic landscapes. Experience the land of fire and ice with unique natural wonders.', '2025-06-01', '2025-06-08', 2700.00, 'reykjavik.jpg'),
('Cape Town, South Africa', 'Table Mountain, beautiful beaches, and rich cultural heritage. Experience the meeting point of two oceans.', '2025-07-10', '2025-07-18', 2400.00, 'capetown.jpg');

-- Insert some sample likes
INSERT IGNORE INTO likes (user_id, vacation_id) VALUES
(2, 1), (2, 3), (2, 5), (2, 7),
(3, 2), (3, 4), (3, 6), (3, 8),
(4, 1), (4, 2), (4, 9), (4, 11);

-- Show success message
SELECT 'Database setup completed successfully!' as message;
