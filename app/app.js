//establishing global variables to be used in requests to the API
const baseURL = "https://www.thecocktaildb.com/api/json/v1/";
const guid = "1";  //this can be replaced by an API key should I decide to use premium features of the API
const randomEndpoint = "/random.php";
const filterEndpoint = "/filter.php?i=";
const lookupEndpoint = "/lookup.php?i=";

//function that queries the random endpoint and calls displayCocktail with an array of cocktail details
const getRandCocktails = (num) => {
  const randCocktailDupeCheck = [];
  for (let i = 0; i < num; i++) {
    $.ajax({
      async: false,
      url: baseURL+guid+randomEndpoint
    }).then((cocktail) => {
      //Adding a check in case the random endpoint returns the same cocktail within the loop; shouldn't get displayed twice.
      if (randCocktailDupeCheck.includes(cocktail.drinks[0].idDrink)) {
        console.log("dupe");
      } else {
        randCocktailDupeCheck.push(cocktail.drinks[0].idDrink);
        displayCocktail(cocktail.drinks[0], "random");
      };
    }, (error) => {
      console.log(error);
    });
  };
};

//function to receive user input from the form, hit the API's filter endpoint, and call getSearchCocktailDetails with 4 random IDs
const getSearchCocktails = (value, num) => {
  $("#error").remove();
  $.ajax({
    url: baseURL+guid+filterEndpoint+value
  }).then((obj) => {
    //In some cases the filter Endpoint returns less than 4 cocktails. In those cases, only display what the API returns, to avoid dupes, otherwise choose 4 randomly from the response
    const cocktailIdArray = [];
    if (typeof obj.drinks === "undefined") {
      $(".search").append($("<h4>").attr("id", "error").text(`No search-results found for ${value}. Try again with something like gin, vodka, bourbon, scotch, etc.`));
    } else if (obj.drinks.length <= 4) {
      for (let i = 0; i < obj.drinks.length; i++) {
        cocktailIdArray.push(obj.drinks[i].idDrink);
      };
    } else {
      //dividing the API's response into sections, so when I select 1 item randomly from those sections I don't end up with dupes in cocktailIdArray
      const divider = Math.floor(obj.drinks.length / num);
      for (let i = 0; i < num; i++) {
        let position = 0;
        if (i === 0) {
          //first time through the loop
          position = randInt(i, divider);
        } else if (i+1 === num) {
          //last time through the loop
          position = randInt((divider*i)+1, obj.drinks.length-1);
        } else {
          //every other time through the loop
          position = randInt((divider*i)+1, divider*(i+1));
        };
        cocktailIdArray.push(obj.drinks[position].idDrink);
      };
    };
    getSearchCocktailDetails(cocktailIdArray);
  }, (error) => {
    console.log(error);
  });
};

//function that returns a random-integer within an inclusoive range. To be called from getSearchCocktails, as part of dupe-control.
const randInt = (min, max) => {
  return Math.floor(Math.random()*(max-min+1)) + min;
};

//function to loop over the cocktailIdArray and call the lookup endpoint for each Id
const getSearchCocktailDetails = (array) => {
  for (let i = 0; i < array.length; i++) {
    $.ajax({
      url: baseURL+guid+lookupEndpoint+array[i]
    }).then((cocktail) => {
      displayCocktail(cocktail.drinks[0], "recommendations");
    }, (error) => {
      console.log(error);
    });
  };
};

//function that gets called by getRandCocktails and getSearchCocktailDetails to display them on the page
const displayCocktail = (obj, location) => {
  const $cocktail = $("<div>").addClass("cocktail");
  $cocktail.css("background-image", `url(${obj.strDrinkThumb})`);
  $cocktail.append($("<h3>").text(obj.strDrink));
  //create an overlay div to store cocktail details
  const $overlayDiv = $("<div>").addClass("details");
  $overlayDiv.append($("<p>").addClass("ingredient").text(`Glass | ${obj.strGlass}`));
  for (let i = 1; i <= 15; i++) {
    const ingredient = "strIngredient"+i;
    const measure = "strMeasure"+i;
    if (obj[ingredient] !== "" && obj[ingredient] !== null) {
      $overlayDiv.append($("<p>").addClass("ingredient").text(`${obj[ingredient]} | ${obj[measure]}`));
    };
  };
  $overlayDiv.append($("<p>").addClass("instructions").text(obj.strInstructions));
  $cocktail.append($overlayDiv);
  $(`#${location}`).append($cocktail);
};

//jQuery document ready function
$(() => {
  //on page load, populate the random section with 4 cocktails
  getRandCocktails(4);

  //event listener for the form
  $("#spirit-form").submit((event) => {
    $("#recommendations").empty();
    getSearchCocktails($("#spirit").val(), 4);
    event.preventDefault();
  });

  //event listener for the See More button
  $("#see-more").on("click", (event) => {
    $("#random").empty();
    getRandCocktails(4);
  });
});
