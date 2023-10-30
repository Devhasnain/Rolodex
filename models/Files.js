import mongoose from "mongoose";

const FilesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    add: { type: mongoose.Schema.Types.ObjectId, ref: "Add" },
    fieldname: { type: String },
    originalname: { type: String },
    encoding: { type: String },
    mimetype: { type: String },
    buffer: { type: Buffer },
    size: { type: Number },
},
    {
        timestamps: true
    }

);

const Files = mongoose.models.File || mongoose.model("File", FilesSchema);
export default Files;