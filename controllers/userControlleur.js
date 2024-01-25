const db = require("../services/db");
const helper = require("../helper");
const bcrypt = require("bcrypt");
const mail = require("./mailControlleur");
const config = require("../config");

async function getUser(id_user) {
  const rows = await db.query(
    `SELECT id_user, pname, name, edu_mail, edu_group, pp_link, score, last_connection, notif_message, notif_infos FROM users WHERE id_user = ${id_user}`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

async function createUser(formData) {
  if (formData.password !== formData.confirmPassword) {
    return {
      message: "Les mots de passe ne correspondent pas ! ",
    };
  }
  console.log(formData.password);
  const encryptedPassword = await bcrypt.hash(formData.password, 10);

  const verify = await db.query("SELECT * FROM users WHERE edu_mail = ?", [
    formData.edu_mail,
  ]);

  if (verify.length > 0) {
    return {
      message: "L'utilisateur existe déjà",
    };
  } else {
    const result = await db.query(
      "INSERT INTO users (pname, name, edu_mail, password, edu_group) VALUES (?, ?, ?, ?, ?)",
      [
        formData.pname,
        formData.name,
        formData.edu_mail,
        encryptedPassword,
        "undefined",
      ]
    );

    let message = "Une erreur est survenue";
    if (result.affectedRows > 0) {
      const mailConfirm = await mail.sendConfirmationMail(
        "rtiphonet@gmail.com",
        "Raphaël",
        "123456789"
      );

      message = "L'utilisateur a bien été créé";
    }

    return { message };
  }
}

module.exports = {
  getUser,
  createUser,
};
