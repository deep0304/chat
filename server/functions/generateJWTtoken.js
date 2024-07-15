const jwt = require("jsonwebtoken");
const generateJWTtoken = (payload) => {
  const token = jwt.sign(
    {
      _id: payload._id,
      username: payload.username,
    },
    process.env.JWTSecret,
    {
      expiresIn: "8d",
    }
  );
  
  return token;
};

module.exports = generateJWTtoken;
