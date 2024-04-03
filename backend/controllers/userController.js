const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.postRegister = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const createdUser = await User.create(req.body);

        // res.status(201).send({ name: name, token: token });
        res.status(201).json({ name: createdUser.first_name });
    } catch (error) {
        console.log(error);
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", error: error });
    }
}