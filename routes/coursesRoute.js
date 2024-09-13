const router = require("express").Router();
const coursesModel = require("../models/coursesModel");
const slugify = require("slugify");
const uploadCloudinary = require("../lib/uploadCloudinary");

router.get("/", async (req, res) => {
    const { slug } = req.query;

    try {
        if (slug) {
            const courses = await coursesModel.findOne({ slug });
            return res.status(200).json(courses);
        }

        const courses = await coursesModel.find();
        return res.status(200).json(courses);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

/* -------------------------------------------------------------------------- */
/*                                CREATE COURSE                               */
/* -------------------------------------------------------------------------- */
router.post("/", async (req, res) => {
    const { title, price, description, image, categoryId } = req.body;

    if (!title || !price || !description || !image || !categoryId) {
        return res.status(400).json({ message: "title,price,description,image,categoryId required" });
    }

    const slug = slugify(title, {
        replacement: "-",
        lower: true,
        trim: true,
    });

    try {
        const result = await uploadCloudinary.uploader.upload(image, {
            folder: "courseland",
        });

        if (!result) {
            return res.status(400).json({ message: "cannot upload image to cloudinay" });
        }

        await coursesModel.create({ title, price, description, image: result.secure_url, categoryId, slug });

        return res.status(200).json("created");
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

/* -------------------------------------------------------------------------- */
/*                                DELETE COURSE                               */
/* -------------------------------------------------------------------------- */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID not found" });
    }
    try {
        await coursesModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;
