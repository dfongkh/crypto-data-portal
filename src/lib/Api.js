import axios from "axios";

export const getData = async () => {
  const config = {
    header: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      // "Origin, Methods, Content-Type, Authorization",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return await axios
    .get("/api/markets", config) //https://ftx.com
    .then((res) => {
      console.log(res.data);
      // res = formatData(res);
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
