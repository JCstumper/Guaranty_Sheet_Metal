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
    part_number VARCHAR(50) PRIMARY KEY,
    size VARCHAR(50),
    material_type VARCHAR(255),
    description TEXT,
    product_type VARCHAR(100),
    length DECIMAL,
    price DECIMAL,
    price_with_transport DECIMAL,
    unit VARCHAR(50),
    category_name VARCHAR(255)
);

-- CREATE TABLE IF NOT EXISTS inventory (
--     part_number VARCHAR(50),
--     quantity_in_stock INTEGER NOT NULL,
--     FOREIGN KEY (part_number) REFERENCES products(part_number)
-- );