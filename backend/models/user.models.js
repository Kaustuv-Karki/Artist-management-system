const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) NOT NULL,
    password VARCHAR(500) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    gender VARCHAR(255) CHECK (gender IN ('male', 'female','other')),
    dob DATE NOT NULL,
    refresh_token VARCHAR(500)
);
`;

export default createUserTable;
