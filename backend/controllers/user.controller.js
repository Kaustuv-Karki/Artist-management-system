import { client } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import {
  loginValidation,
  registerValidation,
  updateUserValidation,
} from "../validation/user.validation.js";

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password, gender, dob, phone } =
    req.body;
  const { error } = registerValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: errorMessages });
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
    return ApiResponse(res, 500, false, "Internal server error", error);
  }
};

export const loginUser = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: errorMessages });
  }
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

    return ApiResponse(
      res
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options),
      200,
      true,
      "Login successful",
      {
        user: user.rows[0],
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    );
  } catch (error) {
    return ApiResponse(res, 500, false, "Internal server error", error);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, dob, gender } = req.body;

  const { error } = updateUserValidation(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: errorMessages });
  }

  const userExists = await client.query({
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  });

  if (!userExists.rows[0]) {
    return res.status(400).json({ message: "User does not exist" });
  }

  try {
    const query = `
      UPDATE users SET first_name = $1, last_name = $2, phone = $3, dob = $4, gender = $5 WHERE id = $6
    `;
    const values = [first_name, last_name, phone, dob, gender, id];
    await client.query(query, values);

    const user = await client.query({
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    });
    return res
      .status(200)
      .json({ message: "User updated successfully", user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Could not update the user", error });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  const userExists = await client.query({
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  });

  if (!userExists.rows[0]) {
    return res.status(400).json({ message: "User does not exist", userExists });
  }

  try {
    const query = `
    DELETE FROM users WHERE id = $1`;
    const values = [id];
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
  const { id } = req.params;
  if (!Id) {
    return ApiResponse(res, 400, false, "Id is required", null);
  }

  const userExists = await client.query({
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  });

  if (!userExists.rows[0]) {
    return res.status(400).json({ message: "User does not exist" });
  }

  try {
    await client.query({
      text: "UPDATE users SET refresh_token = $1 WHERE id = $2",
      values: [null, id],
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not log out the user", error });
  }
};

export const refreshToken = async (req, res) => {
  let refreshToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    refreshToken = req.headers.authorization.split(" ")[1];
  } else if (req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
  }

  if (!refreshToken) {
    return ApiResponse(res, 401, false, "Refresh token is required", null);
  }

  try {
    const user = await client.query({
      text: "SELECT * FROM users WHERE refresh_token = $1",
      values: [refreshToken],
    });

    if (!user.rows[0]) {
      return ApiResponse(res, 403, false, "Invalid refresh token", null);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return ApiResponse(res, 403, false, "Invalid refresh token", null);
        }

        const accessToken = generateAccessToken(user.rows[0].email);

        const options = {
          httpOnly: true,
          secure: true,
        };

        return ApiResponse(
          res.cookie("accessToken", accessToken, options),
          200,
          true,
          "Access token refreshed successfully",
          {
            accessToken,
          }
        );
      }
    );
  } catch (error) {
    return ApiResponse(res, 500, false, "Internal server error", error);
  }
};
