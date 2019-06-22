const xss = require('xss');
const express = require('express');
const path = require('path');
const NotesService = require('./notes-service');

const notesRouter = express.Router();
const jsonParser = express.json();

//NEED TO SANITIZE NECESSARY DATA

notesRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    NotesService.getAllNotes(db)
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const db = req.app.get('db');
    const { title, content, folders_id, date_moddified } = req.body;
    const newNote = { title, content, folders_id, date_moddified };

    if (!title || !content || !folders_id)
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      });

    NotesService.insertNote(db, newNote)
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `${note.id}`))
          .json(note);
      })
      .catch(next);
  });

notesRouter
  .route('/:noteId')
  .all((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.noteId;

    NotesService.getById(db, id)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: 'Note does not exist' }
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.note);
  })
  .delete((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.noteId;

    NotesService.deleteNote(db, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.noteId;
    //NEED TO GET ALL THE NOTE FIELDS HERE.
    const { title, content, date_moddified, folders_id } = req.body;
    const updatedNote = { title, content, date_moddified, folders_id };

    const numberOfValues = Object.values(updatedNote).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'content' 'date_modified' or 'folders_id'`
        }
      });
    }

    NotesService.updateNote(db, id, updatedNote)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;
