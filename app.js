const express = require("express");
const mysql = require("mysql");
const util = require("util");

const app = express();

app.use(express.json());


const conexion = mysql.createConnection({
host: "sql11.freemysqlhosting.net",
user: "sql11394364",
password: 'ek4HQPAZHi',
databse: 'sql11394364'
});

conexion.connect();


app.get('/', (req,res) => {
res.send("app conectada")
});






app.listen(3000, ()=> {
    console.log("APP server working in port 3000")
})