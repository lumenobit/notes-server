const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");

function getNotes() {
    const notesString = fs.readFileSync(path.join(process.cwd(), "src/notes.json"), { encoding: "utf-8" })
    return JSON.parse(notesString);
}

function writeNotes(notes) {
    fs.writeFileSync(path.join(process.cwd(), "src/notes.json"), JSON.stringify(notes));
}

// READ ALL NOTES
router.get('/', (req, res) => {
    try {
        const notes = getNotes();
        res.json(notes);
    } catch (ex) {
        console.log(ex);
        res.json([])
    }
})

// CREATE A NEW NOTE
router.post('/', (req, res) => {
    try {
        const note = req.body;
        console.log(note);
        const notes = getNotes();
        notes.push(note);
        writeNotes(notes);
        res.json({ success: true });
    } catch (ex) {
        console.log(ex);
        res.json({ success: false });
    }
})

// UPDATE AN EXISTING NOTE
router.put('/:id', (req, res) => {
    try {
        const noteId = req.params.id;
        const notes = getNotes();
        const oldNote = notes.find((n) => n.id == noteId);
        const note = req.body;
        oldNote.text = note.text;
        writeNotes(notes);
        res.json({ success: true });
    } catch (ex) {
        console.log(ex);
        res.json({ success: false });
    }
})

// DELETE AN EXISTING NOTE
router.delete('/:id', (req, res) => {
    try {
        const noteId = req.params.id;
        const notes = getNotes();
        const oldNoteId = notes.findIndex((n) => n.id == noteId);
        notes.splice(oldNoteId, 1);
        writeNotes(notes);
        res.json({ success: true });
    } catch (ex) {
        console.log(ex);
        res.json({ success: false });
    }
})

module.exports = router;