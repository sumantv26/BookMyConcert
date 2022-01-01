const express = require('express'); 
const { getManagerById, getOwnData, getMulterForAvatar, updateData } = require('../controllers/managersControler');
const authAdmin = require('../middleware/authAdmin');
const authManagers = require('../middleware/authManagers');
const authUsers = require('../middleware/authUsers');
const validateObjectId = require('../middleware/validateObjectId');
const router=express.Router()
const upload=getMulterForAvatar()
router.use(authUsers)
router.get("/:id",authAdmin,validateObjectId,getManagerById)
router.get("/me",authManagers,getOwnData)
router.put("/me",authManagers,upload.single('avatar'),updateData)
module.exports=router