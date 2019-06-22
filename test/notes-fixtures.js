function makeNotesArray() {
  return [
    {
      id: 1,
      title: 'Note 1',
      content: 'My Fake Content 1',
      folders_id: 1,
      date_modified: '2089-05-22T16:28:32.615Z'
    },
    {
      id: 2,
      title: 'Note 2',
      content: 'My Fake Content 2',
      folders_id: 1,
      date_modified: '2100-05-22T16:28:32.615Z'
    },
    {
      id: 3,
      title: 'Note 3',
      content: 'My Fake Content 3',
      folders_id: 2,
      date_modified: '2120-05-22T16:28:32.615Z'
    }
  ];
}

module.exports = { makeNotesArray };
