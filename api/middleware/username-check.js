const Auth = require('../auth/auth-model')

function checkCredentials (req, res, next) {
    const {username, password} = req.body
    if (!username || !password) {
        res.status(400).json({
            message:"username and password required"    
        })
    } 
    else {
        next();  
    }  
  }

async function checkUsernameUnique (req, res, next) {
    const {username} = req.body
    try {
        const isUsername = await Auth.findByUsername(username)
        if(isUsername) {
            res.status(400).json({
                message: "username taken"
            })    
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    checkCredentials,
    checkUsernameUnique
}