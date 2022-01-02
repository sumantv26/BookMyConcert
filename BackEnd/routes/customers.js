// const express = require('express'); 
// const { getOwnData, updateUserData, getUserById, getMulterForAvatar } = require('../controllers/usersController');
// const { authUsers, authCustomer, authAdmin } = require('../middleware/authUsers');
// const identifyRole = require('../middleware/identifyRole');
// const validateObjectId = require('../middleware/validateObjectId');
// const app = require('../startup/app');
// const router=express.Router();
// const upload=getMulterForAvatar()
// router.use(authUsers)
// router.get("/:id",authAdmin,validateObjectId,identifyRole,getUserById)
// router.get("/auth/me",authCustomer,identifyRole,getOwnData)
// router.put("/auth/me",authCustomer,identifyRole,upload.single('avatar'),updateUserData)
// module.exports=router