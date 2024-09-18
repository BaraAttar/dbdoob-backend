// TODO
const express = require("express");
const router = express.Router();

const {adminPermissions} = require("../Middleware/adminPermissions")
const {getUsers} = require("../controllers/userController")


router.get("/", adminPermissions, getUsers);

module.exports = router; 