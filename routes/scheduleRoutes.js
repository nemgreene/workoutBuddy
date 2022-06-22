const mongoose = require("mongoose");
const Day = require("../Day.js");
const fs = require("fs");

module.exports = (app) => {
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

  app.post("/singleInsert/:id", async (req, res) => {
    console.log(req.params.id);
    data = JSON.parse(
      await fs.readFileSync(`./Blocks/block${req.params.id}.json`, "utf8")
    );
    data.map(async (v) => {
      let insert = new Day(v);
      await insert.save();
    });
    res.send("success");
  });

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
