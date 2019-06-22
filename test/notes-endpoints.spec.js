const knex = require('knex');
const app = require('../src/app');
const { makeNotesArray } = require('./notes-fixtures');
const {makeFoldersArray} = require('./folders-fixtures');

describe('Notes Endpoints', () => {
  let db;
  const testFolders = makeFoldersArray();

  before('make a knex instance named db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  before('empty table', () => {
    return db('noteful_notes').truncate();
  });

  before('empty folders table',()=>{
    return db.raw('truncate noteful_folders, noteful_notes cascade');
  });

  before('empty table', () => {
    return db.raw('ALTER SEQUENCE noteful_Notes_id_seq RESTART WITH 1');
  });

  before('insert folders', () => {
    return db('noteful_folders').insert(testFolders);
  });

  after('empty folders table',()=>{
    return db.raw('truncate noteful_folders, noteful_notes cascade');
  });

  after('reset folders sequence',()=>{
    return db.raw('ALTER SEQUENCE noteful_folders_id_seq RESTART WITH 1');
  });

  after('kill db instance', () => db.destroy());

  afterEach('empty table', () => {
    return db('noteful_notes').truncate();
  });

  describe('/ GET /api/Notes', () => {
    context('Given no Notes', () => {
      it('responds with 200 and an empty array', () => {
        return supertest(app)
          .get('/api/notes')
          .expect(200, []);
      });
    });
    context('given notes in table', () => {
      const testNotes = makeNotesArray();

      beforeEach('insert notes', () => {
        return db('noteful_notes').insert(testNotes);
      });

      it('responds with expected values', () => {
        return supertest(app)
          .get('/api/notes')
          .expect(testNotes);
      });
    });
  });

  describe('POST api/notes', () => {
    context('given notes in table', () => {
      it('posts sent note and give it an id', () => {
        const note = {
          title: 'Posted Note test',
          content: 'My Fake Posted Content',
          folders_id: 3,
          date_modified: '2089-05-22T16:28:32.615Z'
        };

        return supertest(app)
          .post('/api/notes')
          .send(note)
          .expect(201)
          .then(postednote => {
            expect(postednote.body.note_name).to.eql(note.note_name);
            expect(postednote.body).to.have.property('id');
          });
      });
    });
  });

  describe('Delete /api/notes/:noteId', () => {
    context('table has data', () => {
      const testNotes = makeNotesArray();

      beforeEach('insert notes', () => {
        return db('noteful_notes').insert(testNotes);
      });

      it('responds 204 and removes the note', () => {
        const id = 2;
        const expected = testNotes.filter(note => note.id !==id);
        return supertest(app)
          .delete(`/api/notes/${id}`)
          .expect(204)
          .then(rows=> supertest(app).get('/api/notes').expect(expected));
      });
    });
  });
  describe('GET /api/notes/:noteId',()=>{
    context('table has data',()=>{
      const testNotes = makeNotesArray();

      beforeEach('insert notes', () => {
        return db('noteful_notes').insert(testNotes);
      });
      it('Gets note at given id',() =>{
        const id = 3
        const expected = testNotes.filter(note => note.id === id)[0];

        return supertest(app)
          .get(`/api/Notes/${id}`)
          .expect(200, expected);
      });
    });
    context('table has no data',()=>{
      
      it('Gets note at given id',() =>{
        const id = 12343;

        return supertest(app)
          .get(`/api/notes/${id}`)
          .expect(404);
      });
    });
  });
});