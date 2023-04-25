import express from "express";
import asyncHandler from "express-async-handler";
import users from "./data/users.js";
import User from "./Models/user.js";
import Agriculture from "./Models/agicultureModel.js";
import AgricultureType from "./Models/agricultureTypeModel.js";
import agricultures from "./data/agricultures.js";
import agricultureTypes from "./data/agricultureTypes.js";


const ImportData = express.Router();

ImportData.post(
  "/user",
  asyncHandler(async (req, res) => {
    await User.deleteMany({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
  })
);

ImportData.post(
  "/agriculture",
  asyncHandler(async (req, res) => {
    await Agriculture.deleteMany({});
    const importAgriculture = await Agriculture.insertMany(agricultures);
    res.send({ importAgriculture });
  })
);

ImportData.post(
  "/agricultureType",
  asyncHandler(async (req, res) => {
    await AgricultureType.deleteMany({});
    const importAgriculture = await AgricultureType.insertMany(agricultureTypes);
    res.send({ importAgriculture });
  })
);

export default ImportData;
