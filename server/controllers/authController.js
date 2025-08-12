const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Enregistrement utilisateur
const userRegister = async (req, res) => {
  try {
    const { name, email, password, address, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, address, profileImage });
    await newUser.save();

    // On retire le mot de passe du retour
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userToReturn,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Connexion utilisateur
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
  { id: existingUser._id, itemType: existingUser.itemType /* ou __t */ },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);


    // On retire le mot de passe du retour
    const userToReturn = existingUser.toObject();
    delete userToReturn.password;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userToReturn,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports ={userRegister, userLogin};