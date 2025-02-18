const User = require("../models/User");
const { CustomError } = require("../middlewares/error");

const getUserController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError("No user found", 404);
    }

    const { password, ...data } = user;
    res.status(200).json(data._doc);
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req, res, next) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      throw new CustomError("User not found", 404);
    }

    Object.assign(userToUpdate, updateData);

    await userToUpdate.save();

    res
      .status(200)
      .json({ message: "User updated succesfully", user: userToUpdate });
  } catch (error) {
    next(error);
  }
};

const buyCredit = async (req, res, next) => {
  const { userId } = req.params;
  const updateData = req.body;
  try {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      throw new CustomError("User not found", 404);
    }

    if (updateData.hasOwnProperty("credit")) {
      userToUpdate.credit = updateData.credit;
    }

    await userToUpdate.save();

    res
      .status(200)
      .json({ messgae: "Credit updated succesfully", user: userToUpdate });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserController,
  updateUserController,
  buyCredit,
};
