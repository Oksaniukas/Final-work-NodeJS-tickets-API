import { v4 as uuidv4 } from "uuid";
import UserModel from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SIGN_UP = async function (req, res) {
  try {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.moneyBalance
    ) {
      return res.status(400).json({
        message: "you didn't provided necessary data",
      });
    }

    /***email validation */
    const email = req.body.email;
    const emailRegex = /@/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email must contain "@" symbol' });
    }
    // ======================

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email was registered" });
    }

    /***name validation */
    const capitalizeFirstLetter = (name) => {
      return name.charAt(0).toUpperCase() + name.slice(1);
    };

    let name = req.body.name;
    name = capitalizeFirstLetter(name);
    // ======================

    /*** Password validation ***/
    const password = req.body.password;
    const passwordRegex = /^(?=.*[0-9]).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and contain at least one number",
      });
    }
    // ======================

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = {
      email: req.body.email,
      name: name /***name validation */,
      moneyBalance: req.body.moneyBalance,
      id: uuidv4(),
      password: hash,
    };

    const newUser = await new UserModel(user);
    await newUser.save();

    return res.status(200).json({
      user: newUser,
      message: "new user was successfully registered",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error " });
  }
};

const LOGIN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Your email or password is bad" });
    }

    const isPasswordMatch = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Your email or password is bad" });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .json({ message: "successfully Login", accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error " });
  }
};

const REFRESH_TOKEN = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: "Refresh token not found, please login again" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await UserModel.findOne({ id: payload.userId });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .status(200)
      .json({
        message: "Token was refresh successfully",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
  } catch (err) {
    console.error(err);
    res
      .status(403)
      .json({ message: "Invalid refresh token, User needs to login again" });
  }
};

const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find();

    const sortedUsers = users.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

    return res.status(200).json({ users: sortedUsers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

const GET_USER_BY_ID = async (req, res) => {
  try {
    const response = await UserModel.findOne({ id: req.params.id });

    await response.save();

    return res.status(200).json({ user: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error in application" });
  }
};

const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const userId = req.params.id;

    const userWithTickets = await UserModel.aggregate([
      { $match: { id: userId } },
      {
        $lookup: {
          from: "tickets",
          localField: "boughtTickets",
          foreignField: "_id",
          as: "boughtTickets",
        },
      },
    ]);

    if (!userWithTickets.length) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: userWithTickets[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error in application" });
  }
};

export {
  SIGN_UP,
  LOGIN,
  REFRESH_TOKEN,
  GET_USER_BY_ID,
  GET_ALL_USERS,
  GET_USER_BY_ID_WITH_TICKETS,
};
