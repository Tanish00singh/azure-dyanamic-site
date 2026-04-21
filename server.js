const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use environment variables (Azure will inject these)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
});

db.connect(err => {
    if (err) {
        console.log("DB Error:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// Home route
app.get("/", (req, res) => {
    res.send("🚀 Azure Node App Running");
});

// Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username=? AND password=?";
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.send("DB error");

        if (result.length > 0) {
            res.send("Login Success ✅");
        } else {
            res.send("Invalid Credentials ❌");
        }
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});