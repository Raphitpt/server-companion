const express = require("express");
const router = express.Router();
const scolariteService = require("../models/Scolarite");

/* GET scolarite listing. */

router.get("/:mail/:semestre", async function (req, res, next) {
  try {
    res.json(
      await scolariteService.getAbsence(req.params.mail, req.params.semestre)
    );
  } catch (err) {
    console.error(
      `Une erreur est survenu pour récupérer les absences `,
      err.message
    );
    next(err);
  }
});

module.exports = router;
