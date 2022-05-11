const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const Day = require("./Day");
const path = require("path");
const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs");
// const { findOneAndUpdate } = require("./Day");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB has been connected"))
  .catch((err) => console.log(err));

// defining the Express app
const app = express();

app.use(cors());
//import your models
require("./models/quote");

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.use(express.static("./uploads"));
// Accessing the path module

app.post("/updateDay", async (req, res) => {
  try {
    const found = await Day.findOne({ day: req.body.day });
    if (!found) {
      const insert = new Day(req.body);
      const result = await insert.save();
      return;
    } else {
      const upsert = await Day.findOneAndReplace(
        { day: req.body.day },
        req.body
      );
    }
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

async function readArray() {
  let res = new Array(4).fill("").map(async (v, i) => {
    return JSON.parse(
      await fs.readFileSync(`./Blocks/block0${i + 1}.json`, "utf8")
    );
  });
  return (await Promise.all(res)).reduce((p, c) => {
    return [...p, ...c];
  });
}

app.get("/template", async (req, res) => {
  res.send(await readArray());
});

app.get("/blockInsert", async (req, res) => {
  let data = await readArray();
  data.map(async (v) => {
    let insert = new Day(v);
    await insert.save();
  });
  res.send("success");
});

app.get("/schedule", async (req, res) => {
  let ret = await Day.find();
  ret.sort((a, b) =>
    Number(a.day) > Number(b.day) ? 1 : Number(b.day) > Number(a.day) ? -1 : 0
  );
  res.send(ret);
});

// Step 1:
app.use(express.static(path.resolve(__dirname, "../client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//import routes
require("./routes/quoteRoute.js")(app);

const PORT = process.env.PORT || 5000;

// Step 1:
app.use(express.static(path.resolve(__dirname, "./client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
