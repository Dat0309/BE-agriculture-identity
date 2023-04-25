import express from "express";
import asyncHandler from "express-async-handler";
import babershops from "./data/babershopData.js";
import hairstyles from "./data/hairstyleData.js";
import orders from "./data/orderData.js";
import services from "./data/servicesData.js";
import users from "./data/userData.js";
import BaberShop from "./Models/babershop.js";
import HairStyle from "./Models/hairstyle.js";
import Order from "./Models/order.js";
import Services from "./Models/services.js";
import User from "./Models/user.js";
import Agriculture from "./Models/agicultureModel.js";
import AgricultureType from "./Models/agricultureTypeModel.js";


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
    const importAgriculture = await Agriculture.insertMany();
    res.send({ importAgriculture });
  })
);

ImportData.post(
  "/agricultureType",
  asyncHandler(async (req, res) => {
    await AgricultureType.deleteMany({});
    const importAgriculture = await AgricultureType.insertMany();
    res.send({ importAgriculture });
  })
);

export default ImportData;
