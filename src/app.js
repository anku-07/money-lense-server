const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(cors());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
