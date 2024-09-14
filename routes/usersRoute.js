const router = require("express").Router();
const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const { createToken, compareToken } = require("../lib/jwt");

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const user = await usersModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "user not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(400).json({ message: "inavlid password" });
    }

    const token = await createToken(user._id);

    res.cookie("token", token);

    return res.status(200).json({ message: "user loged in" });
});

/* -------------------------------------------------------------------------- */
/*                                   LOGOUT                                   */
/* -------------------------------------------------------------------------- */
router.get("/logout", async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Loged out!" });
});

/* -------------------------------------------------------------------------- */
/*                                  REGISTER                                  */
/* -------------------------------------------------------------------------- */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const isExist = await usersModel.findOne({ email });
        if (isExist) {
            return res.status(400).json({ message: "Email exist" });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const encriptPassword = bcrypt.hashSync(password, 10);

        const user = await usersModel.create({ name, email, password: encriptPassword });
        if (!user) {
            return res.status(400).json({ message: "Somethign went wrong" });
        }

        const token = await createToken(user._id);

        res.cookie("token", token);
        return res.status(200).json({ message: "User created" });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message });
    }
});

/* -------------------------------------------------------------------------- */
/*                                     ME                                     */
/* -------------------------------------------------------------------------- */
router.get("/me", async (req, res) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(400).json({ message: "Token not found" });
    }

    const validToken = compareToken(token);

    if (!validToken) {
        return res.status(400).json({ message: "Invalid token" });
    }

    const user = await usersModel.findById(validToken.id).select("-password");

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
});

module.exports = router;
