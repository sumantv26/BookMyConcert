const express = require("express");
// const auth = require("../routers/auth");
// const users = require("../routers/users");
const userRouter = require("../routes/userRouter");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use("/login", auth);
// app.use("/signup", users);

app.use("/users", userRouter);

module.exports = app;
