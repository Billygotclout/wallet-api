const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const validateToken = (req, res, next) => {
  let token;
  let authHeaders = req.headers.Authorization || req.headers.authorization;

  if (authHeaders && authHeaders.startsWith("Bearer")) {
    token = authHeaders.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user;
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("Token is missing");
    }
  }
};
module.exports = validateToken;
