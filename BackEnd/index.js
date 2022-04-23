const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(`${err.name}: ${err.message}`);
  console.log("Uncaught Exception. Shutting Down...");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./startup/app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log("Listening to port " + PORT));

process.on("unhandledRejection", (err) => {
  console.log(`${err.name}: ${err.message}`);
  console.log("Unhandled Rejection. Shutting Down...");
  server.close(() => {
    process.exit(1);
  });
});
