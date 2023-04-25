import mongoose from "mongoose"

const agricultureTypeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const AgricultureType = mongoose.model("AgricultureType", agricultureTypeSchema);

export default AgricultureType;