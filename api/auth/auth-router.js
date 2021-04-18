const router = require('express').Router();
const userModel = require('../users/user-model.js');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../secrets/index.js');
const bcryptjs = require("bcryptjs");

const checkPayload = (req, res, next) => {
  if(!req.body.username || !req.body.password ){
    res.status(401).json("Username and Password required")
  } else {
    next();
  }
}

const checkUsername = async (req, res, next) => {
  try{
    const user = await userModel.findUsername(req.body.username); 
    if(user === undefined){
      next();
    } else {
      res.status(401).json({ message: "Username Taken" })
    }
  }
  catch(error){
    res.status(500).json({ message: error.message})
  }
}

router.post('/register', checkPayload, checkUsername, async (req, res) => {
  const credentials = req.body;
  console.log(credentials);
  try{
    const hash = bcryptjs.hashSync(credentials.password, 10);
    credentials.password = hash;

    const user = await userModel.insert(credentials);
    res.status(200).json(user)
  }
  catch(error){
    res.status(500).json({ message: error.message })
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', checkPayload, async (req, res) => {
  const { username, password } = req.body;
  try{
    const user = await userModel.findByUsername(username);
    console.log(user);
    if(user && bcryptjs.compareSync(password, user.password)){
      const token = generateToken(user);
      console.log(token);
      res.status(200).json({ message: `Welcome, ${user.username}`, token: token})
    } else {
      res.status(401).json({ message: 'Invalid Credentials'})
    }
  }
  catch(error){
    res.status(500).json({ message: error.message })
  }
 
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

const generateToken = (user) => {
  const options = {
    expiresIn: '1 day'
  };
  const payload = {
    id : user.id,
    username : user.username,
    password : user.password
  };
  console.log(payload);
  console.log(JWT_SECRET);
  console.log(jwt.sign(payload, JWT_SECRET, options));
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;
