const express = require("express");
const router = express.Router();
const agendaService = require("../controllers/agendaController");

/* GET agenda listing. */
router.get("/:id/:group", async function (req, res, next) {
  try {
    res.json(await agendaService.mergedAgenda(req.params.id, req.params.group));
  } catch (err) {
    console.error(`Error while getting agenda `, err.message);
    next(err);
  }
});

/* GET eval listing. */
router.get("/eval", async function (req, res, next) {
  try {
    res.json(await agendaService.getEval(req.query.page));
  } catch (err) {
    console.error(`Error while getting eval `, err.message);
    next(err);
  }
});

/* GET devoir listing. */
router.get("/devoir", async function (req, res, next) {
  try {
    res.json(await agendaService.getDevoir(req.query.page));
  } catch (err) {
    console.error(`Error while getting devoir `, err.message);
    next(err);
  }
});

module.exports = router;
