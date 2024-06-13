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

client
  .connect()
  .then(() => {
    console.log("Connected to the database");
    client.query(createUserTable).then(() => {
      console.log("Users table created successfully");
    });
    client.query(createArtistTable).then(() => {
      console.log("Artists table created successfully");
    });
    client.query(createMusicTable).then(() => {
      console.log("Music table created successfully");
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });
