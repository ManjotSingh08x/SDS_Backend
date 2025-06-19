const express = require("express");
const dbConn = require("./config/database.js");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var path = require("path");
const { strict } = require("assert");
const { hash } = require("crypto");
const cookieParser = require("cookie-parser");
const { queryObjects } = require("v8");

const app = express();

app.use(express.json());

// Setup EJS view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("./public"));

// use body parser to parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
const authenticateToken = (req, res, next) => {
    const token = req.cookies.webtoken;
    if (!token) {
        return res.status(401).send("No token provided");
    }
    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verified; // Add decoded info to request
        next();
    } catch (err) {
        res.status(403).send("Invalid or expired token");
    }
};
// --------- Admin section-----------

app.get("/admin", authenticateToken, async (req, res) => {
    res.render("admin-dashboard");
});

app.get("/admin/users", authenticateToken, async (req, res) => {
    query = "select * from users";
    const result = await runDBCommand(query);
    res.render("admin-users", { users: result });
});
app.post("/admin/users", authenticateToken, async (req, res) => {
    const hashed_password = await hashPassword(req.body.password);
    try {
        query = `insert into users (user_name, user_role, password, email, phone) values 
            (${mysql.escape(req.body.user_name)}, 
            ${mysql.escape(req.body.user_role)},
            ${mysql.escape(hashed_password)}, 
            ${mysql.escape(req.body.email)}, 
            ${mysql.escape(req.body.phone)});`;
        const result = await runDBCommand(query);
        res.json(result);
    } catch (err) {
        res.status(500).json({ err });
    }
});

app.delete("/admin/users/:id", authenticateToken, async (req, res) => {
    try {
        const query = `delete from users where user_id = ${mysql.escape(
            req.params.id
        )}`;
        const result = await runDBCommand(query);
        res.status(200).json(`deleted user ${req.params.id}`);
    } catch (err) {
        res.status(500).json({ error: "Error deleting user." });
    }
});
app.get("/admin/orders", authenticateToken, async (req, res) => {
    query = "select * from orders";
    const result = await runDBCommand(query);
    res.render("admin-orders", { orders: result });
});

// ---- menu items -----
app.get("/admin/menu", authenticateToken, async (req, res) => {
    query = "select * from menu";
    const menu = await runDBCommand(query);
    query = "select * from primary_categories";
    const primary = await runDBCommand(query);
    query = "select * from secondary_categories";
    const secondary = await runDBCommand(query);
    res.render("admin-menu", { menu: menu, primary: primary, secondary:secondary });
});
app.post("/admin/menu/secondary", authenticateToken, async (req, res) => {
    const query = `insert into secondary_categories (category_name) values 
        (${mysql.escape(req.body.category_name)});`;
    try {
        const result = runDBCommand(query);
        res.status(200).json({ message: "secondary category added" });
    } catch {
        res.status(500).json({ err: "couldn't add category" });
    }
});
app.post("/admin/menu/primary", authenticateToken, async (req, res) => {
    const query = `insert into primary_categories (category_name) values 
        (${mysql.escape(req.body.category_name)});`;
    try {
        const result = runDBCommand(query);
        res.status(200).json({ message: "primary category added" });
    } catch (err) {
        res.status(500).json({ err: "couldn't add category" });
    }
});
app.post("/admin/menu", authenticateToken, async (req, res) => {
    try {
        const query = `insert into menu (item_name, price, image_url, primary_category_id) values 
        (${mysql.escape(req.body.item_name)},
        ${mysql.escape(req.body.price)},
        ${mysql.escape(req.body.image_url)}, 
        ${mysql.escape(req.body.primary_category_id)});`;
        const result = runDBCommand(query);
        res.status(200).json({ message: `item added at ${result.insertId}` });
    } catch (err) {
        console.log(err);
        res.status(500).json({err})
    }
});
app.post("/admin/menu/item-discription/:id", authenticateToken, async (req, res) => {
    const query = `insert into item_description (item_id, category_id) values  
        (${mysql.escape(req.params.id)},
         ${mysql.escape(req.body.category_id)});`;
    try {
        const result = runDBCommand(query);
        res.send(200).json({ message: "item_description added" });
    } catch (err) {
        res.send(500).json({ err: "couldn't add category" });
    }
});
app.delete("/admin/menu/primary/:id", authenticateToken, async (req, res) => {
    try {
        const query = `delete from primary_categories where category_id = ${mysql.escape(
            req.params.id
        )}`;
        const result = await runDBCommand(query);
        res.status(200).json(`deleted category ${req.params.id}`);
    } catch (err) {
        res.status(500).json({ error: "Error deleting category." });
    }
});
app.delete("/admin/menu/secondary/:id", authenticateToken, async (req, res) => {
    try {
        const query = `delete from secondary_categories where category_id = ${mysql.escape(
            req.params.id
        )}`;
        const result = await runDBCommand(query);
        res.status(200).json(`deleted category ${req.params.id}`);
    } catch (err) {
        res.status(500).json({ error: "Error deleting category." });
    }
});
app.delete("/admin/menu/:id", authenticateToken, async (req, res) => {
    try {
        const query = `delete from menu where item_id = ${mysql.escape(
            req.params.id
        )}`;
        const result = await runDBCommand(query);
        res.status(200).json(`deleted item ${req.params.id}`);
    } catch (err) {
        res.status(500).json({ error: "Error deleting item." });
    }
});
//-------Sign-up Logic ----------

