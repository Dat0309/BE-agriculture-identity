import mongoose from "mongoose";

const agricultureSchema = mongoose.Schema(
    {
        specific_name: {
            type: String,
            required: true,
        },
        common_name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "AgricultureType"
        },
        height_and_spread: {
            type: String,
            required: true,
        },
        family: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Agriculture = mongoose.model("Agriculture", agricultureSchema);

export default Agriculture;
