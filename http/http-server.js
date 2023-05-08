const express = require("express");
const app = express();

app.post("/", (_, res) => {
  res.send();
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
