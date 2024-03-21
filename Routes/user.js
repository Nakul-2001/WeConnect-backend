const User = require("../Models/user");
const verifyToken = require("./verifyToken");
const router = require("express").Router();

//Delete User
router.delete('/',verifyToken,async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete({_id:req.user.id});
        res.json(user);
    }
    catch(err){
        console.log(err);
    }
});

//Get Users
router.get('/',verifyToken, async (req,res)=>{
    
    try{
        const senderId = req.user.id;
        const allUser = await User.find({_id:{$ne:senderId}}).select("-password");
        res.json(allUser);
    }
    catch(err){
        res.json(err);
    }

});

//Update


module.exports = router;