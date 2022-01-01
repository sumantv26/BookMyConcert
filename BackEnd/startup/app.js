const express = require("express");
// const auth = require("../routers/auth");
// const users = require("../routers/users");
const userRouter = require("../routes/userRouter");
const managers = require("../routes/managers");
const images = require("../routes/images");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/login", auth);
// app.use("/signup", users);
app.use("/api",images)
app.use("/users", userRouter);
app.use("/users/managers",managers)


module.exports = app;
