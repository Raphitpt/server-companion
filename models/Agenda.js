const db = require("../services/db");
const helper = require("../helper");

/**
 * Récupérer les events de l'agenda
 * @param {*} id_user
 * @param {*} current_date
 * @param {*} current_week_year
 * @returns
 */
async function fetchAgenda(id_user, current_date, current_week_year) {
  const rows = await db.query(
    `SELECT a.*, s.* FROM agenda a JOIN sch_subject s ON a.id_subject = s.id_subject WHERE a.id_user = ${id_user} AND a.type != 'eval' AND a.type != 'devoir' AND (
    (a.date_finish LIKE '____-__-__' AND a.date_finish >= '${current_date}')
    OR
    (a.date_finish LIKE '____-W__' AND a.date_finish >= '${current_week_year}')
) ORDER BY a.title ASC`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}
/**
 * Récupérer les évalutations d'un groupe
 * @param {*} current_date
 * @param {*} current_week_year
 * @param {*} edu_group
 * @param {*} tdGroupAll
 * @param {*} eduGroupAll
 * @returns
 */
async function fetchEval(
  current_date,
  current_week_year,
  edu_group,
  tdGroupAll,
  eduGroupAll
) {
  const rows = await db.query(
    `SELECT a.*, s.*, u.name, u.pname, u.role 
    FROM agenda a 
    JOIN sch_subject s ON a.id_subject = s.id_subject 
    JOIN users u ON a.id_user = u.id_user 
    WHERE (a.edu_group = '${edu_group}' OR a.edu_group = '${tdGroupAll}' OR a.edu_group = '${eduGroupAll}') 
    AND a.type = 'eval' 
    AND (
    (a.date_finish LIKE '____-__-__' AND a.date_finish >= '${current_date}')
    OR
    (a.date_finish LIKE '____-W__' AND a.date_finish >= '${current_week_year}')
)
    ORDER BY a.title ASC`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}
/**
 * Récupérer les devoirs à faire d'un groupe
 * @param {*} id_user
 * @param {*} current_date
 * @param {*} current_week_year
 * @param {*} edu_group
 * @param {*} tdGroupAll
 * @param {*} eduGroupAll
 * @returns
 */
async function fetchDevoir(
  id_user,
  current_date,
  current_week_year,
  edu_group,
  tdGroupAll,
  eduGroupAll
) {
  const rows = await db.query(
    `SELECT a.*, s.*, u.name, u.pname, u.role, e.id_event
    FROM agenda a 
    JOIN sch_subject s ON a.id_subject = s.id_subject 
    LEFT JOIN event_check e ON a.id_user = e.id_user AND a.id_task = e.id_event
    JOIN users u ON a.id_user = u.id_user 
    WHERE (a.edu_group = '${edu_group}' OR a.edu_group = '${tdGroupAll}' OR a.edu_group = '${eduGroupAll}') 
    AND a.type = 'devoir'
    AND (e.id_user = ${id_user} OR e.id_user IS NULL) 
    AND (
    (a.date_finish LIKE '____-__-__' AND a.date_finish >= '${current_date}')
    OR
    (a.date_finish LIKE '____-W__' AND a.date_finish >= '${current_week_year}')
)
    ORDER BY a.title ASC`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

module.exports = {
  fetchAgenda,
  fetchEval,
  fetchDevoir,
};
