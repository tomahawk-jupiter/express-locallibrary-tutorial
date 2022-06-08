# Express Local Library

I followed the tutorial on [MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction).

I made notes in `tutorail_pt1.md` and `tutorial_pt2.md` as I went along.

## Overview

It uses Express, Express Validator, Async, Mongoose, Pug template engine.

### contollers

The `contollers` folder contains the route logic. It uses the Async package to make database queries and express-validator to validate and sanitize user input on the post routes.

### models

The `models` folder contains the schemas / models for the database.

### routes

`routes/catalog.js` is where the routes are setup and the controllers and imported and used.

### Views

This is where the pug templates are. `layout.pug` is where the main page is setup. It contains the navigation panel and is what the other templates will extend.

Bootstrap is used for some default styling. It is imported in the head of the layout template page.

### populatedb.js

This is used to populate the database with some data.

It takes a mongoURL as a command line argument.

## To start the app locally

Install dependencies:

    $ npm i

Create a .env file and put in:

    MONGO_URL=yourMongoConnectionString

Start the server:

    $ npm start

Go to `localhost:3000` in the browser.
