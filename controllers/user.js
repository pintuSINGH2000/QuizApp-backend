const { hashPassword, comparePassword } = require("../helper/hashPassword");
const User = require("../models/user");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (
      !name ||
      !email ||
      !password ||
      !emailRegex.test(email) ||
      !passwordRegex.test(password)
    ) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send({ errorMessage: "User already exists" });
    }
    const hashedPassword = await hashPassword((password));
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).send({ message: "Register Successfully" });
  } catch (err) {
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(409).send({ errorMessage: "User doesn't exists" });
    }
    const check = await comparePassword(password, user.password);
    if (!check) {
      return res.status(401).send({ errorMessage: "Invalid credentials" });
    }
    const token = JWT.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "60h",
    });
    res
      .status(200)
      .send({
        message: "Login successfully",
        token,
        name: user.name,
        userId: user._id,
      });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

module.exports = {
  registerController,
  loginController,
};
