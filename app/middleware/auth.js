const jwt = require("jsonwebtoken");

const auth = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifyed;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = auth;
