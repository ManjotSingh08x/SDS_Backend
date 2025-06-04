const express = require('express');
const dbConn = require('./config/database.js');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var path = require('path');

const app = express();

app.use(express.json());

// Setup EJS view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));

// use body parser to parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
    console.log(req.method + " request for " + req.originalUrl);
    next();
});

// run DB command on the quert
const runDBCommand = (query) => {
    return new Promise((resolve, reject) => {
        dbConn.query(query, (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

// --------- Admin section-----------
// TODO: add password functionality instead of checking header only
const isAdmin = (req, res, next) => {
    if (req.headers.authorization === "Bearer admin") {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};
app.get('/admin',isAdmin, async (req, res) => {
    query = 'select * from users'
    const result = await runDBCommand(query);
    res.render('admin', { 'users': result });
})
app.post('/admin/users',isAdmin, async (req, res) => {
    query = `insert into users (user_name, user_role, password) values(
        ${mysql.escape(req.body.user_name)},
        ${mysql.escape(req.body.user_role)},
        ${mysql.escape(req.body.password)})`;
    const result = await runDBCommand(query);
    res.json(result);
})






app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.listen(5000,()=>{
console.log("Server listening in http://localhost:5000")
})