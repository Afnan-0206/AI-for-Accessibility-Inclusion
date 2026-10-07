const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '7d';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'test') {
      return 'test-jwt-secret-key-12345';
    }
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  return secret;
};

const generateToken = (payload) => {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_EXPIRES_IN
};
