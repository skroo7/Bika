import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());

        this._updateNotes();
    }

    _updateNotes() {
        const mynotes = NotesAPI.getAllNotes();

        this._saveNotes(mynotes);

        if (mynotes.length > 0) {
            this._saveNoteActive(mynotes[0]);
        }
    }

    _saveNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    _saveNoteActive(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._saveNoteActive(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                };

                NotesAPI.saveNote(newNote);
                this._updateNotes();
            },
            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                });

                this._updateNotes();
            },
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._updateNotes();
            },
        };
    }
}
