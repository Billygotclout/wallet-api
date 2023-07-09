const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 3001;
dbConnect();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});
app.use(errorHandler);
app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});
