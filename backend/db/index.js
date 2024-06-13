import pkg from "pg";
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
    console.log("Connected to the database");

    await client.query(createUserTable);
    console.log("Users table created successfully");

    await client.query(createArtistTable);
    console.log("Artists table created successfully");

    await client.query(createMusicTable);
    console.log("Music table created successfully");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
};

export { client, connectDB };
