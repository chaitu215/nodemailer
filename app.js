const express = require('express');
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path= require('path');

const app = express();
// view engine set up

app.engine('handlebars',exphbs());
app.set('view engine','handlebars');


// static folderi
app.use('/public',express.static(path.join(__dirname,'public')))


// body parser middle ware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.get('/',(req,res) => {
  res.render('contact');
});

app.post('/send',(req,res) => {

// req.body.<fieldname> should match with form field name

const output =
`
<p>you have a new contact request</p>
<h3> contact details </h3>
<ul>
    <li>Name: ${req.body.name} </li>
    <li>Company : ${req.body.company} </li>
    <li>Email: ${req.body.email} </li>
    <li>Phone: ${req.body.phone} </li>
</ul>

<h3>Message</h3>
<p>${req.body.message}</p>
`;

// copy and paste  nodemail
// create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        service:'Gmail',
        auth: {
            user: 'chaitu215@gmail.com', // generated ethereal user
            pass: ''  // generated ethereal password
        },
        // if you are trying from localhost use this
        tls:{
          rejectUnauthorized:false
        }

    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'chaitu215@gmail.com', // sender address
        to: 'krishna.mf01@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output// html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact',{msg:'email has been sent'});
    });

//

});

app.listen(3000,()=>console.log('server started'));
