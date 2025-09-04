import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecretkey"; 

const users = [{ id: 1, username: "admin", password: "password" }];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/profile", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ message: `Welcome ${user.username}!`, user });
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
