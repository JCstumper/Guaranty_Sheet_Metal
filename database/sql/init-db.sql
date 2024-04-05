CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS category_mappings (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL UNIQUE,
    keywords TEXT[] NOT NULL,
    catcode VARCHAR(255) NOT NULL UNIQUE
);

-- CREATE TABLE IF NOT EXISTS materials (
--     type VARCHAR(255) PRIMARY KEY
-- );

-- CREATE TABLE IF NOT EXISTS categories (
--     name VARCHAR(255) PRIMARY KEY
-- );

CREATE TABLE IF NOT EXISTS log (
    log_id SERIAL PRIMARY KEY,
    action_type VARCHAR(10) NOT NULL,
    user_id VARCHAR(29) NOT NULL,
    log_type VARCHAR(255),
    change_details TEXT NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS products (
    part_number VARCHAR(50) NOT NULL,
    supplier_part_number VARCHAR(50),
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

CREATE TABLE IF NOT EXISTS jobs (
    job_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS invoices (
    invoice_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    total_cost DECIMAL(10, 2),
    invoice_Date DATE,
    status VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS invoice_items (
    product_id INT,
    invoice_id INT,
    quantity INT,
    price_per_unit DECIMAL(10, 2),
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
);


CREATE TABLE IF NOT EXISTS inventory (
    part_number VARCHAR(50) NOT NULL,
    quantity_in_stock INTEGER NOT NULL,
    FOREIGN KEY (part_number) REFERENCES products(part_number)
);

CREATE TABLE IF NOT EXISTS estimates (
    estimate_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    pdf_data BYTEA,  -- To store the PDF file; consider storing the file in the filesystem or cloud storage for better performance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS necessary_parts (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    part_number VARCHAR(50) NOT NULL,
    quantity_required DECIMAL(10, 2),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
    FOREIGN KEY (part_number) REFERENCES products(part_number)
);

CREATE TABLE IF NOT EXISTS used_parts (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    part_number VARCHAR(50) NOT NULL,
    quantity_used DECIMAL(10, 2),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
    FOREIGN KEY (part_number) REFERENCES products(part_number)
);

CREATE TABLE IF NOT EXISTS login_attempts (
    user_id uuid PRIMARY KEY,
    failed_attempts INT NOT NULL DEFAULT 0,
    is_locked_out BOOLEAN NOT NULL DEFAULT FALSE,
    lockout_until TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);