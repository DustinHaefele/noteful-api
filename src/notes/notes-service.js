const NotesService = {
  getAllNotes(db){
    return db('noteful_notes')
      .select('*');
  },

  getById(db,id){
    return db('noteful_notes')
      .select('*')
      .where({id})
      .first();
  },

  insertNote(db, noteInfo){
    return db('noteful_notes')
      .insert(noteInfo)
      .returning('*')
      .then(rows=>rows[0]);
  },

  deleteNote(db, id) {
    return db('noteful_notes')
      .where({id})
      .delete();
  },

  updateNote(db, id, newData){
    return db('noteful_notes')
      .where({id})
      .update(newData);
  }
};

module.exports = NotesService;