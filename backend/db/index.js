import pkg from "pg";
const { Pool } = pkg;
import createUserTable from "../models/user.models.js";
import { createArtistTable } from "../models/artist.model.js";
import { createMusicTable } from "../models/music.model.js";
const { Client } = pkg;

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "artist_db",
  port: 5432,
});

const connectDB = async () => {
  try {
    await client.connect();
    await client.query(createUserTable);
    await client.query(createArtistTable);
    await client.query(createMusicTable);
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
};

export { client, connectDB };
