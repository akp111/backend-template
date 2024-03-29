require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const initialiseRoutes = require("./routes/index").default
//middleware
app.use(express.json());
app.use(cors());
initialiseRoutes(app);

// servers starts listening
app.listen(4000, () => {
  console.log("Server started at 4000");
});