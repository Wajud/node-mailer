require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5500;
app.use(cors());

app.use(express.json());
// app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

//register function
function register({ fullName, email, phoneNumber }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EmailUser,
        pass: process.env.EmailPassword,
      },
    });

    const mail_config = {
      from: email,
      to: "kareemwajud@yahoo.com",
      subject: "New User Registration",
      html: `
      <h1>Mew Registration</h1>
      <br/> 
      <p>Name </p>
      <br/>
      <p>${fullName}</p>
      <br/> 
      <p>Email </p>
      <br/>
      <p>${email}</p>
      <br/> <br/>
      <p>Phone Number </p>
      <br/>
      <p>${phoneNumber}</p>
      `,
    };

    transporter.sendMail(mail_config, function (err, info) {
      if (err) {
        console.log(err);
        reject("An error occurred");
      }
      console.log("Registration successful");

      resolve("User registered successfully");
    });
  });
}

//send a message function
function sendMessage({ name, email, phoneNumber, message }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EmailUser,
        pass: process.env.EmailPassword,
      },
    });

    const mail_config = {
      from: email,
      to: "kareemwajud@yahoo.com",
      subject: `New Message from ${email}`,
      html: `
       <h1>Mew Registration</h1>
       <br/> 
       <p>Name </p>
       <br/>
       <p>${name}</p>
       <br/> 
       <p>Email </p>
       <br/>
       <p>${email}</p>
       <br/> <br/>
       <p>Phone Number </p>
       <br/>
       <p>${phoneNumber}</p>
       <p>Message </p>
       <br/>
       <p>${message}</p>
       `,
    };

    transporter.sendMail(mail_config, function (err, info) {
      if (err) {
        console.log(err);
        reject({ message: "An error occurred" });
      }
      console.log("Message delivered");
      resolve({ message: "Message sent successfully", info });
    });
  });
}

//Register route
app.get("/register", (req, res) => {
  register(req.query)
    .then(() => {
      res.json({ message: "Registration completed" });
      console.log("Registration Done!");
    })
    .catch((err) => res.status(500).send(err.message));
});

//Send a message route
app.get("/contact-us", (req, res) => {
  sendMessage(req.query)
    .then(() => {
      res.json({ message: "Message successfully delivered" });
      console.log("Your message has been delivered!");
    })
    .catch((err) => res.status(500).send(err.message));
});

app.listen(PORT, () => {
  console.log(`Nodemailer is running on PORT: ${PORT}`);
});
