import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decodedInfo.userId;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authUser;

