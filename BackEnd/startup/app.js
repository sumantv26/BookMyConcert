const express = require("express");
const path = require("path");
// const images = require("../routes/images");
const errIdentifier = require("../utils/errIdentifier");
const userRouter = require("../routes/userRoutes");
const concertRouter = require("../routes/concertRoutes");
// const expRouter = require("../routes/expRouter");
// const adminRouter = require("../routes/adminRoutes");
const globalErrorHandler = require("../controllers/errorController");
require("./connectToDB")();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use("/api", images);
app.use("/user", userRouter);
app.use("/concert", concertRouter);
// app.use("/post", postRouter);
// app.use("/admin", adminRouter);

// for all unhandled routes
app.all("*", (req, res, next) => {
  errIdentifier.generateError(
    next,
    `Can't find ${req.originalUrl} on this server`,
    404
  );
});

app.use(globalErrorHandler);

module.exports = app;
