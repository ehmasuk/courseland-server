const router = require("express").Router();

const chategoriesModel = require("../models//categoriesModel");
const slugify = require("slugify");

router.get("/", async (req, res) => {
    try {
        const categories = await chategoriesModel.find();
        return res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "name is required" });
    }

    try {
        const slug = slugify(name, {
            replacement: "-",
            lower: true,
            trim: true,
        });

        await chategoriesModel.create({ name, slug });
        return res.status(200).json({ message: "Created" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Id not found" });
    }
    try {
        await chategoriesModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;
