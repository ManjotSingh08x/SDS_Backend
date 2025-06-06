const express = require("express");
const dbConn = require("./config/database.js");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var path = require("path");
const { strict } = require("assert");

const app = express();

app.use(express.json());

// Setup EJS view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("./public"));

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
      if (err) return reject(err);
      return resolve(result);
    });
  });
};
async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
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

app.get("/admin/users", isAdmin, async (req, res) => {
  query = "select * from users";
  const result = await runDBCommand(query);
  res.render("admin", { users: result });
});

app.post("/admin/users", isAdmin, async (req, res) => {
  query = `insert into users (user_name, user_role, password) values(
        ${mysql.escape(req.body.user_name)},
        ${mysql.escape(req.body.user_role)},
        ${mysql.escape(req.body.password)})`;
  const result = await runDBCommand(query);
  res.json(result);
});

app.delete("/admin/users/:id", isAdmin, async (req, res) => {
  try {
    const query = `delete from users where user_id = ${mysql.escape(
      req.params.id
    )}`;
    const result = await runDBCommand(query);
    res.json({ message: `User ${req.params.id} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user." });
  }
});

//-------Sign-up Logic ----------
app.post("/login", async (req, res) => {
  const { user_name, password } = req.body;
  try {
    const query = `select user_id, user_role from users where 
    user_name = ${mysql.escape(user_name)} and 
    password = ${mysql.escape(password)};`;

    const result = await runDBCommand(query);

    if (result.length === 0) {
      return res.status(401).json({error: "username or password are incorrect"});
    }
    const user = result[0];
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_name: user.user_name,
        role: user.user_role,
      },
      process.env.SECRET_TOKEN
    );
    res.cookie("webtoken", token);
    //   res.cookie("webtoken", token, {
    //       httpOnly: true,
    //       sameSite: 'Strict'
    // });
    if (user.user_role === "Customer") {
        res.redirect(`/customer/${result.user_id}`);
    } else if (user.user_role === "Chef") {
        res.redirect(`/chef/${result.user_id}`);
    } else if (user.user_role === "Admin") {
        res.redirect('/admin')
    }
  } catch (err) {
    res.status(500).json({ error: "Error finding user. " });
  }
});

app.get("/signup-choice", (req, res) => {
  res.render("signup-choice");
});

app.get("/", (req, res) => {
  res.render("home");
});

const validateReq = (req, res, next) => {
  if (
    req.body &&
    req.body.user_name &&
    req.body.password &&
    req.body.email &&
    req.body.phone
  ) {
    next();
  } else {
    res.status(400).send("Bad Request. Request body is invalid!");
  }
};

//-------- Customer section -----------
app.post("/customer/signup", validateReq, async (req, res) => {
  try {
    query = `insert into users (user_name, user_role, password, email, phone) values 
            ("${mysql.escape(req.body.user_name)}", 
            "Customer",
            "${mysql.escape(req.body.password)}", 
            "${mysql.escape(req.body.email)}", 
             ${mysql.escape(req.body.phone)});`;
    const result = await runDBCommand(query); 
    const token = jwt.sign(
        {
        user_id: result.insertId,
        user_name: req.body.user_name,
        role: "Customer",
      },
      process.env.SECRET_TOKEN
    );
    res.cookie("webtoken", token);
    res.redirect(`/customer/${result.insertId}`)
    //   res.cookie("webtoken", token, {
    //       httpOnly: true,
    //       sameSite: 'Strict'
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error signing up customer." });
  }
});

//-------- Chef section ---------------
app.post("/chef/signup", validateReq, async (req, res) => {
  try {
    query = `insert into users (user_name, user_role, password, email, phone) values 
            ("${mysql.escape(req.body.user_name)}", 
            "Chef",
            "${mysql.escape(req.body.password)}", 
            "${mysql.escape(req.body.email)}", 
             ${mysql.escape(req.body.phone)});`;
    const result = await runDBCommand(query); 
    const token = jwt.sign(
        {
        user_id: result.insertId,
        user_name: req.body.user_name,
        role: "Chef",
      },
      process.env.SECRET_TOKEN
    );
    res.cookie("webtoken", token);
    res.redirect(`/chef/${result.insertId}`)
    //   res.cookie("webtoken", token, {
    //       httpOnly: true,
    //       sameSite: 'Strict'
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error signing up chef." });
  }
});

app.listen(5000, () => {
  console.log("Server listening in http://localhost:5000");
});
