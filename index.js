const express = require("express");
const shortID = require("shortid");
const fs = require("fs");

const server = express();

const PORT = process.env.PORT || 5000;
//import user data from saved file on startup
let users = JSON.parse(fs.readFileSync("./data/users.json"));

server.use(express.json());

//save updated date to file
function saveUsers(res) {
  try {
    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
    //return code 0 - no error
    return 0;
  } catch {
    res
      .status(500)
      .json({
        errorMessage: "There was an error while updating the database.",
      })
      .end();
    //return code 1 - some error
    return 1;
  }
}

//----------------------------------------------------------------------------//
//GET Requests - retrieve all users or a specific user
//----------------------------------------------------------------------------//
server.get("/api/users", (req, res) => {
  users
    ? res.status(200).json(users)
    : res.status(500).json({
        errorMessage: "The user information could not be retrieved.",
      });
});

server.get("/api/users/:id", (req, res) => {
  try {
    const { id } = req.params;
    const found = users.find(user => user.id == id);

    found
      ? res.status(200).json(found)
      : res.status(404).json({
          message: `No user found with id '${id}'.`,
        });
  } catch {
    res.status(500).json({
      errorMessage: "The user information could not be retrieved.",
    });
  }
});

//----------------------------------------------------------------------------//
//POST Requests - create a new user
//----------------------------------------------------------------------------//
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  if (!(name && bio)) {
    return res.status(400).json({
      errorMessage:
        "Please provide both a 'name' and a 'bio' field for the user.",
    });
  }

  const entry = { ...req.body, id: shortID.generate() };
  try {
    users.push(entry);
    //return value of 0 means the operation succeeded
    saveUsers(res) === 0
      && res.status(201).json(entry);
  } catch {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database.",
    });
  }
});

//----------------------------------------------------------------------------//
//PATCH Requests - update an existing user
//----------------------------------------------------------------------------//
server.patch("/api/users/:id", (req, res) => {
  try {
    const { id } = req.params;
    const found = users.find(user => user.id == id);
    if (found) {
      Object.assign(found, { ...req.body, id });
      //return value of 0 means the operation succeeded
      saveUsers(res) === 0
        && res.status(200).json(found);
    } else {
      res.status(404).json({
        message: `No user found with id '${id}'.`,
      });
    }
  } catch {
    res.status(500).json({
      errorMessage: "There was an error while updating the user.",
    });
  }
});

//----------------------------------------------------------------------------//
//PUT Requests - replace an existing user
//----------------------------------------------------------------------------//
server.put("/api/users/:id", (req, res) => {
  try {
    const { name, bio } = req.body;
    const { id } = req.params;
    const foundIdx = users.findIndex(user => user.id == id);
    if (foundIdx === -1) {
      return res.status(404).json({
        message: `No user found with id '${id}'.`,
      });
    }

    if (!(name && bio)) {
      return res.status(400).json({
        errorMessage:
          "Please provide both a 'name' and a 'bio' field for the user.",
      });
    }

    const entry = { ...req.body, id };
    users[foundIdx] = entry;
    //return value of 0 means the operation succeeded
    saveUsers(res) === 0
      && res.status(200).json(entry);
  } catch {
    res.status(500).json({
      errorMessage: "There was an error while updating the user.",
    });
  }
});

//----------------------------------------------------------------------------//
//DELETE Requests - delete an existing user
//----------------------------------------------------------------------------//
server.delete("/api/users/:id", (req, res) => {
  try {
    const { id } = req.params;
    const found = users.find(user => user.id == id);
    if (found) {
      users = users.filter(user => user.id != id);
      //return value of 0 means the operation succeeded
      saveUsers(res) === 0
        && res.status(200).json(found);
    } else {
      res.status(404).json({
        message: `No user found with id '${id}'.`,
      });
    }
  } catch {
    res.status(500).json({
      errorMessage: "There was an error while updating the user.",
    });
  }
});

//----------------------------------------------------------------------------//
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
