## ShelfCooking
Web-application that allows the user to build their own CookBook.

The app allows the user to easily type their beloved recipes or copy & paste from the Internet.

The user can cook their beloved recipes anywhere because the CookBook is accessible remotely.

## Technologies/frameworks used:
Framework | Purpose | URL
----------| ------- | ---------
Bootstrap | Personalize app styles | http://getbootstrap.com/
jQuery | Build the recipe based on user's actions; <br> Interact with a navigation bar| https://jquery.com/
Javascript | Interaction with database; <br> User authentication | https://www.javascript.com/
Node.js | Server-side environment | https://nodejs.org/
Express.js | Framework to run the app | https://expressjs.com/
Passport.js | User authentication | http://www.passportjs.org/
MySQL | Database dialect | https://dev.mysql.com/
Heroku | Cloud platform to run the app remotely | https://www.heroku.com/
JawsDB | Addon for remote MySQL database | https://www.jawsdb.com/

> I've also used [Siimple template by Bootstrapmade](https://bootstrapmade.com/) as a boilerplate code.

> The app uses basiс Chrome form validation

## Running the application
Go to heroku page: https://shelf-cooking.herokuapp.com/

## Tests
Framework/Library | Purpose | URL
----------- | ------------ | -----------
Mocha | Environment for tests | https://mochajs.org/
Chai | Expectations library | https://www.chaijs.com/
Sinon | Mocks library | https://sinonjs.org/
Supertest | HTTP requests library | https://www.npmjs.com/package/supertest

### To run tests: npm run test

## Expected results
* Once clicking the [app link](https://shelf-cooking.herokuapp.com/) the user goes to the login page. If the user doesn't have an account yet they can go to sign up page to create one.
* After filling all fields in the signup form the user is redirected to the login page to enter both email and password. If the email exists and the password is correct the user is redirected to the home page. Otherwise the related message is shown to let the user know what they have to fix.
* In the home page the user sees their name and list of recipe categories if they already added any to the storage. 
* The user can add their own recipe by clicking the + button. After submitting the filled form the related message is shown to let the user know if the action was successfully completed.
* If the recipe was successfully added to the storage the user can access it by clicking the button named by the recipe's category.

> The backlog: Add the Inventory section to the app. The remote access to home inventory will allow the user to not purchase items that they already have at home and also minimize food wasting because they can choose recipes based on the current inventory.
