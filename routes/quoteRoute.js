const mongoose = require("mongoose");
const Quote = mongoose.model("quotes");
const Day = require("../Day.js");
module.exports = (app) => {
  app.get(`/quotes/get`, async (req, res) => {
    try {
      const quotes = await Quote.find({});
      return res.send(quotes);
    } catch (error) {
      return res.send(error);
    }
  });

  app.post(`/quotes/post`, async (req, res) => {
    try {
      const quotePosted = new Quote({
        quote: req.body.quote,
        author: req.body.author,
      });
      await quotePosted.save();
      console.log("posting a new quote:", quotePosted);
      return res.send(quotePosted);
    } catch (error) {
      console.log("hey there's an err", error);
      return res.send(error);
    }
  });
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
};
