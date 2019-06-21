const xss = require('xss');
const express = require('express');
const path = require('path');
const FoldersService = require('./folders-service');

const folderRouter = express.Router();
const jsonParser = express.json();

//WILL NEED TO IMPLEMENT A KNEX INSTANCE OF THE DATABASE ON EACH ROUTE
const db = 'my KNEX database';

folderRouter
  .route('/')
  .get((req, res, next) => {
    FoldersService.getAllFolders(db)
      .then(folders => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;

    if(!folder_name){
      return res.status(400).json({error:{message:'Folder Must have a name'}});
    }

    const folder = { folder_name };

    FoldersService(db, folder)
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${folder.id}`))
          .json(folder);
      })
      .catch(next);
  });

folderRouter
  .route('/:folderId')
  .all((req,res,next) =>{
    const id = req.params.folderId;

    FoldersService.getById(db, id)
      .then(folder=>{

        if(!folder){
          return res.status(404).json({
            error:{message: 'No Folder Found'}
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.folder);
  })
  .delete((req,res,next)=>{
    const id = req.params.folderId;

    FoldersService.deleteFolder(db,id)
      .then(()=>{
        res.status(204).end();
      })
      .catch(next);
  })
  .patch((req,res,next)=>{
    const {folder_name} = req.body;

    if(!folder_name){
      return res.status(400).json({
        error:{
          message: 'Request body must contain a folder_name'
        }
      });
    }

    const updatedData = {folder_name};
    const id = req.params.folderId;

    FoldersService.updateFolder(db, id, updatedData)
      .then(()=>{
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRouter;
