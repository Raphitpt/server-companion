const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const date = new Date();
const current_date = date.toISOString().split("T")[0];


startDate = new Date(date.getFullYear(), 0, 1);
let days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
let currentWeek = Math.ceil((days + startDate.getDay() + 1) / 7);
if (currentWeek < 10) {
  currentWeek = "0" + currentWeek;
}
const current_week_year = date.getFullYear() + "-W" + currentWeek;

const sql_common_conditions = `AND (
    (a.date_finish LIKE '____-__-__' AND a.date_finish >= '${current_date}')
    OR
    (a.date_finish LIKE '____-W__' AND a.date_finish >= '${current_week_year}')
)`;

/**
 * Récupérer les événement qui ne sont pas des évaluation ou des devoirs d'un étudiants
 * 
 * @param {*} id_user 
 * @returns 
 */
async function getAgenda(id_user) {
  const rows = await db.query(
    `SELECT a.*, s.* FROM agenda a JOIN sch_subject s ON a.id_subject = s.id_subject WHERE a.id_user = ${id_user} AND a.type != 'eval' AND a.type != 'devoir' ${sql_common_conditions} ORDER BY a.title ASC`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}


/**
 * Récupérer les évaluations d'un groupe de TP ou TD
 * 
 * @param {*} edu_group 
 * @param {*} tdGroupAll 
 * @param {*} eduGroupAll 
 * @returns 
 */
async function getEval(edu_group, tdGroupAll, eduGroupAll) {
  const rows = await db.query(`SELECT a.*, s.*, u.name, u.pname, u.role 
    FROM agenda a 
    JOIN sch_subject s ON a.id_subject = s.id_subject 
    JOIN users u ON a.id_user = u.id_user 
    WHERE (a.edu_group = '${edu_group}' OR a.edu_group = '${tdGroupAll}' OR a.edu_group = '${eduGroupAll}') 
    AND a.type = 'eval' 
    ${sql_common_conditions}
    ORDER BY a.title ASC`);

  const data = helper.emptyOrRows(rows);

  return {
    data,
  };
}

/**
 * Récupérer les devoirs d'un groupe de TP ou TD
 * 
 * @param {*} id_user 
 * @param {*} edu_group 
 * @param {*} tdGroupAll 
 * @param {*} eduGroupAll 
 * @returns 
 */
async function getDevoir(id_user, edu_group, tdGroupAll, eduGroupAll) {
  const rows =
    await db.query(`SELECT a.*, s.*, u.name, u.pname, u.role, e.id_event
    FROM agenda a 
    JOIN sch_subject s ON a.id_subject = s.id_subject 
    LEFT JOIN event_check e ON a.id_user = e.id_user AND a.id_task = e.id_event
    JOIN users u ON a.id_user = u.id_user 
    WHERE (a.edu_group = '${edu_group}' OR a.edu_group = '${tdGroupAll}' OR a.edu_group = '${eduGroupAll}') 
    AND a.type = 'devoir'
    AND (e.id_user = ${id_user} OR e.id_user IS NULL)
    ${sql_common_conditions}
    ORDER BY a.title ASC`);

  const data = helper.emptyOrRows(rows);

  return {
    data,
  };
}

/**
 * Appel de toute les fonctions de l'agenda puis fusionne toutes les données
 * 
 * @param {*} id_user 
 * @param {*} edu_group 
 * @returns 
 */
async function mergedAgenda(id_user, edu_group) {
    const eduGroupArray = edu_group.split("-");
    const eduGroupAll = eduGroupArray[0] + "-ALL";

    const but = eduGroupArray[0];
    const tp = eduGroupArray[1];

    let tdGroupAll = "";

    if(tp == "TP1" || tp == "TP2"){
        tdGroupAll = but + "-TDA";
    } else if (tp == "TP3" || tp == "TP4"){
        tdGroupAll = but + "-TDB";
    }

  try {
    const agenda = await getAgenda(id_user);
    const evalData = await getEval(edu_group, tdGroupAll, eduGroupAll);
    const devoirData = await getDevoir(
      id_user,
      edu_group,
      tdGroupAll,
      eduGroupAll
    );
    const mergedAgenda = []
      .concat(agenda.data || [])
      .concat(evalData.data || [])
      .concat(devoirData.data || []);

    return {
      mergedAgenda,
    };
  } catch (error) {
    console.error("Un problème est survenu:", error);
    throw error;
  }
}


module.exports = {
  mergedAgenda,
};
