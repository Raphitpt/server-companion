const db = require("../services/db");
const helper = require("../helper");

async function getUsers() {
  const rows = await db.query(
    `SELECT id_user, pname, name, edu_mail, edu_group, pp_link, score, last_connection, notif_message, notif_infos FROM users`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

async function getUser(id_user) {
  const rows = await db.query(
    `SELECT id_user, pname, name, edu_mail, edu_group, pp_link, score, last_connection, notif_message, notif_infos FROM users WHERE id_user = ${id_user}`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

async function fetchUser(edu_mail) {
  const rows = await db.query(
    `SELECT id_user, pname, name, edu_mail, edu_group, pp_link, score, last_connection, notif_message, notif_infos FROM users WHERE edu_mail = ${edu_mail}`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

async function saveUser(pname, name, edu_mail, password, edu_group) {
  const result = await db.query(
    "INSERT INTO users (pname, name, edu_mail, password, edu_group) VALUES (?, ?, ?, ?, ?)",
    [pname, name, edu_mail, password, edu_group]
  );

  let message = "Une erreur est survenue";
  if (result.affectedRows > 0) {
    message = "L'utilisateur a bien été créé";
  }

  return { message };
}

module.exports = {
  getUsers,
  getUser,
  saveUser,
  fetchUser,
};
