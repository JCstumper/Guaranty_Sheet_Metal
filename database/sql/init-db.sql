CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS category_mappings (
    category VARCHAR(255) NOT NULL PRIMARY KEY,
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
    action_type VARCHAR(50) NOT NULL,
    user_id VARCHAR(29) NOT NULL,
    log_type VARCHAR(255),
    change_details TEXT NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS products (
    part_number VARCHAR(50) NOT NULL,
    supplier_part_number VARCHAR(50) NOT NULL,
    radius_size VARCHAR(255) NOT NULL,
    material_type VARCHAR(255) NOT NULL,
    color VARCHAR(255),
    description TEXT,
    type VARCHAR(255) NOT NULL,
    quantity_of_item DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(5) NOT NULL,
    price MONEY,
    mark_up_price MONEY,
    PRIMARY KEY (part_number)
);

CREATE TABLE IF NOT EXISTS jobs (
    job_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(255),
    email VARCHAR(255),
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    part_number VARCHAR(50) NOT NULL UNIQUE,
    quantity_in_stock INTEGER NOT NULL,
    FOREIGN KEY (part_number) REFERENCES products(part_number)
);

CREATE TABLE IF NOT EXISTS estimates (
    estimate_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    file_name VARCHAR,
    pdf_data BYTEA,  -- To store the PDF file; consider storing the file in the filesystem or cloud storage for better performance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS necessary_parts (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    part_number VARCHAR(50) NOT NULL,
    quantity_required INTEGER NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
    FOREIGN KEY (part_number) REFERENCES products(part_number)
);

CREATE TABLE IF NOT EXISTS used_parts (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    part_number VARCHAR(50) NOT NULL,
    quantity_used INTEGER NOT NULL,
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

CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id uuid,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS app_settings (
    setting_key VARCHAR(255) PRIMARY KEY,
    setting_value BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO app_settings (setting_key, setting_value)
VALUES ('first_registration_completed', FALSE)
ON CONFLICT (setting_key) DO NOTHING;


