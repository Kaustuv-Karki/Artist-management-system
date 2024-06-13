export const createMusicTable = `
    CREATE TABLE IF NOT EXISTS music (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        album_name VARCHAR(255) NOT NULL,
        artist_id INTEGER  REFERENCES artists(id),
        genre VARCHAR(255) CHECK (genre IN ('rnb','country','classic','rock','jazz')),
        released_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
`;
