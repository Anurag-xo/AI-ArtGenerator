// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { CustomError } = require("../middlewares/error");
//
// const registerController = async (req, res, next) => {
//   try {
//     const { password, username, email } = req.body;
//     const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//
//     if (existingUser) {
//       throw new CustomError("Username or email already exists", 400);
//     }
//
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hashSync(password, salt);
//
//     const newUser = new User({ ...req.body, password: hashedPassword });
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     next(error);
//   }
// };
//
// const loginController = async (req, res, next) => {
//   try {
//     let user;
//     if (req.body.email) {
//       user = await User.findOne({ email: req.body.email });
//     } else {
//       user = await User.findOne({ username: req.body.username });
//     }
//
//     if (!user) {
//       throw new CustomError("User not found!", 404);
//     }
//
//     const match = await bcrypt.compare(req.body.password, user.password);
//
//     if (!match) {
//       throw new CustomError("Wrong Credentials", 401);
//     }
//
//     const { password, ...data } = user._doc;
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRE,
//     });
//
//     res.cookie("token", token).status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// };
//
// const logoutController = async (req, res, next) => {
//   try {
//     res
//       .clearCookie("token", { sameSite: "none", secure: true })
//       .status(200)
//       .json("User logged out successfully");
//   } catch (error) {
//     next(error);
//   }
// };
//
// const refetchUserController = async (req, res, next) => {
//   const token = req.cookies.token;
//   jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
//     if (err) {
//       throw new CustomError(err, 404);
//     }
//     try {
//       const id = data._id;
//       const user = await User.findOne({ _id: id });
//       res.status(200).json(user);
//     } catch (error) {
//       next(error);
//     }
//   });
// };
//
// module.exports = {
//   registerController,
//   loginController,
//   logoutController,
//   refetchUserController,
// };
//

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CustomError } = require("../middlewares/error");

const registerController = async (req, res, next) => {
  try {
    const { password, username, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new CustomError("Username or email already exists", 400);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();

    // Respond with the saved user (excluding the password)
    const { password: _, ...userData } = savedUser._doc;
    res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError("Invalid credentials", 401);
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "1d", // Default to 1 day if not set
    });

    // Exclude password from the response
    const { password: _, ...userData } = user._doc;

    // Set token in cookie and respond
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust for cross-site cookies
      })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust for cross-site cookies
      })
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const refetchUserController = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new CustomError("No token provided", 401);
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // Exclude password from the response
    const { password: _, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  refetchUserController,
};
