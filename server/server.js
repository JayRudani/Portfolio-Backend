'use strict';
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const serverless = require('serverless-http');
const bodyParser = require('body-parser');

// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/", router);
app.use("/.netlify/functions/server", router);
//app.listen(process.env.PORT || 5000, () => console.log("Server Running"));
//app.use("/", (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "jayrudani1414@gmail.com",
    pass: "luvoblhhetlmghvx"
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from backend!</h1>');
  res.end();
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName + " "+ req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: "jayrudani1414@gmail.com",
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      // res.json({ code: 200, status: "Message Sent" });
      contactEmail.sendMail({
        from: "jayrudani1414@gmail.com",
        to: `${email}`,
        subject: "Submission was successful",
        text: `Thank you for contacting us!\n\nForm Details:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
      }, function(error, info){
        if(error) {
          console.log(error);
        } else{
          console.log('Message sent: ' + info.response);
        }
      });
    }
  });
});

 module.exports = app;
 module.exports.handler = serverless(app);