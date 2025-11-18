// const express = require("express");
import express from "express";
import 'dotenv/config';
import userRoute from "./routes/user.route";
import productRoute from "./routes/product.route";
import getConnection from "./config/database";
import initDatabase from "config/seed";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// config cors
app.use(cors({
    origin: ["http://localhost:5173"]
}));

// config view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config static files: imgs/css/js
app.use(express.static('public'));

// Cho phép truy cập thư mục upload
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// config routes
userRoute(app);
productRoute(app);

getConnection();

// seeding data
initDatabase();

app.listen(PORT, () => {
    console.log(`My app is running on port: ${PORT}`);
});