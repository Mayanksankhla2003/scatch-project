const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) {
            req.flash("error", "You already have an account, Please Login!");
            res.redirect("/");
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });
                    let token = generateToken(user);
                    res.cookie("token", token);
                    res.redirect("/shop");
                }
            });
        });
    } catch (error) {
        res.send(error.message);
    }
};

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
        req.flash("error", "Email or Password Incorrect");
        return res.redirect("/");
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect("/shop");
        } else {
            req.flash("Email or Password Incorrect");
            res.redirect("/");
        }
    });
};

module.exports.logout = async (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
};