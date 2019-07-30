## Cocktail Critic

Cocktail Critic is an app that allows logged in users to search for popular alcoholic drinks and add their own personal review and rating. Users can browse other users reviews as well as see a collection of their own reviews which they can reference later.

Link to client repo: https://github.com/navin1551/cocktail-critic

Link to API repo: https://github.com/navin1551/cocktail-critic-api

Link to live app: https://cocktail-critic.now.sh/

## Motivation

I wanted to make a fun app that I felt users would find interesting as I am sure everyone has ordered a drink they wanted to make sure they would or wouldn't try again.  As someone who enjoys the occasional drink, I have been the victim of trying a new drink and absolutely hating it so I thought it would be a cool idea to create a personal and public review board for cocktails. 

Technologies implemented: HTML, CSS, JavaScript, React.js, Node.js, Express.js, PostgreSQL, JWT auth flows, Mocha/Chai testing, API, Git, GitHub, 3rd party AJAX 

# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone https://github.com/navin1551/express-boilerplate.git`
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
