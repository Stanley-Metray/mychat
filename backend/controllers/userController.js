const User = require('../models/user');
const bcrypt = require('bcrypt');
const authController = require('../controllers/authController');

module.exports.postRegister = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const createdUser = await User.create(req.body);

        const token = await authController.generateToken({ id: createdUser.id, email: createdUser.email });

        let tokens = [];
        if (createdUser.tokens && createdUser.tokens.length > 0) {
            tokens = JSON.parse(createdUser.tokens);
        }
        tokens.push(token);
        createdUser.tokens = JSON.stringify(tokens);

        await createdUser.save();
        res.status(201).json({ user: createdUser.first_name, success:true, token:token, message : "Registration Successful" });
    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success:false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success:false, error: error });
        console.log(error);
    }
}