const mongoose = require("mongoose");

const connectToDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("server is connected to DB");
    })
    .catch((error) => {
      console.log("Error connecting to DB", error.message);
      process.exit(1);
    });
};

module.exports = connectToDB
