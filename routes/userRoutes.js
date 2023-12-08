const { signup, login, getSignup, getLogin } = require("../controllers/userControllers");

const router=require("express").Router()

router.post("/signup",signup)
router.get("/signup", getSignup);
router.post("/login",login)
router.get("/login",getLogin)

module.exports=router;