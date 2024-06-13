import { client } from "../db/index.js";

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password, gender, dob, phone } =
    req.body;
  if (!first_name || !last_name || !email || !phone || !password || !dob) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const query = `
        INSERT INTO users (first_name, last_name, email, phone, password, gender, dob)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [first_name, last_name, email, phone, password, gender, dob];
    const result = await client.query(query, values);

    return res
      .status(201)
      .json({ message: "User created successfully", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
