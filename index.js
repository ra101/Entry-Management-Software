//initializing dependencies
const { app, BrowserWindow, Menu } = require("electron");
var firebase = require("firebase");
const Nexmo = require("nexmo");
const nodemailer = require("nodemailer");
require("dotenv").config();

//main window... basically only window
var win;

//not required by application
Menu.setApplicationMenu(false);

function createWindow() {
  let win = new BrowserWindow({
    width: 720,
    height: 500,
    webPreferences: { nodeIntegration: true } //to make requirejs work
  });
  win.loadFile("app.html"); //main page
}

app.on("ready", createWindow);

//from env
var firebaseConfig = {
  apiKey: process.env.FBKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Initialize Nexmo, from env
const nexmo = new Nexmo({
  apiKey: process.env.NXKEY,
  apiSecret: process.env.NXSECRET
});

//Initialize NodeMailer,from env
let transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

//Adding them to global varibles, for single initialisation and verification
global.nexi = nexmo.message; //adding direct message object, 'cuz nexmo is not further required.
global.firey = firebase;
global.mailer = transport;
