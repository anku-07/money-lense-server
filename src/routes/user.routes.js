const express = require("express");
const userControllers = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", protect, userControllers.getAllUsers);

module.exports = router;