require("dotenv").config(); 
const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const app = express();
const db = new Database("app.db");

app.use(express.static("."));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true, 
      sameSite: "lax",
      secure: false, 
    },
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

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.post("/signup", async (req, res) => {
  const { email, password, name, bio } = req.body;

  try {
   
    const hashedPassword = await bcrypt.hash(password, 10);

    const insert = db.prepare(
      "INSERT INTO users (email, password, name, bio) VALUES (?, ?, ?, ?)",
    );

    const result = insert.run(email, hashedPassword, name, bio || "");
    res.json({ success: true, userId: result.lastInsertRowid });
  } catch (err) {
    console.log("DATABASE ERROR:", err.message);
    res.status(400).json({ error: err.message });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

 
  const query = "SELECT * FROM users WHERE email = ?";
  const result = db.prepare(query).all(email);

  if (result.length > 0) {
    const user = result[0];

   
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.userId = user.id;
     
      const { password, ...safeUser } = user;
      return res.json({ success: true, user: safeUser });
    }
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});


app.get("/profile/:id", (req, res) => {
  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(req.params.id);
  if (!user) return res.status(404).send("User not found");

  res.send(`
    <html>
      <body>
        <h1>${escapeHtml(user.name)}'s Profile</h1>
        <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
        <p><strong>Bio:</strong> ${escapeHtml(user.bio)}</p>
      </body>
    </html>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Patched app running at http://localhost:${PORT}`);
});
