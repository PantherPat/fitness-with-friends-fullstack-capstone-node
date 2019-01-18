# Recipe Search Node Capstone

The RecipePal app is designed to populate recipes based off of ingredients you would like to use. Simply put in the the ingredients and the app will generate dishes that have at least one of the ingredients in it.

## Screenshots

Home/Sign-in Page
![Home/Sign-In Page](https://github.com/PantherPat/recipe-search-node-captstone/blob/master/github-images/sign-in-page.jpg)
Sign-Up Page
![Sign-Up Page](https://github.com/PantherPat/recipe-search-node-captstone/blob/master/github-images/Sign-up-page.jpg)
User Dashboard to search
![Search Page](https://github.com/PantherPat/recipe-search-node-captstone/blob/master/github-images/search-page.jpg)
Search Results Page|
![Search Results ](https://github.com/PantherPat/recipe-search-node-captstone/blob/master/github-images/SearchResults.jpg)
Delete Recipe |
![Favorited Recipe](https://github.com/PantherPat/recipe-search-node-captstone/blob/master/github-images/DeletePage.jpg)

## User Cases
As a visitor you should be able to securely log in to my applications. In order to properly/securly navigate the application.
As a visitor after you have logged in you should be forwarded to the home/main page. In order begin your search.
As a user, you should be able to enter keywords in the search bar to search for recipes containing those ingredients.
As a user, you should see search results populating dishes/recipes based off of the parameter you set. So that
As a user you should see the recipe broken down by ingredients with the exact measurements. So that the user can begin their cooking process immediately without having to go to a different site.
As a user you should be able to "favorite" the recipes you really like and have them saved. So that the user can easily find their saved recipes




### UI Flow
![UI Flow handwritten draft](https://github.com/PantherPat/recipe-search-node-captstone/blob/master/github-images/UI-flow.jpg)

### Wireframe _main
![Wireframe _Main](https://github.com/PantherPat/recipe-search-node-captstone/blob/master/github-images/Wireframe.jpg)

## Working Prototype
You can access a working prototype of the app here: https://fitness-with-friends-node.herokuapp.com/

## Functionality
The app's functionality is fairly straight forward. The app populates recipes through an API call, that searches the database for keywords set by the user.


## Technology
* Front-End: HTML5 | CSS3 | JavaScript ES6 | jQuery
* Back-End: Node.js | Express.js | Mocha | Chai | RESTful API Endpoints | MongoDB | Mongoose



## Responsive
App is strongly built to be usuable on mobile devices, as well as responsive across mobile, tablet, laptop, and desktop screen resolutions.

#  The typical command lines for capstone projects

## Node command lines
* npm install ==> install all node modules
* npm install --save bcryptjs body-parser cors express mongodb mongoose passport passport-http unirest
* npm install --save-dev chai chai-http mocha faker
* nodemon server.js ==> run node server
* npm test ==> run the tests

## Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* Google Maps integrated to view all entries by location
* Featured Theaters of the World Section
