const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./folders-fixtures');

describe('Folders Endpoints', () => {
  let db;

  before('make a knex instance named db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('kill db instance', () => db.destroy());

  before('empty table', () => {
    return db.raw('truncate noteful_folders, noteful_notes cascade');
  });

  afterEach('empty table', () => {
    return db.raw('truncate noteful_folders, noteful_notes cascade');
  });

  before('reset sequence', () => {
    return db.raw('ALTER SEQUENCE noteful_folders_id_seq RESTART WITH 1');
  });

  afterEach('reset sequence', () => {
    // db.raw('truncate noteful_folders, noteful_notes cascade');
    return db.raw('ALTER SEQUENCE noteful_folders_id_seq RESTART WITH 1');
  });

  describe('/ GET /api/folders', () => {
    context('Given no folders', () => {
      it('responds with 200 and an empty array', () => {
        return supertest(app)
          .get('/api/folders')
          .expect(200, []);
      });
    });
    context('given folders in table', () => {
      const testFolders = makeFoldersArray();

      beforeEach('insert folders', () => {
        return db('noteful_folders').insert(testFolders);
      });

      it('responds with expected values', () => {
        return supertest(app)
          .get('/api/folders')
          .expect(testFolders);
      });
    });
  });

  describe('POST api/folders', () => {
    context('given folders in table', () => {
      it('posts sent folder and give it an id', () => {
        const folder = {
          folder_name: 'My Posted Folder'
        };

        return supertest(app)
          .post('/api/folders')
          .send(folder)
          .expect(201)
          .then(postedfolder => {
            expect(postedfolder.body.folder_name).to.eql(folder.folder_name);
            expect(postedfolder.body).to.have.property('id');
          });
      });
    });
  });

  describe('GET /api/folders/:folderId', () => {
    context('table has data', () => {
      const testFolders = makeFoldersArray();

      beforeEach('insert folders', () => {
        return db('noteful_folders').insert(testFolders);
      });

      it('responds 204 and removes the folder', () => {
        const id = 2;
        const expected = [
          { id: 1, folder_name: 'test name 1' },
          { id: 3, folder_name: 'test name 3' }
        ];
        return supertest(app)
          .delete(`/api/folders/${id}`)
          .expect(204)
          .then(rows=> supertest(app).get('/api/folders').expect(expected));
      });
    });
  });
  describe('GET /api/folders/:folderId',()=>{
    context('table has data',()=>{
      const testFolders = makeFoldersArray();

      beforeEach('insert folders', () => {
        return db('noteful_folders').insert(testFolders);
      });
      it('Gets folder at given id',() =>{
        const id = 3
        const expected = { id: 3, folder_name: 'test name 3' };

        return supertest(app)
          .get(`/api/folders/${id}`)
          .expect(200, expected);
      });
    });
    context('table has no data',()=>{
      
      it('Gets folder at given id',() =>{
        const id = 12343;

        return supertest(app)
          .get(`/api/folders/${id}`)
          .expect(404);
      });
    });
  });
});
