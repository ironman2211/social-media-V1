import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    console.log(req.body);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    delete savedUser.password;
    res.status(201).json({ savedUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log(token);
    delete user._doc.password;
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const googleLogin = async (req, res) => {
  let token = req.body.token;
  const response = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  );
  const userData = response.data;
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    const newUser = new User({
      firstName: userData.given_name,
      lastName: userData.family_name,
      email: userData.email,
      password: userData.sub,
      picturePath: userData.picture,
      friends: [],
      location: "",
      occupation: "",
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const user = await newUser.save();
    delete user._doc.password;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ user, token });
  } else {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user._doc.password;
    res.status(200).json({ user, token });
  }
};

const registerUser = () => {};
