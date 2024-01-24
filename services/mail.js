const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require('fs');

const { promisify } = require('util');

const readFile = promisify(fs.readFile);

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

    const htmlContent = await readFile('./assets/verify.html', 'utf8');
    let htmlResult = htmlContent.replace('{FirstName}', pname);
    htmlResult = htmlResult.replace('{activation_link}', activation_code);
    fs.writeFile('./assets/verify.html', htmlResult, (err) => {
        if (err) throw err;
        console.log('HTML file has been updated!');
    });

    const info = await transporter.sendMail({
        from : '"MMI Companion " <raphael.tiphonet@etu.univ-poitiers.fr>',
        to : mail,
        subject : "Confirmation de votre compte",
        html : htmlResult,
        headers: {
            'X-Laziness-level': 1000,
            'charset' : 'UTF-8',
            'MIME-Version' : '1.0',
            'Content-Type' : 'text/html',
            'Content-Transfer-Encoding' : '8bit',
            'Date' : (new Date()).toString()

        }
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = {
    sendConfirmationMail,
};
