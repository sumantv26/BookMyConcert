const axios = require("axios");

const URL = `https://api.countrystatecity.in/v1/countries/IN/cities`;

let headers = { "X-CSCAPI-KEY": "API_KEY" };

axios
  .get(URL, headers)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
