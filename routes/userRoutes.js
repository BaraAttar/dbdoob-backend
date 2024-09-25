const express = require("express");
const router = express.Router();

const {authToken} = require("../Middleware/auth")
const {adminPermissions} = require("../Middleware/adminPermissions")
const {getUsers , restoreUser} = require("../controllers/userController")


router.get("/", adminPermissions, getUsers);

router.get("/me", authToken , restoreUser);

module.exports = router; 