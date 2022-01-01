module.exports=(req,res,next)=>{
    if (!(req.user.role&&req.user.role==="manager")) return res.status(403).send("access denied")
    next()
}