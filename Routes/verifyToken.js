const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {

    const token = req.headers.token;

    !token && res.json("Token not provided");

    jwt.verify(token,process.env.JWT_SEC, (err, data) => {
      if (err) res.json("Invalid token");
      req.user = data;
      next();
    });
  } catch (err) {
    res.json(err);
  }
};

module.exports = verifyToken;
