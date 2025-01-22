const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yael69242@gmail.com',
        pass: 'erzw isln wtgc qqbk',
    },
});

const mailOptions = {
    from: 'tu-correo@gmail.com',
    to: 'yaelop117@gmail.com',
    subject: 'Prueba de nodemailer',
    text: 'Este es un mensaje de prueba',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error:', error);
    }
    console.log('Correo enviado:', info.response);
});
