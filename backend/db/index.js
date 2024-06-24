import pkg from "pg";
const { Pool } = pkg;
import createUserTable from "../models/user.models.js";
import { createArtistTable } from "../models/artist.model.js";
import { createMusicTable } from "../models/music.model.js";
const { Client } = pkg;

const createDatabase = async () => {
  const defaultClient = new Client({
    host: process.env.DB_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.DB_PORT,
  });

  try {
    await defaultClient.connect();
    const res = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname='artist_db'`
    );
    if (res.rowCount === 0) {
      await defaultClient.query("CREATE DATABASE artist_db");
      console.log("Database 'artist_db' created successfully.");
    } else {
      console.log("Database 'artist_db' already exists.");
    }
  } catch (err) {
    console.error("Error creating the database", err);
  } finally {
    await defaultClient.end();
  }
};

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.DB_PORT,
});

const connectDB = async () => {
  try {
    await createDatabase();
    await client.connect();
    await client.query(createUserTable);
    await client.query(createArtistTable);
    await client.query(createMusicTable);
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
};

export { client, connectDB };
