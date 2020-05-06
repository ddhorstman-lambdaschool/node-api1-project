const express = require("express");
const shortID = require("shortid");

const server = express();

const PORT = process.env.PORT || 5000;
let users = [];

server.use(express.json());

server.get("/api/users", (req, res) => {
  res.status(200).json({ users });
});
server.get("/api/users/:id", (req, res) => {
  const found = users.find(user => user.id == req.params.id);
  found
    ? res.status(200).json(found)
    : res.status(404).json({
        message: `No user found with id '${req.params.id}'.`,
      });
});

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;

  if (!(name && bio)) {
    res.status(400).json({
      errorMessage:
        "Please provide both a 'name' and a 'bio' field for the user.",
    });
  } else {
    const entry = { id: shortID.generate(), name, bio };
    users.push(entry);
    res.status(201).json(entry);
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
