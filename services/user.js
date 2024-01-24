const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getUser(id_user){
    const rows = await db.query(`SELECT id_user, pname, name, edu_mail, edu_group, pp_link, score, last_connection, notif_message, notif_infos FROM users WHERE id_user = ${id_user}`);
    const data = helper.emptyOrRows(rows);
    return {
        data,
    };
};

module.exports = {
    getUser
}