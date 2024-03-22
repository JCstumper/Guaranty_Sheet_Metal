CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- CREATE TABLE IF NOT EXISTS materials (
--     type VARCHAR(255) PRIMARY KEY
-- );

-- CREATE TABLE IF NOT EXISTS categories (
--     name VARCHAR(255) PRIMARY KEY
-- );

CREATE TABLE IF NOT EXISTS products (
    part_number VARCHAR(50) NOT NULL,
    radius_size VARCHAR(255),
    material_type VARCHAR(255),
    color VARCHAR(255),
    description TEXT,
    type VARCHAR(255),
    quantity_of_item DECIMAL(10, 2),
    unit VARCHAR(5),
    price MONEY,
    mark_up_price MONEY,
    PRIMARY KEY (part_number)
);

CREATE TABLE IF NOT EXISTS inventory (
    part_number VARCHAR(50) NOT NULL,
    quantity_in_stock INTEGER NOT NULL,
    FOREIGN KEY (part_number) REFERENCES products(part_number)
);