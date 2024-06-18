import { client } from "../db/index.js";
import csvParser from "csv-parser";
import fs from "fs";

export const createArtist = async (req, res) => {
  const {
    name,
    dob,
    gender,
    first_release_year,
    address,
    no_of_albums_released,
  } = req.body;

  const artistExists = await client.query({
    text: "SELECT * FROM artists WHERE name = $1",
    values: [name],
  });

  if (artistExists.rows[0]) {
    return res.status(400).json({ message: "Artist already exists" });
  }

  try {
    const query = `
      INSERT INTO artists (name, dob, gender, first_release_year, address, no_of_albums_released) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`;
    const values = [
      name,
      dob,
      gender,
      first_release_year,
      address,
      no_of_albums_released,
    ];
    const result = await client.query(query, values);
    return res
      .status(201)
      .json({ message: "Artist created successfully", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getArtists = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM artists");
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getArtistById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query({
      text: "SELECT * FROM artists WHERE id = $1",
      values: [id],
    });
    if (!result.rows[0]) {
      return res.status(404).json({ message: "Artist not found" });
    }
    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateArtistById = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    dob,
    gender,
    first_release_year,
    address,
    no_of_albums_released,
  } = req.body;

  const artistExists = await client.query({
    text: "SELECT * FROM artists WHERE id = $1",
    values: [id],
  });

  if (!artistExists.rows[0]) {
    return res.status(404).json({ message: "Artist not found" });
  }

  try {
    const query = `
        UPDATE artists SET name = $1, dob = $2, gender = $3, first_release_year = $4, address = $5, no_of_albums_released = $6 WHERE id = $7
    `;
    const values = [
      name,
      dob,
      gender,
      first_release_year,
      address,
      no_of_albums_released,
      id,
    ];
    await client.query(query, values);
    return res.status(200).json({ message: "Artist updated successfully" });
  } catch (error) {
    console.log({ message: "Error occurred while updating the artist", error });
  }
};

export const deleteArtistById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
        DELETE FROM artists WHERE id = $1
        `;
    const values = [id];
    await client.query(query, values);
    return res.status(200).json({ message: "Artist deleted successfully" });
  } catch (error) {
    console.log({ message: "Error occurred while deleting the artist", error });
  }
};

export const uploadArtists = async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser({ separator: "," }))
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        console.log("This is results", results);
        const query = `
        INSERT INTO artists (name, dob, gender, first_release_year, address, no_of_albums_released, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`;
        await Promise.all(
          results.map(async (artist) => {
            console.log("These are the artist values", artist);
            const {
              name,
              dob,
              gender,
              first_release_year,
              address,
              no_of_albums_released,
            } = artist;
            const values = [
              name,
              dob,
              gender,
              first_release_year,
              address,
              no_of_albums_released,
            ];

            try {
              await client.query(query, values);
            } catch (error) {
              console.error("Error inserting artist:", error, values);
              throw error;
            }
          })
        );
        return res
          .status(201)
          .json({ message: "Artists uploaded successfully" });
      })
      .on("error", (error) => {
        res.status(500).json({ message: "Failed to upload the csv", error });
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload the csv", error });
  }
};

export const importArtist = async (req, res) => {
  console.log("Import artist called");
  try {
    const tableName = "artists";
    const query = `COPY ${tableName} TO STDOUT WITH CSV HEADER`;
    const result = await client.query(query);

    // Send the CSV file as response
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="output.csv"');
    result.rows.forEach((row) => {
      res.write(row);
    });
    res.end();
  } catch (err) {
    console.error("Error exporting data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
