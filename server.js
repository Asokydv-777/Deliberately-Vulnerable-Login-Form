const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("app.db");

// THIS LINE IS CRUCIAL: It serves your test.html file to the browser
app.use(express.static("."));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  }),
);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    bio TEXT DEFAULT ''
  )
`);

app.post("/signup", (req, res) => {
  const { email, password, name, bio } = req.body;

  try {
    const insert = db.prepare(
      "INSERT INTO users (email, password, name, bio) VALUES (?, ?, ?, ?)",
    );
    const result = insert.run(email, password, name, bio || "");
    res.json({ success: true, userId: result.lastInsertRowid });
  } catch (err) {
    // This will print the error in your terminal if something goes wrong
    console.log("DATABASE ERROR:", err.message);
    res.status(400).json({ error: err.message });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  const result = db.prepare(query).all();

  if (result.length > 0) {
    req.session.userId = result[0].id;
    res.json({ success: true, user: result[0] });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.get("/profile/:id", (req, res) => {
  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(req.params.id);
  if (!user) return res.status(404).send("User not found");

  res.send(`
    <html>
      <body>
        <h1>${user.name}'s Profile</h1>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Bio:</strong> ${user.bio}</p>
      </body>
    </html>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Vulnerable app running at http://localhost:${PORT}`);
});
