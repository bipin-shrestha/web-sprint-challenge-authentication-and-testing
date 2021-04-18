  const jwt = require('jsonwebtoken');
  const { JWT_SECRET } = require('../secrets/index.js')
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

const restricted = (req, res, next) => {
try {
const token = req.headers.authorization?.split('')[1];
if(token){
  jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
    if(error){
      res.status(401).json({ message: 'Token Invalid'})
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  })
} else {
  res.status(401).json({ message: 'Token Required' });
}
}
catch(error){
  console.log(error);
  res.status(500).json({message: 'Error validating credentials'});
}
}


module.exports = restricted;