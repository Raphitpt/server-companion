/**
 * Récupération des données de scolarité sur MMI Dashboard
 * @param {*} edu_mail
 * @param {*} semestre
 * @returns
 */
async function getAbsence(edu_mail, semestre) {
  const credentials = btoa(
    process.env.ABSENCE_USERNAME + ":" + process.env.ABSENCE_PASSWORD
  );

  const response = await fetch(
    `https://mmi-angouleme-dashboard.alwaysdata.net/api-v1/${semestre}/${edu_mail}?detailled=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic " + credentials,
      },
    }
  );
  const data = await response.json();
  return data;
}

module.exports = {
  getAbsence,
};
