const Joi = require('joi');
module.exports=(req,res,next)=>{
    const schema = Joi.object({
        email: Joi.string().email().min(3).max(50).required(),
        password: Joi.string().min(5).max(50),
    })
    const{error}= schema.validate(req.body)
    if(error)return res.status(400).send(error.message);

    next();

}