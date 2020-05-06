const express = require("express");
const shortID = require("shortid");

const server = express();

const PORT = process.env.PORT || 5000;
let users = [];

server.use(express.json());

//----------------------------------------------------------------------------//
//GET Requests
//----------------------------------------------------------------------------//
server.get("/api/users", (req, res) => {
  users
    ? res.status(200).json({ users })
    : res.status(500).json({
        errorMessage: "There user information could not be retrieved.",
      });
});
server.get("/api/users/:id", (req, res) => {
  try {
    const found = users.find(user => user.id == req.params.id);
    found
      ? res.status(200).json(found)
      : res.status(404).json({
          message: `No user found with id '${req.params.id}'.`,
        });
  } catch {
    res.status(500).json({
      errorMessage: "There user information could not be retrieved.",
    });
  }
});

//----------------------------------------------------------------------------//
//POST Requests
//----------------------------------------------------------------------------//
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;

  if (!(name && bio)) {
    res.status(400).json({
      errorMessage:
        "Please provide both a 'name' and a 'bio' field for the user.",
    });
  } else {
    const entry = { id: shortID.generate(), name, bio };
    try {
      users.push(entry);
    } catch {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the user to the database.",
      });
    }
    res.status(201).json(entry);
  }
});

//----------------------------------------------------------------------------//
//DELETE Requests
//----------------------------------------------------------------------------//
server.delete("/api/users/:id", (req, res) => {
  let found;
  try {
    found = users.find(user => user.id == req.params.id);
  } catch {
    res.status(500).json({
      errorMessage: "There user information could not be retrieved.",
    });
  }
  if (found) {
    users = users.filter(user => user.id != req.params.id);
    res.status(200).json(found);
  } else {
    res.status(404).json({
      message: `No user found with id '${req.params.id}'.`,
    });
  }
});

//----------------------------------------------------------------------------//
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
