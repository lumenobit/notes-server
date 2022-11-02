let editNoteId = null;

function showDialog(value = '') {
    resetEditorState(value);
    let saveButtonDOM = document.getElementById('saveButton');
    let noteEditorHeadingDOM = document.getElementById('noteEditorHeading');
    if (value) {
        noteEditorHeadingDOM.innerHTML = 'Edit Note';
        saveButtonDOM.disabled = false;
    } else {
        noteEditorHeadingDOM.innerHTML = 'Create a Note';
        saveButtonDOM.disabled = true;
    }
    let dialogBoxDOM = document.getElementById('dialogBox');
    dialogBoxDOM.classList.remove('hide');
    setTimeout(() => {
        dialogBoxDOM.children[1].classList.remove('hide-wrapper');
    }, 10);
}

function resetEditorState(value = '') {
    let noteEditorDOM = document.getElementById('note-editor');
    noteEditorDOM.value = value;
    noteEditorDOM.classList.remove('invalid');
}

function hideDialog() {
    let dialogBoxDOM = document.getElementById('dialogBox');
    dialogBoxDOM.children[1].classList.add('hide-wrapper');
    setTimeout(() => {
        dialogBoxDOM.classList.add('hide');
    }, 100);
}

function saveNote() {
    let noteEditorDOM = document.getElementById('note-editor');
    let noteValue = noteEditorDOM.value;
    saveNoteLocalStorage(noteValue);
    // saveNoteToDB(noteValue);
    refreshNoteList();
    hideDialog();
}

function onEditorChange() {
    let noteEditorDOM = document.getElementById('note-editor');
    let noteValue = noteEditorDOM.value;
    let saveButtonDOM = document.getElementById('saveButton');
    if (noteValue) {
        saveButtonDOM.disabled = false;
    } else {
        saveButtonDOM.disabled = true;
    }
}

function isValid() {
    const noteEditorDOM = document.getElementById('note-editor');
    const noteValue = noteEditorDOM.value;
    noteEditorDOM.placeholder = 'Type your note here...';
    if (noteValue) {
        noteEditorDOM.classList.remove('invalid');
    } else {
        noteEditorDOM.classList.add('invalid');
    }
}

function removePlaceholder() {
    const noteEditorDOM = document.getElementById('note-editor');
    noteEditorDOM.placeholder = '';
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function saveNoteLocalStorage(noteValue) {
    let notes = getNotesLocalStorage();
    if (editNoteId) {
        const oldNote = notes.find((n) => n.id === editNoteId);
        oldNote.text = noteValue;
    } else {
        const newNote = {
            id: getRandomInt(100, 999),
            text: noteValue
        }
        notes.push(newNote);
    }
    notesString = JSON.stringify(notes);
    localStorage.setItem('note', notesString);
    editNoteId = null;
}

function getNotesLocalStorage() {
    const notesString = localStorage.getItem('note');
    let notes;
    if (!notesString) {
        notes = [];
    } else {
        notes = JSON.parse(notesString);
    }
    return notes;
}

function refreshNoteList() {
    const notes = getNotesLocalStorage();
    const noteListDOM = document.body.children[2];
    noteListDOM.innerHTML = '';
    notes.forEach(note => {
        addNoteToNoteList(note);
    });
}

function openNoteEditorInEditMode(note) {
    editNoteId = note.id;
    showDialog(note.text);
}

function addNoteToNoteList(note) {
    // Creating the div element - <div></div>
    const noteDOM = document.createElement('a');
    // Adding class to the div element - <div class="note"></div>
    noteDOM.classList.add('note');
    // Adding the content in the innerHTML of the div element - <div class="note">Test Note 1</div>
    noteDOM.innerHTML = note.text;

    noteDOM.onclick = () => {
        openNoteEditorInEditMode(note);
    }

    // Referencing the noteList element - in line 24
    // <div class="note-list">
    // </div>
    const noteListDOM = document.body.children[2];
    // Appending a child
    // <div class="note-list">
    //      <div class="note">Test Note 1</div>
    //      <div class="note">Test Note 2</div>
    // </div>
    noteListDOM.appendChild(noteDOM);
}

refreshNoteList();