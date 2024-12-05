const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const notes = {}; 

router.get("/", (req, res) => {
  if (Object.keys(notes).length === 0) {
    return res.status(404).json({ message: "Заметки не найдены" });
  }
  res.status(200).json(Object.values(notes));
});

router.get("/:id", (req, res) => {
  const note = notes[req.params.id];
  if (!note) {
    return res.status(404).json({ message: `Заметка с id ${req.params.id} не найдена` });
  }
  res.status(200).json(note);
});

router.get("/read/:title", (req, res) => {
  const note = Object.values(notes).find((n) => n.title === req.params.title);
  if (!note) {
    return res.status(404).json({ message: `Заметка с названием "${req.params.title}" не найдена` });
  }
  res.status(200).json(note);
});

router.post("/", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Требуются название и содержимое заметки" });
  }
  const id = uuidv4();
  const created = new Date().toISOString();
  const note = { id, title, content, created, changed: created };
  notes[id] = note;
  res.status(201).json(note);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!notes[id]) {
    return res.status(409).json({ message: `Заметка с id ${id} не найдена` });
  }
  delete notes[id];
  res.status(204).send();
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!notes[id]) {
    return res.status(409).json({ message: `Заметка с id ${id} не найдена` });
  }
  if (!title || !content) {
    return res.status(400).json({ message: "Требуются название и содержимое заметки" });
  }
  notes[id] = {
    ...notes[id],
    title,
    content,
    changed: new Date().toISOString(),
  };
  res.status(204).send();
});

module.exports = router;
