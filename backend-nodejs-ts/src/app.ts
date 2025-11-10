// const express = require("express");
import express from "express";
import 'dotenv/config';
import webRoute from "./routes/web";
import getConnection from "./config/database";
import initDatabase from "config/seed";

const app = express();
const PORT = process.env.PORT || 8080;

// config view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config static files: imgs/css/js
app.use(express.static('public'));

// config routes
webRoute(app);

getConnection();

// seeding data
initDatabase();

app.listen(PORT, () => {
    console.log(`My app is running on port: ${PORT}`);
});