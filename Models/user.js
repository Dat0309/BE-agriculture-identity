import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        admin: {
            type: Boolean,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

/**
 * Login function
 */
userSchema.methods.matchPassword = async function (enterPassword){
    return enterPassword == this.password;
};

/**
 * Register function
 */
userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    const saltPassword = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltPassword);
});

const User = mongoose.model("User", userSchema);
export default User;
