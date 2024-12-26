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
function register({
  fullName,
  address,
  telephone,
  email,
  stateOfResidence,
  dateOfArrival,
}) {
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
      to: "fctpfn@gmail.com",
      subject: "2025 Bi-Annual Conference Participant Registration Form",
      html: `
      <h1>2025 Bi-Annual Conference Participant Registration Form</h1>
      <br/> 
      <p>Name </p>
      <p>${fullName}</p>
      <br/> 
      <p>Email </p>
      <p>${email}</p>
      <br/> 
      <p>Telephone </p>
      <p>${telephone}</p>
      <br/>
      <p>Address </p>
      <p>${address}</p>
      <br />
      <p>State of Residence </p>
      <p>${stateOfResidence}</p>
      <br/>
      <p>Date of Arrival </p>
      <p>${dateOfArrival}</p>
      <br/>
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
      to: "fctpfn@gmail.com",
      subject: `New Message from ${email}`,
      html: `
       <h1>New Message from ${email}</h1>
       <br/> 
       <p>Name </p>
       <p>${name}</p>
       <br/> 
       <p>Email </p>
       <p>${email}</p>
       <br/> 
       <p>Phone Number </p>
       <p>${phoneNumber}</p>
       <br/>
       <p>Message </p>
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
