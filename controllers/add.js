import configurations from "../configurations.js";
import Adds from "../models/Add.js";
import Files from "../models/Files.js";
import { Errorhandler } from "../utils/Errorhandler.js"
import { v4 as uuid } from "uuid";

let get_adds_fields = [
    "image",
    "_id",
    "add_id",
    "business_name",
    "timing",
    "email",
    "location"
]
let get_add_fields = [
    "image",
    "_id",
    "add_id",
    "business_name",
    "timing",
    "location",
    "email",
    "description"
]
let get_user_add_fields = [
    "image",
    "_id",
    "add_id",
    "business_name",
    "timing",
    "location"
]

export const createAdd = async (req, res) => {
    try {
        let user = req.user;
        let file = req?.file ?? null;
        let addData = req.body;

        let add_id = uuid();

        let createAdd = await Adds.create(
            {
                user: user._id,
                add_id,
                ...addData
            }
        );

        if (file) {
            let uploadFile = await Files.create({
                add: createAdd._id,
                ...file
            });
            let saveFile = await uploadFile.save();
            createAdd.image = `${configurations.url}/add/image/${saveFile._id}`;
        }


        await createAdd.save();
        user.total_adds = user.total_adds ? user.total_adds + 1 : 1;
        await user.save();

        return res.status(200).json({ msg: "Add has been created successfuly.", status: true });

    } catch (error) {
        return Errorhandler(error, res)
    }
}

export const EditAdd = async (req, res) => {
    try {
        let user = req.user;
        console.log(user)
        let addData = req.body;
        console.log(addData)
        let file = req.file ?? null;
        let objectLength = Object?.keys(addData)?.length;

        let add = await Adds.findOne({ add_id: addData.add_id, user: user._id });

        console.log(add)

        if (file) {
            await Files.findOneAndUpdate({ add: add._id }, { $set: { ...file } });
        }

        if (objectLength) {
            for (const key in addData) {
                add[key] = addData[key];
                await add.save();
            }
        }

        return res.status(200).json({ msg: "Add updated successfuly", status: true });

    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const DeleteAdd = async (req, res) => {
    try {
        let { add_id } = req.params;
        let add = await Adds.findOne({ add_id });
        if (!add) {
            throw new Error("Add not found.");
        }
        await Adds.findOneAndDelete({ _id: add._id });
        await Files.findOneAndDelete({ add: add._id });
        return res.status(200).json({ msg: "Add has been deleted successfuly", status: true });
    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const GetAllAdds = async (req, res) => {
    try {
        let adds = await Adds.find().select(get_adds_fields);
        return res.status(200).json({ adds, status: true })
    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const GetAddById = async (req, res) => {
    try {
        let { id } = req.params;
        let add = await Adds.findOne({ add_id: id }).select(get_add_fields);
        if (!add) {
            throw new Error("Add not found.")
        }
        return res.status(200).json({ add, status: true })
    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const serveImage = async (req, res) => {
    try {
        let { id } = req.params;
        let file = await Files.findOne({ _id: id });
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(file.buffer);
    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const GetUserAdds = async (req, res) => {
    try {
        let user = req.user;

        let adds = await Adds.findOne({ user: user._id }).select(get_user_add_fields);

        return res.status(200).json({ adds, status: true });

    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const GetUserAddById = async (req, res) => {
    try {
        let { id } = req.params;
        let add = await Adds.findOne({ add_id: id }).select(get_add_fields);

        if (!add) {
            throw new Error("Add not found");
        }

        return res.status(200).json({ add, status: true });

    } catch (error) {
        return Errorhandler(error, res);
    }
}