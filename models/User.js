import mongoose from "mongoose";
const UsersSchema = new mongoose.Schema({
    signup_type: { type: String },
    password: { type: String, required: true },
    user_phone: { type: String },
    gender: { type: String },
    birthday: { type: String },
    flags: { type: String, },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role_type: { type: Number },
    active: { type: Boolean },
    address: { type: String },
    image: { type: String },
    user_id: { type: String },
    total_adds: { type: Number },
    total_ratings: { type: Number },
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    },
    last_login: {
        type: Date
    },
    user_agent: {
        type: String
    },
},
    {
        timestamps: true
    }

);

const Users = mongoose.models.User || mongoose.model("User", UsersSchema);
export default Users