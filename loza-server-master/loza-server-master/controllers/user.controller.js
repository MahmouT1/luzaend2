import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { createToken } from "../utils/token/createToken.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "error" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      createToken(user, 201, res);
    }
  } catch (error) {
    console.log("user controller error (register) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    createToken(user, 200, res);
  } catch (error) {
    console.log("user controller error (login) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("user controller error (logout) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET USER INFO (TO CHECK IF IS LOGGED IN OR NOT)
export const getUserInfo = async (req, res) => {
  try {
    const { user } = req;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("user controller error (getUserInfo) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// SOCIAL AUTH
export const socialAuth = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      const user = await User.create({ email, name });

      createToken(user, 201, res);
    } else {
      createToken(userExist, 200, res);
    }
  } catch (error) {
    console.log("user controller error (socialAuth) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET USER PROFILE WITH POINTS AND PURCHASE INFO
export const getUserProfile = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // The user object is already the full user from the database
    // No need to fetch it again
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        totalPurchases: user.totalPurchases,
        purchasedProductsCount: user.purchasedProducts.length
      }
    });
  } catch (error) {
    console.log("user controller error (getUserProfile) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET USER'S PURCHASED PRODUCTS
export const getPurchasedProducts = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // The user object is already the full user from the database
    // Just populate the purchasedProducts if needed
    const userWithProducts = await User.findById(user._id)
      .select('purchasedProducts')
      .populate('purchasedProducts.productId', 'name image');

    if (!userWithProducts) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      purchasedProducts: userWithProducts.purchasedProducts
    });
  } catch (error) {
    console.log("user controller error (getPurchasedProducts) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE USER POINTS
export const updateUserPoints = async (req, res) => {
  try {
    const { user } = req;
    const { points } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userData = await User.findByIdAndUpdate(
      user._id,
      { $inc: { points: points } },
      { new: true }
    ).select('-password');

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Points updated successfully",
      user: {
        _id: userData._id,
        points: userData.points
      }
    });
  } catch (error) {
    console.log("user controller error (updateUserPoints) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
