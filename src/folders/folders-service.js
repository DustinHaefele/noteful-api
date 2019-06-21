
const FoldersService = {
  getAllFolders(db){
    return db('noteful_folders')
      .select('*');
  },

  getById(db,id){
    return db('noteful_folders')
      .select('*')
      .where({id})
      .first();
  },

  insertFolder(db, folderInfo){
    return db('noteful_folders')
      .insert(folderInfo)
      .returning('*')
      .then(rows=>rows[0]);
  },

  deleteFolder(db, id) {
    return db('noteful_folders')
      .where({id})
      .delete();
  },

  updateFolder(db, id, newData){
    return db('noteful_folders')
      .where({id})
      .update(newData);
  }
};

module.exports = FoldersService;