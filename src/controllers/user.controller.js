const userModel = require("../models/user.model");


const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}   


module.exports = { getAllUsers }