# Express Local Library app tutorial from [MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)

[Finished Example on gitHub](https://github.com/mdn/express-locallibrary-tutorial)

## Start server

```
// Windows
SET DEBUG=express-locallibrary-tutorial:* & npm start

// macOS or Linux
DEBUG=express-locallibrary-tutorial:* npm start
```

## Install nodemon as dev dependency

Nodemon will restart the server when you make changes to your code. You still need to refresh your browser.


    $ npm install --save-dev nodemon

Add scripts in package.json

```
  "scripts": {
      "start": "node ./bin/www",
      "devstart": "nodemon ./bin/www",
      "serverstart": "DEBUG=express-locallibrary-tutorial:* npm run devstart"
    },
```

To start the server with node

    npm run start

To start the server with nodemon

    npm run devstart

To start the server with nodemon and debug

    npm run serverstart

## Following the Mongoose [MDN Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#connecting_to_mongodb)

    $ npm install mongoose

## Connect to MongoDB

Open /app.js (in the root of your project) and copy the following text below where you declare the Express application object (after the line var app = express();).  
Replace the database url string ('insert_your_database_url_here') with the location URL representing your own database (i.e. using the information from mongoDB Atlas).

```
//Set up mongoose connection
var mongoose = require('mongoose');
// Use a secret variable for connection string!
var mongoDB = 'insert_your_database_url_here';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

```

### Private variables

You can use a .env file and [dotenv module](https://github.com/motdotla/dotenv#readme) to **keep connection strings private!**  
You should do this before pushing it to GitHub.

Install and require:

```
$ npm install dotenv
require('dotenv').config()
```
**create .env** in the root directory and put in your secret variables (without quotes for the value) and put .env in your **.gitignore** file:

    MONGO_URL=your_connection_string

## Defining the LocalLibrary Schema

We will define a separate module for each model, as discussed above. Start by creating a folder for our models in the project root (/models) and then create separate files for each of the models: 

```
/express-locallibrary-tutorial  //the project root
  /models
    author.js
    book.js
    bookinstance.js
    genre.js
```

### Author Model

Copy the Author schema code shown below and paste it into your **./models/author.js file**. The schema defines an author as having String SchemaTypes for the first and family names (required, with a maximum of 100 characters), and Date fields for the dates of birth and death. 

We've also declared a **virtual** for the AuthorSchema named "url" that returns the absolute URL required to get a particular instance of the model — we'll use the property in our templates whenever we need to get a link to a particular author.

Note: Declaring our URLs as a [virtual](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#virtual_properties) in the schema is a good idea because then the URL for an item only ever needs to be changed in one place. At this point, a link using this URL wouldn't work, because we haven't got any routes handling code for individual model instances. We'll set those up in a later article!

At the end of the module, we export the model.

### Book Model

Copy the Book schema code and paste into the **./model/book.js file**. Mostly its similar to the author model. 

Except we **create references to other models** using [populate](https://mongoosejs.com/docs/populate.html):


- author is a reference to a single Author model object, and is required.
- genre is a reference to an array of Genre model objects. We haven't declared this object yet!

### BookInstance model

Finally, copy the BookInstance schema code shown below and paste it into your **./models/bookinstance.js file**. The BookInstance represents a specific copy of a book that someone might borrow and includes information about whether the copy is available, on what date it is expected back, and "imprint" (or version) details. 

The new things we show here are the field options:

- **enum**: This allows us to set the allowed values of a string. In this case, we use it to specify the availability status of our books (using an enum means that we can prevent mis-spellings and arbitrary values for our status).
- **default**: We use default to set the default status for newly created bookinstances to maintenance and the default due_back date to now (note how you can call the Date function when setting the date!).

### Testing - create some items

1. Download or create populatedb.js (it adds sample data into the database)
2. Install the async module `$ npm install async`, used by the script from #1
3. Run the script using node in your command prompt, passing in the URL of your MongoDB database (the same one you replaced the insert_your_database_url_here placeholder with, inside app.js earlier): `node populatedb <your mongodb url>` **Note**: On some operating systems/terminals, you may need to wrap the database URL inside double (") or single (') quotation marks. 
4. The script should run through to completion, displaying items as it creates them in the terminal.

You can now go to mongoDB atlas and look at the data in the db.

## Route Handler Callbacks (controllers)

Add files for the callbacks that will be used in the root methods

```
/express-locallibrary-tutorial  //the project root
  /controllers
    authorController.js
    bookController.js
    bookinstanceController.js
    genreController.js
```

First import the model that we'll later use to access and update our data.

Then export a function for each of the URLs we want to handle.

Do this for each controller.

We could also include the next function if the method does not complete the request cycle, but we don't need it here.

## Create the catalog route module

Add **catalog.js** to the routes directory in which we'll create routes for all the URLs needed for our website, and which we'll call the controller functions we defined in the controllers directory.

Explanation:

The module requires Express and then uses it to create a Router object. The routes are all setup on the router, which is then exported.

The routes are defined either using .get() or .post() methods on the router object. Routes that act on some specific resource (eg. book) use path parameters to get the object id from the URL.

The handler functions are all imported from the controller modules we created.

## Update the index route modul

In **routes/index.js** change the response to `res.redirect('/catalog');`

## Update app.js

require the catalog route `const catalogRouter = require('/.routes/catalog/');`

Add the catalog route to the middleware stack `app.use('/catalog', catalogRouter);`

Now we prepend /catalog to all the paths defined in the catalog module.

## [Async module](https://caolan.github.io/async/v3/docs.html)

Most Express methods are asynchronous. Using callback 'daisy chains' can lead to 'callback hell' and also you might want to run them in parallel.  
This is where the async module is useful.

    $ npm install async

Some useful methods:

[async.parallel()](https://caolan.github.io/async/v3/docs.html#parallel)

[async.series()](https://caolan.github.io/async/v3/docs.html#series)

[async.waterfall()](https://caolan.github.io/async/v3/docs.html#waterfall)

Waterfall is for when each operation depends on preceding operations.

## [Pug](https://pugjs.org/api/getting-started.html) template views

**views/layout.pug**

Add the given code for the layout template.

The template uses and includes JavaScript and CSS from Bootstrap to improve the layout and presentation of the HTML page.

Copy the given CSS into public/stylesheets/style.css.

## [Home Page](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Home_page)

### Update the bookController file, index method.

Import the all the models so we can use them to get the info from our database, and import the async module.

Use the async.parallel method so we can use the countDocuments method to get the count of each model type. We will end up with all the results in an object that we pass to the template view.

### Home View

In **/views/index.pug** we will extend the layout template and use the object we passed in to display the data. We override the block named 'content'.

We check for an error with an 'if' and list the data 'else'.

**Note**: We don't escape the count values (ie. we use the !{} syntax) because the count values are calculated. If the info was supplied by end-user then we would escape the variable for display.

This page should be working now if you run the app and go to http://localhost:3000/ 

## [Book List Page](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Book_list_page)

Next we'll implement our book list page. This page needs to display a list of all books in the database along with their author, with each book title being a hyperlink to its associated book detail page.

### bookController

We will update the book_list controller method. 

1. It uses the models find() function to rerurn all Book objects, selecting to return only the title and author as we don't need the other fields (it will also return the _id and virtual fields).

2. Then we use the sort() method to sort results alphabetically.

3. We use the populate() specifying the author field, this will replace the stored book author id with the full author details.

4. Finally we use the .exec() function to fire off the query. On success we render the template (that we'll create next) passing in the results from the database query.

### Book View

Create **/views/book_list.pug** and copy the provided code.

This view extends the layout.pug base template and overrides the block named 'content'. It displays the title we passed in from the controller and iterates through the book_list variable (also passed in) using the each-in-else syntax. If there are no books in the book_list then the else clause is executed.

**Note**: We use the book.url to provide the link to the detail record for each book (we've implemented the route, but not the page yet). This is a virtual property of the Book model which used the model instance's _id field to produce a unique URL path.

We use the pipe character to seperate the author name from the hyperlink.

Start the app, go to the homepage and click the All books link to test it.

## [BookInstance list page](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/BookInstance_list_page)

### Controller

The BookInstance list controller function needs to get a list of all book instances, populate the associated book info, then pass the list to the template for rendering.

Copy provided [code](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/BookInstance_list_page).

The method uses the model's find() function to return all BookInstance objects. Then daisy-chains a call to populate() with the book field, this will replace the book id stored for each BookInstance with a full Book document.

On success, the callback passed to the query renders the bookinstance_list(.pug) template, passing variables to it.

### View

Create **/views/bookinstance_list.pug** and copy the provided template.

Iterate through the book copies and display the status (color coded) and the return date if not available.

**New pug feature** introduced: we can use dot notation after a tag to assign a class. So span.text-success will be compiled to `<span class="text-success">` (and might also be written in Pug as span(class="text-success").

## [Date formatting using luxon](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Date_formatting_using_moment)

[luxon Docs](https://github.com/moment/luxon/blob/master/docs/formatting.md#formatting)

    $ npm install luxon

In **./models/bookinstance.js**:

    const { DateTime } = require("luxon");

Add the provided virtual property and update the bookinstance_list.pug view.

The due date should now be formatted nicely.

## [Author list page](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Author_list_page)

controller and view

Copy provided code for **controllers/authorController.js** and **views/author_list.pug**.

The author_list controller calls the next() function with the err as an argument if the query is unsuccessful.

## Genre controller and view

Fill out yourself. Done. genre_list controller and genre_list.pug

## [Genre Detail page](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Genre_detail_page)

controller and view 

[explanation](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Genre_detail_page)

Note: If the genre does not exist in the database (i.e. it may have been deleted) then findById()  will return successfully with no results. In this case we want to display a "not found" page, so we create an Error object and pass it to the next middleware function in the chain. See **genreController.js line 32**

[html description list elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl) that are new to me:

```
<dl>
  <dt></dt>
  <dd></dd>
</dl>
```

Description List.  
Description Term.
Description Details.

## [Book Detail page](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Book_detail_page)

Some more examples of the [.populate()](https://mongoosejs.com/docs/populate.html) mongoose function.

A slightly more complex pug view, and another example of using the async modules .parallel() function.

## [Author Detail page](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Author_detail_page)

More of the same.

## [BookInstance detail page and challenge](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/BookInstance_detail_page_and_challenge)

More of the same.

**pug class attribute** 

    span.text-success hello world

The above will become:

    <span class="text=success>hello world</span>

NOTE - text-success is a bootstrap color.

