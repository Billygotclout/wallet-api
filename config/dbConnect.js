const mongoose = require("mongoose");

const dbConnect = async (req, res) => {
  try {
    const connect = await mongoose.connect(process.env.DB_CONNECTION_STRING);

    console.log(
      "Database connected successfully: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
  }
};
module.exports = dbConnect;
