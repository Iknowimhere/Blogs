const {loginWrapper,signupWrapper}=require("../utils/auth")
const User=require("../models/User")


const login=loginWrapper(User)
const signup=signupWrapper(User)
const getSignup = (req, res) => {
  res.render("userSignup");
};
const getLogin = (req, res) => {
  res.render("userLogin");
};



module.exports={
login,signup,getSignup,getLogin
}