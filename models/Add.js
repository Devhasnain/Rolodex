import mongoose from "mongoose";
const AddsSchema = new mongoose.Schema({
    image: [{ type: String }],
    business_name: { type: String },
    timing: [{ from: { type: String }, to: { type: String } }],
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    social_links: [
        { type: String }
    ],
    description: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    add_id: { type: String },
    category: { type: String },
    company: { type: Boolean },
    private_seller: { type: Boolean },
    address: {
        country: { type: String },
        city: { type: String },
        district: { type: String },
        zip_code: { type: String },
        street: { type: String },

    },
},
    {
        timestamps: true
    }

);

const Adds = mongoose.models.Add || mongoose.model("Add", AddsSchema);
export default Adds