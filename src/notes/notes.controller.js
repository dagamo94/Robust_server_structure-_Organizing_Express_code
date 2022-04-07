const path = require("path");
const notes = require(path.resolve("src/data/notes-data"));



/* ***** MIDDLEWARE FUNCTIONS ***** */

// **** VALIDATION for fetching a specific note by ID when using GET (/notes/:noteId) ****
const noteExists = (req, res, next) => {
    const noteId = Number(req.params.noteId);
    const foundNote = notes.find((note) => note.id === noteId);
    if (foundNote) {
        return next();
    } else {
        return next({
            status: 404,
            message: `Note id not found: ${req.params.noteId}`,
        });
    }
};

// **** VALIDATION for text property when using POST (/notes) and PUT(/notes/:noteId) ****
const hasText = (req, res, next) => {
    const { data: { text } = {} } = req.body;
    if (text) {
        return next();
    }
    return next({ status: 400, message: "A 'text' property is required." });
};




/* ***** HANDLERS **** */

// ---- GET (/notes/:noteId) HANDLER for fetching note by ID ----
const read = (req, res, next) => {
    const noteId = Number(req.params.noteId);
    const foundNote = notes.find((note) => note.id === noteId);
    res.json({ data: foundNote });
};


// ---- GET (/notes) HANDLER - returns all notes ----
const list = (req, res) => {
    res.json({ data: notes });
};


// ---- POST (/notes) HANDLER ----
const create = (req, res, next) => {
    const { data: { text } = {} } = req.body;

    const newNote = {
        id: notes.length + 1, // Assign the next ID
        text,
    };
    notes.push(newNote);
    res.status(201).json({ data: newNote });
};

// ---- PUT (/notes/:noteId) HANDLER ----
const update = (req, res, next) => {
    const { data: { text } = {} } = req.body;
    const {noteId} = req.params;
    const foundNote = notes.find(note => note.id === Number(noteId));

    // Update the note
    foundNote.text = text;

    res.status(200).json({data: foundNote});
}

// --- DELETE (/notes/:noteId) HANDLER ----
const destroy = (req, res, next) => {
    const {noteId} = req.params;
    const deleteNoteIndex = notes.findIndex(note => note.id ===  Number(noteId));

    const deletedNote = notes.splice(deleteNoteIndex, 1);
    res.status(204).json({data: deletedNote});
}

module.exports = {
    list,
    create: [hasText, create],
    read: [noteExists, read],
    update: [noteExists, hasText, update],
    delete: [noteExists, destroy]
}