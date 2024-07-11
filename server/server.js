const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const URI = process.env.MONGO_URL;  

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const calculationSchema = new mongoose.Schema({
  morningReading: Number,
  eveningReading: Number,
  price: Number,
  result: Number,
  timestamp: { type: Date, default: Date.now } 
});

const Calculation = mongoose.model("Calculation", calculationSchema);

app.post("/api/calculations", async (req, res) => {
  try {
    const { morningReading, eveningReading, price, result } = req.body;
    const newCalculation = new Calculation({
      morningReading,
      eveningReading,
      price,
      result,
      timestamp: new Date() 
    });
    await newCalculation.save();
    res.status(201).send(newCalculation);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/api/calculations", async (req, res) => {
  try {
    const calculations = await Calculation.find({});
    res.status(200).send(calculations);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/api/calculations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCalculation = await Calculation.findByIdAndDelete(id);
    if (!deletedCalculation) {
      return res.status(404).send({ error: "Calculation not found" });
    }
    res.status(200).send(deletedCalculation);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log("server running...........");
});








