const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: 'Missing authorization header' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }
    req.user = decoded;

    console.log('Decoded token:', decoded);
    
    if (req.params.userId && req.user.id !== parseInt(req.params.userId) && !req.user.admin) {
      return res.status(403).send({ error: 'Unauthorized access' });
    }
    next();
  });
}

module.exports = { checkAuth };
