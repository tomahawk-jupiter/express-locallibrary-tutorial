# Express Local Library app tutorial from [MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)

## [Forms](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms)

### [express-validator module](https://express-validator.github.io/docs/#basic-guide)

    npm install express-validator

To use in our controllers, we specify the particular functions we want to import from the module:

    const { body,validationResult } = require('express-validator');

There are many functions for checking and sanitizing data from request parameters, body, headers, cookies, etc. We will use the body and validateResult functions:

### The [body()](https://express-validator.github.io/docs/check-api.html#bodyfields-message) function

    body([fields, message])

This is for checking the req.body

Example:

    body('name', 'Empty name').trim().isLength({ min: 1 }).escape(),

Explanation: 

The first argument is the field in the req.body, the second is an optional error message that can be displayed if it fails the tests.

The validation and sanitize criteria are daisy-chained to the body method. **trim()** removes white space from the start and end of the string, **isLength()** to check the string length, and **escape()** to remove HTML characters from the variable that might be used in JavaScript cross-site scripting attacks.

**Another Example:**

This test checks that the age field is a valid date and uses optional() to specify that null and empty strings will not fail validation. 

    body('age', 'Invalid age').optional({ checkFalsy: true }).isISO8601().toDate(),

**Note**: [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) is an international standard for date and time data.

**Example with messages for validators:**

You can also daisy chain different validators, and add messages that are displayed if the preceding validators are true.

    body('name').trim().isLength({ min: 1 }).withMessage('Name empty.')
    .isAlpha().withMessage('Name must be alphabet letters.'),

### The [validationResult(req)](https://express-validator.github.io/docs/validation-result-api.html#validationresultreq) function:

Runs the validation, making errors available in the form of a validation result object. This is invoked in a separate callback, as shown below:

```
(req, res, next) => {
// Extract the validation errors from a request.
const errors = validationResult(req);

if (!errors.isEmpty()) {
    // There are errors. Render form again with sanitized values/errors messages.
    // Error messages can be returned in an array using `errors.array()`.
    }
else {
    // Data from form is valid.
  }
}
```

We use the validation result's isEmpty() method to check if there were errors, and its array() method to get the set of error messages. See the Validation Result API for more information. 

The **validation and sanitization chains are middleware** that should be passed to the Express route handler (we do this indirectly, via the controller). When the middleware runs, each validator/sanitizer is run in the order specified.

## Routes

We will need two routes that have the same URL pattern. 

The first (**GET**) route is used to display the empty form for creating the object. 

The second route (**POST**) is used for validating data entered by the user, then saving the information and redirecting to the detail page (if data is valid) or redisplaying the form with errors (if data is invalid).

-----
## Adding the forms to our application

-----

## [Create Genre form](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_genre_form)

The Genre has only one field, its name, and no dependencies, making it a good place to start.

Like any other pages, we need to set up:

1. Routes
2. Controllers
3. Views

### Import methods from express-validator:

Open **/controllers/genreController.js** and add the following line:

    const { body,validationResult } = require("express-validator");

This is equivalent to...

    validator = require("express-validator");
    body = validator.body();
    validationResult = validator.validationResult();

### controller - get route

The **genre_create_get()** controller will render the **genre_form.pug** view.

### Controller - post route

The **genre_create_post()** controller is more complex, explanation of provided code:

1. The controller specifies an array of middleware functions. The array is passed to the router function and each method is called in order (Note: this approach is needed because the validators are middleware functions).
2.  The first method in the array defines a **body()** validator that validates/sanitizes the field (first argument). This is then daisy-chained with **trim()** for removing white space from the ends, **isLength()** validates the values length, **escape()** for removing dangerout HTML characters.
3. The second thing in the array is a middleware function that first extracts any validation errors (with **validationResult(req)**). We use **isEmpty()** to check if there are errors in the validation result.
4. If there are any errors, we render the form again, passing in our santitized genre object and the array of error messages (**errors.array()**). The user will see the form they just sent (sanitized) with a list of errors (this is done in the view). 
5. If the genre name data is valid we save it to the database then redirect to its detail page, but only if it doesn't already exist. If it does exist we redirect to the existing genre's detail page.

**The same pattern is used in all our post controllers. Recap:**

1. Run validators (with sanitizers).
2. Check for errors
3. Re-render form with error info OR save the data.

## View

We use the same view for both GET and POST controllers/routes, we just pass in different things to it.

Create **/views_form.pug** and copy provided code.


## [Create Author form](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_author_form)

**optional()** will run validation if the field was entered, used to check optional fields in a form.

**{ checkFalsey: true }** means that empty string or null is accepted as an empty value.

    optional({ checkFalsey: true })

Parameters are received from the request as strings. We can use **toDate()** or **toBoolean()** to cast these to the proper JavaScript types.

## [Create Book form](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_book_form)

Wildcard (*), translates to "sanitise every item below key genre:

    body('genre.*').escape(),

This form has **checkbox input type** and **select input type**.

If theres an error and the form is sent back to user, the **checkboxes** must be populated. When the form is rendered the checked attributes value is set as a variable which will be true of undefined (false).

The **options for the select input** are generated from the authors in the database and if the form is sent back to user, the one they selected is set as selected=true.

## [Create BookInstance form](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_BookInstance_form)

The bookInstance book field is an _id in the database but the user sees the books title. This is achieved by setting the value attribute to the books._id and the option elements inner text to the book.title.

## [Delete Author form](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Delete_author_form)

We won’t allow anything that is referenced by other objects to be deleted. To implement this the form needs to check this and display the objects that reference the one trying to be deleted so the user can delete them first.

When rendering the delete form we find the author document in database (get the id from the URL parameter req.params.id) and all the books by that author in the database, these are passed into the pug view.  
If the author isn't found, we redirect to the list of authors view at the /catalog/authors route.

Add a delete author anchor element to go to the get delete author form route.

Input **type='hidden'** used in genre_delete.pug. 

## [Update Book form](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Update_Book_form)

When we get the form for updating the book, we must **populate the form** with the appropriate values. To check the checkboxes for genre we loop through the genres retrieved from the database, then loop through the book.genres (nested loop) and where they match we assign the genre a checked='true' property.  

The author drop down option is choson in the pug view by iterating through the authors until one matches the book.author and setting that as 'selected'.

The **POST route controller** is an array of middleware methods.

## Finishing the other Delete and Update controllers and views

The **html input type='date'** to populate the value by passing in a variable to the pug view, it must be in the ISODate format, use the luxon method below (use a virtual when setting up the model):
    
    .toISODate();