import { client } from "../db/index.js";

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
