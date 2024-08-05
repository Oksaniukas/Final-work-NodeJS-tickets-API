import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedInfo) {
    return res.status(401).json({ message: "Auth is bad" });
  }
  next();
};

export default authUser;
