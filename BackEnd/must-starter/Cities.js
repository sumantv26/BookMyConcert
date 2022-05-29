const axios = require("axios");
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

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  coordinates: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
  },
});

const Cities = mongoose.model("cities", citySchema);

(async () => {
  const where = encodeURIComponent(
    JSON.stringify({
      population: {
        $gt: 1000000,
      },
    })
  );

  const response = await axios.get(
    `https://parseapi.back4app.com/classes/Indiacities_india_cities_database?count=1&limit=20&order=-population&keys=ascii_name,latitude,longitude,createdAt&where=${where}`,
    {
      headers: {
        "X-Parse-Application-Id": "yMMyWP3mSj51OeUFb8enqQ5zdYQu0V2XAAx67Dq5",
        "X-Parse-REST-API-Key": "K5hUeP088ezVmiOCOh7mGCbRRTo1dlnCID8HYOyR",
      },
    }
  );
  const data = response.data.results;
  const reqData = data.map((city) => {
    return {
      name: city.ascii_name.toLowerCase(),
      coordinates: { longitude: city.longitude, latitude: city.latitude },
    };
  });
  const cities = await Cities.insertMany(reqData, {
    new: true,
    runValidators: true,
  });
  console.log(cities);
  process.exit(0);
})();
