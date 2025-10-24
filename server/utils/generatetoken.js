const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ user: { id } }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = generateToken;
