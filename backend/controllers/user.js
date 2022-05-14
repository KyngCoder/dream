const mongoose = require("mongoose");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.find({ email });

    console.log(password,existingUser[0].password)

    if (!existingUser) {
      return res.status(404).json({ message: "User do not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser[0].password
    );

    if (!isPasswordCorrect) {
      console.log("wrong password");
      return res.status(400).json({ message: "Invalid credentials" });
    }
console.log('ksksk')
    const token = jwt.sign(
      { email: existingUser[0].email, id: existingUser[0].id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
      console.log(error)
    return res.status(500).json({ message: "something went wrong" });
  }
};

const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "password does not match" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  signin,
  signup
};
