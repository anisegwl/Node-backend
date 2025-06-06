var jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access Denied. No token provided." });
  }
  try {
    const data = await jwt.verify(token, secret);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send("invalid token");
  }
};
module.exports = fetchUser;