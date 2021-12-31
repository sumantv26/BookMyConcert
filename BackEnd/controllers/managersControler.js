const multer = require('multer');
const { Manager } = require("../models/Manager")

exports.getMulterForAvatar=()=>{
    const multerStorage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,__dirname+"/../images/")
        },
        filename:(req,file,cb)=>{
            const ext=file.mimetype.split('/')[1]
            cb(null,`${req.user.role}-${req.user._id}-${file.fieldname}.${ext}`)
        }
    })
    const multerFilter=(req,file,cb)=>{
        if(file.mimetype.split('/')[1]==="png")
            cb(null,true)
        else cb(new Error("Not a PNG file"),false)
    }
    return multer({storage:multerStorage})
}

exports.getManagerById=async(req,res,next)=>{
   try{
    const manager=await Manager.findById(req.params.id).select("_id name email")
    if(!manager)return res.status(404).send("Manager Not Found.")
    res.status(200).send(manager)
   }
   catch(ex){
       console.log(ex.message)
       res.status(400).send("Invalid Argument")
   }
}

exports.getOwnData=async(req,res,next)=>{
    const manager = await Manager.findById(req.user._id).select('-password -__v');
    res.status(200).send(manager)
}

exports.updateData=async(req,res,next)=>{
    const newData=req.body
       const manager=await Manager.findOne({email:req.user.email})
       if(!manager)return res.status(400).send("can't update data try again leter")
       manager.avatar=req.file.filename
        manager.name=newData.name
        manager.email=newData.email
       await manager.save()
       res.status(200).send("updated successfully")
}