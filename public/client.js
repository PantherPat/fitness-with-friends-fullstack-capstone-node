//define global functions, objects, and variables



//use global functions, objects, and variables (triggers)

//when the page loads...
$(document).ready(function () {
    $("main").hide();
    $(".signUpForm").hide();
    $("#signInPageWrapper").show();
    $("#searchPage").hide();
    $("#favoritesButton").hide();
    $("#savedRecipes").hide();
    $("#project-logo").show();
});

//button triggers
$(document).on('click', '.showRegister', function (event) {
    event.preventDefault();
    $("main").hide();
    $(".signUpForm").show();
    $("#signInPageWrapper").show();
    $("#signInPage").hide();
    $("#searchPage").hide();
});

$(document).on('click', '.showSignIn', function (event) {
    event.preventDefault();
    $("main").hide();
    $(".signUpForm").hide();
    $("#signInPageWrapper").show();
    $("#signInPage").show();
    $("#searchPage").hide();
});

$("#favoritesButton button").click(function (event) {
    event.preventDefault();
    $("#favoritesButton").show();
    $("#project-logo").show();
    $("#savedRecipes").toggle();
});

//form trigger
$("#signInButton").click(function (event) {
    event.preventDefault();


    //take the input from the user
    const username = $("#signInPageUserName").val();
    const password = $("#signInPagePassword").val();

    //validate the input
    if (username == "") {
        alert('Please input user name');
    } else if (password == "") {
        alert('Please input password');
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const loginUserObject = {
            username: username,
            password: password
        };
        console.log(loginUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                displayFavoriteRecipes(result.username);
                $(".sign-in-form").hide();
                $("#searchPage").show();
                $(".signUpForm").hide();
                $("#favoritesButton").show();
                $("#savedRecipes").hide();
                $('#loggedInUserName').val(result.username);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});

$("#signUpButton").click(function (event) {
    event.preventDefault();

    //take the input from the user
    const name = $("#signUpPageFullName").val();
    const username = $("#signUpPageUserName").val();
    const password = $("#signUpPagePassword").val();
    const confirmPassword = $("#signUpPageConfirmPassword").val();

    //validate the input
    if (name == "") {
        alert('Please add a name');
    } else if (username == "") {
        alert('Please add an user name');
    } else if (password == "") {
        alert('Please add a password');
    } else if (confirmPassword != password) {
        alert("Passwords do not match")
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const newUserObject = {
            name: name,
            username: username,
            password: password
        };
        //console.log(newUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $(".sign-in-form").hide();
                $("#searchPage").show();
                $(".signUpForm").hide();
                $("nav").show();
                $("#savedRecipes").hide();
                $('#loggedInUserName').val(result.username);
                $("#favoritesButton").show();
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});

function displayEdamamRecipes(result) {
    //create an empty variable to store one LI for each one the results

    var buildTheHtmlOutput = "";

    $.each(result.hits, function (resultKey, resultValue) {
        //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
        console.log()
        buildTheHtmlOutput += '<li class="result-items">';
        buildTheHtmlOutput += '<div class="result-item-image">';
        buildTheHtmlOutput += '<form class="addToFavoritesList">';
        buildTheHtmlOutput += '<input type="hidden" class="addToFavoritesListLabel" value="' + resultValue.recipe.label + '">';
        buildTheHtmlOutput += '<input type="hidden" class="addToFavoritesListUrl" value="' + resultValue.recipe.url + '">';
        buildTheHtmlOutput += '<button type="submit" class="addToFavoritesListButton">';
        buildTheHtmlOutput += "Add to Favorites";
        buildTheHtmlOutput += '</button>';
        buildTheHtmlOutput += '</form>';
        buildTheHtmlOutput += "<img src='" + resultValue.recipe.image + "'/>";
        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '<div class="result-item-description">';
        buildTheHtmlOutput += '<h3>' + resultValue.recipe.label + '</h3>'; //insert api information
        buildTheHtmlOutput += '<ul class="recipe-ingredients">';
        $.each(resultValue.recipe.ingredients, function (resultIngredientsKey, resultIngredientsValue) {
            buildTheHtmlOutput += '<li>' + resultIngredientsValue.text + '</li>';
        });
        buildTheHtmlOutput += '</ul>';
        buildTheHtmlOutput += '<a target="_blank" class="details-button" href="' + resultValue.recipe.url + '">Details</a>';
        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '</li>';
    });

    //use the HTML output to show it in the index.html
    $(".results-page-wrapper").html(buildTheHtmlOutput);
}
$("#searchButton").click(function (event) {
    event.preventDefault();
    //take the input from the user
    const searchInput = $("#searchInput").val();
    const loggedInUserName = $("#loggedInUserName").val();

    //validate the input
    if (searchInput == "") {
        alert('Search by ingredients');
    }
    //if the input is valid
    else {


        //make the api call using the payload above
        $.ajax({
                type: 'GET',
                url: '/edamam/' + searchInput,
                dataType: 'json',
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $(".sign-in-form").hide();
                $("#searchPage").show();
                $(".signUpForm").hide();
                $("#searchPageWrapper").show();
                displayEdamamRecipes(result);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };


});
$(document).on("click", ".addToFavoritesListButton", function (event) {

    event.preventDefault();


    //take the input from the user
    const label = $(this).parent().find(".addToFavoritesListLabel").val();
    const url = $(this).parent().find(".addToFavoritesListUrl").val();
    const loggedInUserName = $("#loggedInUserName").val();

    //validate the input
    if (label == "") {
        alert('Please add a name');
    } else if (url == "") {
        alert('Please add an user name');
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const newFavoritesObject = {
            label: label,
            url: url,
            loggedInUserName: loggedInUserName
        };
        //        console.log(newFavoritesObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/favorite/create',
                dataType: 'json',
                data: JSON.stringify(newFavoritesObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $(".sign-in-form").hide();
                $("#searchPage").show();
                $(".signUpForm").hide();

                displayFavoriteRecipes(loggedInUserName);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});


$(document).on("click", "#favoritesButton", function (event) {
    //we want to show container for recipes
});

// show all favorites for logged in user
function displayFavoriteRecipes(loggedInUserName) {
    //create an empty variable to store the results in
    $.ajax({
            type: 'GET',
            url: '/favorite/get/' + loggedInUserName,
            dataType: 'json',
            data: JSON.stringify(displayFavoriteRecipes),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            console.log(result);
            //create html here and then create a app.get in the server.js for the correct functions
            var buildTheHtmlOutput = "";

            $.each(result.favoritesOutput, function (resultKey, resultValue) {
                buildTheHtmlOutput += '<li class = "list-Of-Recipes">';
                buildTheHtmlOutput += '<form class="deleteFromFavoritesList favoriteListColumn">';
                buildTheHtmlOutput += '<input type="hidden" class="deleteFromFavoritesListId" value="' + resultValue._id + '">';
                buildTheHtmlOutput += '<button type="submit" class="deleteFromFavoritesListButton">';
                buildTheHtmlOutput += "X";
                buildTheHtmlOutput += '</button>';
                buildTheHtmlOutput += '</form>';
                buildTheHtmlOutput += '<a class="favoriteListColumn" href="' + resultValue.url + '" >';
                buildTheHtmlOutput += resultValue.label;
                buildTheHtmlOutput += '</a>';
                buildTheHtmlOutput += '</li>';
            });
            $("#savedRecipes ul").html(buildTheHtmlOutput);


        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}
$(document).on("click", ".deleteFromFavoritesListButton", function (event) {

    event.preventDefault();


    //take the input from the user
    const deleteFavoritesId = $(this).parent().find(".deleteFromFavoritesListId").val();
    const loggedInUserName = $("#loggedInUserName").val();

    console.log(deleteFavoritesId);
    //make the api call using the payload above
    $.ajax({
            type: 'DELETE',
            url: '/favorite/delete/' + deleteFavoritesId,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            console.log(result);


            displayFavoriteRecipes(loggedInUserName);
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
});
