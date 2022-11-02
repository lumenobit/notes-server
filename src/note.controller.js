const express = require('express');
const router = express.Router();

const notes = [
    { id: 125, text: 'Note 1' },
    { id: 123, text: 'Note 2' },
    { id: 122, text: 'Note 3' },
    { id: 121, text: 'Note 4' },
];

// READ ALL NOTES
router.get('/', (req, res) => {
    res.json(notes);
})

// CREATE A NEW NOTE
router.post('/', (req, res) => {
    const note = req.body;
    notes.push(note);
    res.json({ success: true });
})

// UPDATE AN EXISTING NOTE
router.put('/:id', (req, res) => {
    const noteId = req.params.id;
    console.log(noteId);
    const oldNote = notes.find((n) => n.id == noteId);
    console.log(oldNote);
    const note = req.body;
    oldNote.text = note.text;
    res.json({ success: true });
})

// DELETE AN EXISTING NOTE
router.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    const oldNoteId = notes.findIndex((n) => n.id == noteId);
    notes.splice(oldNoteId, 1);
    res.json({ success: true });
})

module.exports = router;