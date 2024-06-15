import { client } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    return ApiResponse(res, 400, false, "Invalid credentials", null);
  }
  try {
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return ApiResponse(res, 400, false, "Invalid credentials", null);
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

    // res
    //   .cookie("refreshToken", refreshToken, options)
    //   .cookie("accessToken", accessToken, options)
    //   .status(200)
    //   .json({
    //     message: "Login successful",
    //     accessToken: accessToken,
    //     refreshToken: refreshToken,
    //   });

    return ApiResponse(
      res
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options),
      200,
      true,
      "Login successful",
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    );
  } catch (error) {
    return ApiResponse(res, 500, false, "Internal server error", error);
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

export const deleteUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
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
    DELETE FROM users WHERE email = $1`;
    const values = [email];
    await client.query(query, values);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete the user", error });
  }
};

export const getUsers = async (req, res) => {
  try {
    const query = `
    SELECT * from users`;

    const result = await client.query({
      text: query,
    });

    return res
      .status(200)
      .json({ message: "Users fetched successfully", data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch users", error });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  try {
    const query = `
    SELECT * from users WHERE id = $1`;

    const result = await client.query({
      text: query,
      values: [id],
    });

    return res
      .status(200)
      .json({ message: "User fetched successfully", data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch user", error });
  }
};

export const logoutUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const userExists = await client.query({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  });

  if (!userExists.rows[0]) {
    return res.status(400).json({ message: "User does not exist" });
  }

  try {
    await client.query({
      text: "UPDATE users SET refresh_token = $1 WHERE email = $2",
      values: [null, email],
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not log out the user", error });
  }
};
