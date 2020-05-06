const express = require("express");
const server = express();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
})