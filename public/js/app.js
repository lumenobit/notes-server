let editNoteId = null;

function showDialog(value = '') {
    resetEditorState(value);
    toggleNoteError(false);
    let saveButtonDOM = document.getElementById('saveButton');
    let noteEditorHeadingDOM = document.getElementById('noteEditorHeading');
    if (editNoteId) {
        noteEditorHeadingDOM.innerHTML = 'Edit Note';
        toggleDeleteButton(true);
    } else {
        noteEditorHeadingDOM.innerHTML = 'Create a Note';
        toggleDeleteButton(false);
    }
    if (value) {
        saveButtonDOM.disabled = false;
    } else {
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

function toggleNoteError(show, message) {
    const noteErrorDOM = document.getElementById('noteError');
    if (show) {
        noteErrorDOM.classList.remove("hide");
        noteErrorDOM.innerHTML = message;
    } else {
        noteErrorDOM.classList.add("hide");
    }
}

function toggleLoader(show) {
    const loaderDOM = document.getElementById('loader');
    if (show) {
        loaderDOM.classList.remove("hide");
    } else {
        loaderDOM.classList.add("hide");
    }
}

function toggleDeleteButton(show) {
    const deleteBtnDOM = document.getElementById('deleteButton');
    if (show) {
        deleteBtnDOM.classList.remove("hide");
    } else {
        deleteBtnDOM.classList.add("hide");
    }
}

async function saveNote() {
    toggleLoader(true);
    let noteEditorDOM = document.getElementById('note-editor');
    let noteValue = noteEditorDOM.value;
    // saveNoteLocalStorage(noteValue);
    let success = false;
    if (editNoteId) {
        success = await updateNoteToServer(editNoteId, noteValue);
    } else {
        success = await saveNoteToServer(noteValue);
    }
    // saveNoteToDB(noteValue);
    if (success) {
        await refreshNoteList();
        toggleNoteError(false);
        hideDialog();
    } else {
        toggleNoteError(true, "Some error occurred while saving note. Please try again later.");
    }
    toggleLoader(false);
}

async function deleteNote() {
    if (editNoteId) {
        toggleLoader(true);
        const success = await deleteNoteFromServer(editNoteId);
        if (success) {
            await refreshNoteList();
            toggleNoteError(false);
            hideDialog();
        } else {
            toggleNoteError(true, "Some error occurred while deleting note. Please try again later.");
        }
        toggleLoader(false);
    }
}

async function deleteNoteFromServer(noteId) {
    const response = await fetch("/api/note/" + noteId, { method: "DELETE" })
    const successResp = await response.json();
    return successResp.success;
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

async function saveNoteToServer(noteValue) {
    const newNote = {
        id: getRandomInt(100, 999),
        text: noteValue
    }
    const response = await fetch("/api/note", {
        method: "POST",
        body: JSON.stringify(newNote),
        headers: { "Content-Type": "application/json" }
    });
    const successResp = await response.json();
    return successResp.success;
}

async function updateNoteToServer(noteId, noteValue) {
    const noteToEdit = {
        text: noteValue
    }
    const response = await fetch("/api/note/" + noteId, {
        method: "PUT",
        body: JSON.stringify(noteToEdit),
        headers: { "Content-Type": "application/json" }
    });
    const successResp = await response.json();
    return successResp.success;
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

async function getNotesFromServer() {
    // Asynchronous Operation
    try {
        const response = await fetch("/api/note");
        // resolve
        const notes = await response.json();
        return notes;
    } catch (ex) {
        // reject
        console.log(ex);
        return [];
    }
}

async function refreshNoteList() {
    // const notes = getNotesLocalStorage();
    const notes = await getNotesFromServer();
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

// IIFE = Immediately Invoked Function Expression
(async () => {
    toggleLoader(true);
    await refreshNoteList();
    toggleLoader(false);
})();