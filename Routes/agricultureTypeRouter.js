import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
import AgricultureType from "../Models/agricultureTypeModel.js";

const agricultureTypeRouter = express.Router();

/**
 * Get all agriculture type
 */
agricultureTypeRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};
    const count = await AgricultureType.countDocuments({ ...keyword });
    const agricultureTypes = await AgricultureType.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .skip({ _id: 1 });

    res.json({ agricultureTypes, count, page, pages: Math.ceil(count / pageSize) });
  })
);

/**
 * Admin get all
 */
agricultureTypeRouter.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const agricutureTypes = await AgricultureType.find({})
      .sort({ _id: -1 });

    res.json(agricutureTypes);
  })
);

/**
 * Get agricultureType by id
 */
agricultureTypeRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const agricultureType = await AgricultureType.findById(req.params.id);
    if (agricultureType) {
      res.json(agricultureType);
    } else {
      res.status(404).send('Agriculture type not Found');
      throw new Error("Agriculture type not found");
    }
  })
);

/**
 * Create agriculture type
 */
agricultureTypeRouter.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const agricultureTypeExist = await AgricultureType.findOne({ name });
    if (agricultureTypeExist) {
      res.status(400);
      throw new Error("Agriculture name already exist");
    } else {
      const agricultureType = new AgricultureType({
        name
      });
      if (agricultureType) {
        const createdAgricultureType = await agricultureType.save();
        res.status(201).json(createdAgricultureType);
      } else {
        res.status(400).send('Invalid agriculture type data');
        throw new Error("Invalid agriculture type data");
      }
    }
  })
);

/**
 * Update agriculture type
 */
agricultureTypeRouter.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const agricultureType = await AgricultureType.findById(req.param.id);
    if (agricultureType) {
      agricultureType.name = name || agricultureType.name;

      const updatedAgricultureType = await agricultureType.save();
      res.json(updatedAgricultureType);
    } else {
      res.status(404);
      throw new Error("Agriculture type not found");
    }
  })
);

/**
 * Delete agriculture type
 */
agricultureTypeRouter.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const agricultureType = await AgricultureType.findById(req.params.id);
    if (agricultureType) {
      await agricultureType.remove();
      res.json({ message: "Agriculture type deleted" });
    } else {
      res.status(404);
      throw new Error("Agriculture type not found");
    }
  })
);

export default agricultureTypeRouter;