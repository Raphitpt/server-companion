const Agenda = require("./../models/agenda");
const date = new Date();
const current_date = date.toISOString().split("T")[0];

startDate = new Date(date.getFullYear(), 0, 1);
let days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
let currentWeek = Math.ceil((days + startDate.getDay() + 1) / 7);
if (currentWeek < 10) {
  currentWeek = "0" + currentWeek;
}
const current_week_year = date.getFullYear() + "-W" + currentWeek;

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

  if (tp == "TP1" || tp == "TP2") {
    tdGroupAll = but + "-TDA";
  } else if (tp == "TP3" || tp == "TP4") {
    tdGroupAll = but + "-TDB";
  }

  try {
    const agenda = await Agenda.fetchAgenda(
      id_user,
      current_date,
      current_week_year
    );
    const evalData = await Agenda.fetchEval(
      edu_group,
      tdGroupAll,
      eduGroupAll,
      current_date,
      current_week_year
    );
    const devoirData = await Agenda.fetchDevoir(
      id_user,
      edu_group,
      tdGroupAll,
      eduGroupAll,
      current_date,
      current_week_year
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
