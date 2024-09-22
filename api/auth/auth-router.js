const router = require('express').Router();
const Auth = require('./auth-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../secrets/secrets')

const {checkCredentials, checkUsernameUnique} = require('../middleware/username-check')

router.post('/register', checkCredentials, checkUsernameUnique, async (req, res, next) => { 
  try {
    const credentials = req.body
    const hash = bcrypt.hashSync(credentials.password, 8)
    credentials.password = hash
    const newUser = await Auth.createUser(credentials)
    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }  
});

router.post('/login', checkCredentials, async (req, res, next) => {
  try {
    const {username, password} = req.body
    const check = await Auth.findByUsername(username)
    //console.log(check)
    if (check && bcrypt.compareSync(password, check.password)){
      let token = generateToken(check)
      res.status(200).json({message: `welcome, ${check.username}`, token: token})
    } else if (check === undefined){
      res.status(401).json({message: 'Invalid credentials'})
    }
  } catch (err) {
    next(err)
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


function generateToken (check) {
  const payload = {
    subject: check.id,
    username: check.username,
  }
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;
