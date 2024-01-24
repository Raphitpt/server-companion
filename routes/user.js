const express = require("express");
const router = express.Router();
const userService = require("../services/user");

/* GET user listing. */

router.get("/:id_user", async function (req, res, next) {
  try {
    res.json(await userService.getUser(req.params.id_user));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});
router.post("/signup", async function (req, res, next) {
  try {
    const validateData = validateDataForm(req.body)
    if (!validateData) {
      res.json({ message: "Les données ne sont pas valides" });
      return;
    } else {
        res.json(await userService.createUser(req.body));
    }
  } catch (err) {
    console.error(`Error while creating user `, err.message);
    next(err);
  }
});

function validateDataForm(body) {
  if (
    body.pname === undefined ||
    body.name === undefined ||
    body.edu_mail === undefined ||
    body.password === undefined ||
    body.confirmPassword === undefined
  ) {
    return false;
  }

  if (!body.edu_mail.includes("@etu.univ-poitiers.fr")) {
    return false;
  }

  if (body.password !== body.confirmPassword) {
    return false;
  }

  return true;
}

module.exports = router;
