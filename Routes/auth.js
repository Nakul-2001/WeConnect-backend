const User = require("../Models/user");
const router = require("express").Router();
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/Register", async (req, res) => {
  try {

    const {username,fullname,password,confirmPassword,gender} = req.body;

    const user = await User.findOne({username:username});
    user && res.json("Username Already taken. Please try to enter new username");

    if(password != confirmPassword) res.json("Password do not match");

    const boyPic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlPic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
      username: username,
      fullname: fullname,
      password: cryptoJs.AES.encrypt(
        req.body.password,
        process.env.CRYPTO_SEC
      ).toString(),
      gender:gender,
      profilepic: gender == 'Male' ? boyPic : girlPic,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
    
  } catch (err) {
    res.json(err);
  }
});

//Login
router.post("/Login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.json("You are not a valid user");

    const originalPassword = cryptoJs.AES.decrypt(
      user.password,
      process.env.CRYPTO_SEC
    ).toString(cryptoJs.enc.Utf8);

    req.body.password != originalPassword && res.json("Wrong Credentials");

    const accessToken = jwt.sign(
      {
        id: user.id,
        password: user.password,
      },
      process.env.JWT_SEC
    );
    
    const { password, ...data } = user._doc;

    res.json({...data,accessToken});

  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
