const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host : process.env.SERVEUR_MAIL,
    port : process.env.MAIL_PORT,
    secure : true,
    auth : {
        user : process.env.MAIL_USERNAME,
        pass : process.env.MAIL_PASSWORD
    },
});

async function sendConfirmationMail(mail, pname, activation_code){

    const info = await transporter.sendMail({
        from : process.env.MAIL_USERNAME,
        to : mail,
        subject : "Confirmation de votre compte",
        html : `<p>Bonjour ${pname},</p>
        <p>Vous avez demandé la création d'un compte sur le site de l'association MMI'Z.</p>
        <p>Pour confirmer votre compte, veuillez cliquer sur le lien suivant : <a href="http://localhost:3000/user/confirm/${activation_code}">http://localhost:3000/user/confirm/${activation_code}</a></p>
        <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.</p>
        <p>Cordialement,</p>
        <p>L'équipe MMI'Z.</p>`
    });

    console.log("Message sent: %s", info.messageId);

}
module.exports = {
    sendConfirmationMail,
}