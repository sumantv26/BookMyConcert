const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DB_CONNECTION_STR)
  .then(() => console.log("SUCCESSFULLY CONNECTED TO DATABASE"))
  .catch((ex) => {
    console.error("Error: " + ex.message);
    throw new Error("CAN'T CONNECT TO DATABASE");
  });

const reasonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
});

const reasonsArr = [
  "It is fake. Concert isn't happenning",
  "Venue Details are wrong",
  "Management is very poor",
  "Committed artist/s are missing",
  "Didn't enojoyed",
];

const ReportReasons = mongoose.model("report_reason", reasonSchema);

const createInDB = async () => {
  for (reason of reasonsArr) {
    await ReportReasons.create({ title: reason });
  }
  process.exit();
};

createInDB();
