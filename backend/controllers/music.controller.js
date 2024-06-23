import { client } from "../db/index.js";
import { musicValidation } from "../validation/music.validation.js";

export const getMusic = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM music");
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getMusicById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query({
      text: "SELECT * FROM music WHERE id = $1",
      values: [id],
    });
    if (!result.rows[0]) {
      return res.status(404).json({ message: "Music not found" });
    }
    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getMusicByArtistId = async (req, res) => {
  const { artistId } = req.params;
  try {
    const result = await client.query({
      text: "SELECT * FROM music WHERE artist_id = $1",
      values: [artistId],
    });
    if (!result.rows[0]) {
      return res.status(404).json({ message: "Music not found" });
    }
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const createMusic = async (req, res) => {
  const { title, album_name, artist_id, genre, released_date } = req.body;
  const { error } = musicValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: errorMessages });
  }
  const query = `
    INSERT INTO music (title, album_name, artist_id, genre, released_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  const values = [title, album_name, artist_id, genre, released_date];
  try {
    const result = await client.query(query, values);
    return res
      .status(201)
      .json({ message: "Music created successfully", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteMusicById = async (req, res) => {
  const { id } = req.params;

  const musicExists = await client.query({
    text: "SELECT * FROM music WHERE id = $1",
    values: [id],
  });

  if (!musicExists.rows[0]) {
    return res.status(404).json({ message: "Music not found" });
  }
  try {
    const result = await client.query({
      text: "DELETE FROM music WHERE id = $1 RETURNING *",
      values: [id],
    });
    return res.status(200).json({ message: "Music deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateMusicById = async (req, res) => {
  const { id } = req.params;
  const { title, album_name, artist_id, genre, released_date } = req.body;
  const musicExists = await client.query({
    text: "SELECT * FROM music WHERE id = $1",
    values: [id],
  });
  if (!musicExists.rows[0]) {
    return res.status(404).json({ message: "Music not found" });
  }
  try {
    const query = `
      UPDATE music 
      SET title = $1, album_name = $2, artist_id = $3, genre = $4, released_date = $5
      WHERE id = $6
      RETURNING *;`;
    const values = [title, album_name, artist_id, genre, released_date, id];
    const result = await client.query(query, values);
    return res
      .status(200)
      .json({ message: "Music updated successfully", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
