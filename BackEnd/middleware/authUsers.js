const jwt = require('jsonwebtoken');
const config = require('config');

module.exports=(req,res,next)=>{
    const token=req.header('x-auth-token')
    if(!token) return res.status(401).send("No token provided. Access Denied. login/signup again.")
    try{
        const decode=jwt.verify(token, config.get("jwtKey"))
        req.user=decode
        next()
    }
    catch(ex){
        res.send(400).send("Invalid token!")
    }
}