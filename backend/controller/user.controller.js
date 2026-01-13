import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";
import jwt from "jsonwebtoken";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    // console.log(email,username,password);

    if (!email || !username || !password) {
      return res.status(400).json({ errors: "Please fill all the fields" });
    }

    const validation = userSchema.safeParse({ email, username, password });

    if (!validation.success) {
      // return res.status(400).json({errors: validation.error.errors});
      const errorMessage = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ errors: errorMessage });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    if (newUser) {
      const token = await generateTokenAndSaveInCookies(newUser._id, res);
      return res
        .status(201)
        .json({ message: "User registered successfully", newUser, token });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ errors: "Please fill all the fields" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }

    const token = await generateTokenAndSaveInCookies(user._id, res);
    res
      .status(200)
      .json({ message: "User logged in successfully", user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error logging in user" });
  }
};
export const logout = (req, res) => {
  try {
    const token = req.cookies?.jwt;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        User.findByIdAndUpdate(decoded.userId, { token: null }).catch(() => {});
      } catch (e) {
        /* ignore invalid token */
      }
    }
    res.clearCookie("jwt", {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error logging out user" });
  }
};
