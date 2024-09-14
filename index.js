const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
var cookieParser = require("cookie-parser");

const coursesRoute = require("./routes/coursesRoute");
const usersRoute = require("./routes/usersRoute");
const categoriesRoute = require("./routes/categoriesRoute");
const connectDb = require("./lib/connectDb");

// create server
app.listen(process.env.PORT, () => {
    console.log(`listening on port http://localhost:${process.env.PORT}`);
});

// connect databse
connectDb();

// middlewares
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/courses", coursesRoute);
app.use("/api/users", usersRoute);
app.use("/api/categories", categoriesRoute);
