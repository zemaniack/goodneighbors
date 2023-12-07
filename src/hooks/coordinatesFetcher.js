// components/CoordinatesFetcher.js

import axios from "axios";

const getCoordinates = async (address) => {
  return new Promise((resolve, reject) => {
    console.log("address", address);
    // From site
    var api_key = "4ff70732d9d645209e83a8719de6935a";
    var returnCoordinates = [];

    // forward geocoding example (address to coordinate)
    var query = "252 West Ave, Buffalo, NY 14201";
    // note: query needs to be URI encoded (see below)

    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      api_key +
      "&q=" +
      encodeURIComponent(query) +
      "&pretty=1" +
      "&no_annotations=1";

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        returnCoordinates.push(data.results[0].geometry);
        resolve(data.results[0].geometry);
      } else if (request.status <= 500) {
        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send();
  });
};

export default getCoordinates;
