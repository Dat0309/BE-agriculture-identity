import express from "express";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
import asyncHandler from "express-async-handler";
import Agriculture from "../Models/agicultureModel.js";
import * as tf from "@tensorflow/tfjs";

const agricultureRouter = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     description:  Get all agriculture support pagination
 */
agricultureRouter.get(
    '/',
    asyncHandler(async (req, res) => {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword
            ? {
                common_name: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
                specific_name: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            }
            : {};
        const count = await Agriculture.countDocuments({ ...keyword });
        const agricultures = await Agriculture.find({ ...keyword })
            .sort({ _id: -1 });

        res.json({ agricultures });
    })
);

/**
 * @swagger
 * /:
 *   get:
 *     description: Admin get all Agriculture
 */
agricultureRouter.get(
    "/all",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const agricultures = await Agriculture.find({}).sort({ _id: 1 });
        res.json(agricultures);
    })
);

/**
 * @swagger
 * /:
 *   get:
 *     description: Get agriculture by type id
 */
agricultureRouter.get(
    "/type-id/:typeId",
    asyncHandler(async (req, res) => {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;
        const typeId = req.params.typeId;
        const count = await Agriculture.countDocuments({});
        const agricultures = await Agriculture.find({ type: typeId })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ _id: -1 });

        res.json({ agricultures, page, pages: Math.ceil(count / pageSize) });
    })
);

/**
 * @swagger
 * /:
 *   get:
 *     description: Get agriculture by name
 */
agricultureRouter.get(
    '/get-by-name',
    asyncHandler(async (req, res) => {
        const agriculture = await Agriculture.find({ specific_name: req.query.name });
        if (agriculture) {
            res.json({agriculture})
        } else {
            res.status(404).send("Not found agriculture by name" + req.params.name);
            throw new Error("Not found agriculture by name" + req.params.name);
        }
    })
);

/**
 * @swagger
 * /:
 *   get:
 *     description: Get agriculture by id
 */
agricultureRouter.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const agriculture = await Agriculture.findById(req.params.id);
        if (agriculture) {
            res.json(agriculture)
        } else {
            res.status(404).send("Not found agriculture by id" + req.params.id);
            throw new Error("Not found agriculture by id" + req.params.id);
        }
    })
);

/**
 * @swagger
 * /:
 *   post:
 *     description: Create agriculture
 */
agricultureRouter.post(
    "/recognization",
    asyncHandler(async (req, res) => {
        const model = await tf.loadModel("E:\FINAL\DO-AN-NAY-BI-QUY-AM\backend\BE-agriculture-identity\data\agriculture_model.h5");
        const image = req.file.image.data;
        const imageBuffer = Buffer.from(image);
        const imageTensor = tf.node.decodeImage(imageBuffer);

        const processedImageTensor = preprocessImage(imageTensor);
        const prediction = model.predict(processedImageTensor);

        var recog_agriculture = prediction.arraySync();
        if (recog_agriculture) {
            res.json({ recog_agriculture });
        } else {
            res.json("Error");
        }
    })
)

/**
 * @swagger
 * /:
 *   post:
 *     description: Create agriculture
 */
agricultureRouter.post(
    "/",
    asyncHandler(async (req, res) => {
        const {
            specific_name,
            common_name,
            image,
            description,
            type,
            height_and_spread,
            family,
        } = req.body;

        const agriculture = new Agriculture({
            specific_name,
            common_name,
            image,
            description,
            type,
            height_and_spread,
            family,
        });

        const createdAgriculture = await agriculture.save();
        res.status(201).json(createdAgriculture);
    })
);

/**
 * @swagger
 * /:
 *   put:
 *     description: Update agriculture
 */
agricultureRouter.put(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
        const {
            specific_name,
            common_name,
            image,
            description,
            type,
            height_and_spread,
            family,
        } = req.body;
        const agriculture = await Agriculture.findById(req.params.id);

        if (agriculture) {
            agriculture.specific_name = specific_name || agriculture.specific_name;
            agriculture.common_name = common_name || agriculture.common_name;
            agriculture.image = image || agriculture.image;
            agriculture.description = description || agriculture.description;
            agriculture.type = type || agriculture.type;
            agriculture.height_and_spread = height_and_spread || agriculture.height_and_spread;
            agriculture.family = family || agriculture.family;

            const updatedAgriculture = await agriculture.save();
            res.json(updatedAgriculture);
        } else {
            res.status(404).send('Cant find agriculture');
            throw new Error("Cant find agriculture");
        }
    })
);

/**
 * @swagger
 * /:
 *   delete:
 *     description: Delete agriculture
 */
agricultureRouter.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const agriculture = await Agriculture.findById(req.params.id);
        if (agriculture) {
            await agriculture.remove();
            res.json({ message: "Succedded to delete this agriculture" });
        } else {
            res.status(404).send('Cant find agriculture');
            throw new Error("Cant find agriculture");
        }
    })
);

export default agricultureRouter;