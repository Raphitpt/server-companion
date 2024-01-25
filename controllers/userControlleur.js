const bcrypt = require("bcrypt");
const mail = require("./mailControlleur");
const User = require("../models/User");
const config = require("../config");

async function createUser(formData) {
  if (formData.password !== formData.confirmPassword) {
    return {
      message: "Les mots de passe ne correspondent pas ! ",
    };
  }
  console.log(formData.password);
  const encryptedPassword = await bcrypt.hash(formData.password, 10);

  const verify = await User.fetchUser(formData.edu_mail);

  if (verify.length > 0) {
    return {
      message: "L'utilisateur existe déjà",
    };
  } else {
    const result = await User.saveUser(
      formData.pname,
      formData.name,
      formData.edu_mail,
      encryptedPassword,
      "undefined"
    );

    let message = "Une erreur est survenue";
    if (result.affectedRows > 0) {
      await mail.sendConfirmationMail(
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
  createUser,
};
