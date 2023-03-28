const mongoose = require("mongoose");
const Day = require("../Day.js");
const fs = require("fs");

module.exports = (app) => {
  let interval;

  function keepAlive(req, res) {
    if (interval) return res.end();

    console.log("Pinging Server");

    interval = setInterval(() => {
      fetch("https://workoutbuddymern.onrender.com/keep-alive").catch((err) => {
        /*handle error here*/
      });
    }, 30000);

    return res.end();
  }
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
    console.log(req.headers.userip);
    let ret = await Day.find();
    ret.sort((a, b) =>
      Number(a.day) > Number(b.day) ? 1 : Number(b.day) > Number(a.day) ? -1 : 0
    );
    res.send(ret);
  });

  app.get("/keep-alive", keepAlive);

  app.get("/cycleReset", async (req, res) => {
    let ret = await Day.find();
    ret.map(async (d) => {
      updated = d.exercises.map((e) => ({
        ...e,
        legacy: e.legacy ? [...e.legacy, e.weight] : [e.weight],
        weight: "",
      }));
      await Day.findByIdAndUpdate(d._id, {
        exercises: updated,
        complete: false,
      });
    });
    res.send("ok");
  });
};
