import jwt from "jsonwebtoken";

export const verifyJwt = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};
