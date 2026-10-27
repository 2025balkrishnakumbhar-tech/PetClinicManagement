CREATE DATABASE IF NOT EXISTS petclinic_db;
USE petclinic_db;

-- Drop tables if they exist
DROP TABLE IF EXISTS visits;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS owners;

-- Owners Table
CREATE TABLE owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    telephone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pets Table
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    birth_date DATE,
    type VARCHAR(30),
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Visits Table
CREATE TABLE visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT,
    visit_date DATE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data Insertion
INSERT INTO owners (first_name, last_name, address, city, telephone) VALUES
('John', 'Doe', '123 Main St', 'Springfield', '555-0199'),
('Jane', 'Smith', '456 Oak Ave', 'Metropolis', '555-0144');

INSERT INTO pets (name, birth_date, type, owner_id) VALUES
('Buddy', '2020-01-15', 'Dog', 1),
('Whiskers', '2021-05-20', 'Cat', 2);

INSERT INTO visits (pet_id, visit_date, description) VALUES
(1, '2023-10-10', 'Routine Vaccination'),
(2, '2023-11-02', 'General Checkup');