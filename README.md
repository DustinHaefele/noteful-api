# Express Boilerplate!



This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

#To Dos

***Perform database design and normalization for the Noteful app. Sketch an Entity Relationship Diagram of the database.

***Write SQL migration scripts to create Noteful database with tables for folders and notes including relationships and CASCADES

Write Note and Folder service objects for the new tables designed above.

Write routers to perform CRUD operations for Notes and Folders.

Write an Express server for the Noteful API with the endpoints /notes and /folders.

Refactor the client application to use this API. Start by changing the URL used to request data and see if that works. If not, make necessary modifications to the client application.