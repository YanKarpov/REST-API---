const express = require("express");
const morgan = require("morgan");
const notesRoutes = require("./routes/notes");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use("/notes", notesRoutes);

module.exports = app; 
