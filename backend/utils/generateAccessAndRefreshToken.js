import jwt from "jsonwebtoken";

export const generateAccessAndRefreshToken = async (email) => {
  const accessToken = await jwt.sign(
    { email: email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = await jwt.sign(
    { email: email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};