app.post("/login", async (req, res) => {
    console.log(req.body);
    const { user_name, password } = req.body;
    try {
        const query = `select user_id, user_name, user_role, password from users where user_name = ${mysql.escape(
            user_name
        )};`;
        console.log(query);
        const result = await runDBCommand(query);

        if (result.length === 0) {
            return res
                .status(401)
                .json({ error: "username or password are incorrect" });
        }
        const user = result[0];
        isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "password is incorrect" });
        }
        const token = jwt.sign(
            {
                user_id: user.user_id,
                user_name: user.user_name,
                role: user.user_role,
            },
            process.env.SECRET_TOKEN
        );
        console.log(token);
        res.cookie("webtoken", token);
        res.cookie("webtoken", token, {
            httpOnly: true,
        });
        if (user.user_role === "Customer") {
            // res.send({message: "Logged in as Customer"})
            res.redirect(`/customer/${result.user_id}/dashboard`);
        } else if (user.user_role === "Chef") {
            res.send({ message: "Logged in as Chef" });
            // res.redirect(`/chef/${result.user_id}`);
        } else if (user.user_role === "Admin") {
            res.redirect("/admin");
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

//TODO: add customer dashboard as app.get("/customer/:id") and same for chef
//-------- Customer section -----------
const authorizeCustomer = (req, res, next) => {
    const userId = parseInt(req.user.user_id);
    const userRole = req.user.role;
    const requestedId = req.params.id;
    if (userRole !== "Customer") {
        return res
            .status(403)
            .send("Unauthorized: only customers can acccess this page");
    }
    if (requestedId != userId) {
        return res
            .status(403)
            .send(`Unauthorized: cannot access another user info. reqID = ${requestedId}, userID = ${userId}`);
    }
    next();
};

app.get("/customer/signup", (req, res) => {
    res.render("customer-signup");
});
app.post("/customer/signup", validateReq, async (req, res) => {
    const hashed_password = await hashPassword(req.body.password);
    try {
        query = `insert into users (user_name, user_role, password, email, phone) values 
            (${mysql.escape(req.body.user_name)}, 
            "Customer",
            ${mysql.escape(hashed_password)}, 
            ${mysql.escape(req.body.email)}, 
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
        // res.redirect(`/customer/${result.insertId}`)
        //   res.cookie("webtoken", token, {
        //       httpOnly: true,
        //       sameSite: 'Strict'
        // });
        console.log(`/customer/${result.insertId}/dashboard`);
        res.redirect(`/customer/${result.insertId}/dashboard`);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error signing up customer." });
    }
});
app.get(
    "/customer/:id/dashboard",
    authenticateToken,
    authorizeCustomer,
    (req, res) => {
        const userId = req.user.user_id;
        res.render("customer-dashboard");
    }
);
app.get(
    "/customer/:id/dashboard",
    authenticateToken,
    authorizeCustomer,
    (req, res) => {
        const userId = req.user.user_id;
        res.render("customer-dashboard");
    }
);

//-------- Chef section ---------------
app.post("/chef/signup", validateReq, async (req, res) => {
    try {
        query = `insert into users (user_name, user_role, password, email, phone) values 
            (${mysql.escape(req.body.user_name)}, 
            "Chef",
            ${mysql.escape(req.body.password)}, 
            ${mysql.escape(req.body.email)}, 
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
        // res.redirect(`/chef/${result.insertId}`)
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
