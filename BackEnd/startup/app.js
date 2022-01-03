const express = require("express");
// const auth = require("../routers/auth");
// const users = require("../routers/users");
// const userRouter = require("../routes/userRouter");
const managers = require("../routes/users");
const customers = require("../routes/customers");

const images = require("../routes/images");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/login", auth);
// app.use("/signup", users);
app.use("/api", images);
app.use("/users", managers);
// app.use("/users/customers",customers)

// for all unhandled routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
