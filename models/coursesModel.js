const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        categoryId: { type: String, required: true },
        slug: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("courses", courseSchema);
