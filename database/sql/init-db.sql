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

CREATE TABLE products (
    part_number VARCHAR(255) NOT NULL,
    size VARCHAR(255),
    material_type VARCHAR(255),
    description TEXT,
    type VARCHAR(255),
    length DECIMAL(10,2),
    pieces INT,
    price MONEY,
    w_trans MONEY,
    unit VARCHAR(255),
    PRIMARY KEY (part_number)
);

CREATE TABLE IF NOT EXISTS jobs (
    job_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(255),
    email VARCHAR(255)
);




-- CREATE TABLE IF NOT EXISTS inventory (
--     part_number VARCHAR(50),
--     quantity_in_stock INTEGER NOT NULL,
--     FOREIGN KEY (part_number) REFERENCES products(part_number)
-- );