import { client } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password, gender, dob, phone } =
    req.body;
  if (!first_name || !last_name || !email || !phone || !password || !dob) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const userExists = await client.query({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  });

  if (userExists.rows[0]) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const query = `
        INSERT INTO users (first_name, last_name, email, phone, password, gender, dob)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
      first_name,
      last_name,
      email,
      phone,
      hashedPassword,
      gender,
      dob,
    ];
    const result = await client.query(query, values);

    return res
      .status(201)
      .json({ message: "User created successfully", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await client.query({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  });

  if (!user.rows[0]) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  try {
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user.rows[0].email
    );

    await client.query({
      text: "UPDATE users SET refresh_token = $1 WHERE email = $2",
      values: [refreshToken, user.rows[0].email],
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .status(200)
      .json({
        message: "Login successful",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateUser = async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await client.query({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  });

  if (!userExists.rows[0]) {
    return res.status(400).json({ message: "User does not exist" });
  }

  try {
    const query = `
      UPDATE users SET first_name = $1, last_name = $2, phone = $3 WHERE email = $4
    `;
    const values = [first_name, last_name, phone, email];
    await client.query(query, values);

    const user = await client.query({
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    });
    return res
      .status(200)
      .json({ message: "User updated successfully", user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Could not update the user", error });
  }
};

const deleteUser = async (req, res) => {};
