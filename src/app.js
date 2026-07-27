const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/error.middleware")
const app = express();
app.use(cors());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const userAccountRoutes = require("./routes/account.route");


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/account", userAccountRoutes);


app.use(errorHandler);

module.exports = app;
