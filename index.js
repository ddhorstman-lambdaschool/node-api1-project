const express = require("express");
const shortID = require("shortid");

const server = express();

const PORT = process.env.PORT || 5000;
let users = [];

server.use(express.json());

//----------------------------------------------------------------------------//
//GET Requests - retrieve all users or a specific user
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
//POST Requests - create a new user
//----------------------------------------------------------------------------//
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;

  if (!(name && bio)) {
    res.status(400).json({
      errorMessage:
        "Please provide both a 'name' and a 'bio' field for the user.",
    });
  }

  const entry = { id: shortID.generate(), name, bio };
  try {
    users.push(entry);
  } catch {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database.",
    });
  }
  res.status(201).json(entry);
});

//----------------------------------------------------------------------------//
//PATCH Requests - update an existing user
//----------------------------------------------------------------------------//
server.patch("/api/users/:id", (req, res) => {
  let found;
  try {
    found = users.find(user => user.id == req.params.id);
  } catch {
    res.status(500).json({
      errorMessage: "There user information could not be retrieved.",
    });
  }

  if (found) {
    Object.assign(found, req.body);
    res.status(200).json(found);
  } else {
    res.status(404).json({
      message: `No user found with id '${req.params.id}'.`,
    });
  }
});

//----------------------------------------------------------------------------//
//PUT Requests - replace an existing user
//----------------------------------------------------------------------------//
server.put("/api/users/:id", (req, res) => {
  let foundIdx;
  const { name, bio } = req.body;

  if (!(name && bio)) {
    res.status(400).json({
      errorMessage:
        "Please provide both a 'name' and a 'bio' field for the user.",
    });
  }
  try {
    foundIdx = users.findIndex(user => user.id == req.params.id);
  } catch {
    res.status(500).json({
      errorMessage: "There user information could not be retrieved.",
    });
  }

  if (foundIdx !== -1) {
    const entry = { ...req.body, id: req.params.id };
    users[foundIdx] = entry;
    res.status(200).json(entry);
  } else {
    res.status(404).json({
      message: `No user found with id '${req.params.id}'.`,
    });
  }
});

//----------------------------------------------------------------------------//
//DELETE Requests - delete an existing user
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
