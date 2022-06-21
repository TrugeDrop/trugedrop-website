const express = require('express');
const app = express();
const bp = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

app.use(express.static('./assets'));
app.use(bp.urlencoded({extended: true}));

app.get('/', (req,res) => {
  res.sendFile('./index.html', {root: path.join(__dirname)});
});

app.post('/mail-send', async function(req,res) {
  let transporter = nodemailer.createTransport({
    host: "smtp.yandex.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.mailuser,     
      pass: process.env.mailpass
    },
  });
  let info = await transporter.sendMail({
    from: process.env.mailuser,
    to: 'trugedrop@yandex.com',
    subject: req.body.subject,
    html: `
<b>Gönderilen Adres:</b> trugedrop.xyz <br>
<b>Gönderen Adı:</b> ${req.body.name} <br>
<b>Gönderen Email Adresi:</b> ${req.body.email} <br>
<b>Konu:</b> ${req.body.subject} <br>
<b>Mesaj:</b> ${req.body.message}
`,
  })
  .then(() => res.json({status: 'success'}))
  .catch(() => res.json({status: 'error'}));
});

app.listen(3000, () => console.log('Ready!'));