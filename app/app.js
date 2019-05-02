//establishing global variables to be used in requests to the API
const baseURL = "https://www.thecocktaildb.com/api/json/v1/";
const guid = "1";  //this can be replaced by an API key should I decide to use premium features of the API
const randomEndpoint = "/random.php";
const filterEndpoint = "/filter.php?i=";
const lookupEndpoint = "/lookup.php?i=";

//function that queries the random endpoint and calls displayCocktail with an array of cocktail details
const getRandCocktails = (num) => {
  for (let i = 0; i < num; i++) {
    console.log("the loop ran!");
    $.ajax({
      async: false,
      url: baseURL+guid+randomEndpoint
    }).then((cocktail) => {
      displayCocktail(cocktail.drinks[0], "random");
    }, (error) => {
      console.log(error);
    });
  };
};

//function to receive user input from the form, hit the API's filter endpoint, and call getSearchCocktailDetails with 4 random IDs
const getSearchCocktails = (value, num) => {
  $.ajax({
    url: baseURL+guid+filterEndpoint+value
  }).then((obj) => {
    const cocktailIdArray = [];
    //push 4 random cocktail IDs to an array
    for (let i = 0; i < num; i++) {
      let position = Math.floor(Math.random()*obj.drinks.length);
      cocktailIdArray.push(obj.drinks[position].idDrink);
    };
    getSearchCocktailDetails(cocktailIdArray);
  }, (error) => {
    console.log(error);
  });
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
    $("#random").children().fadeOut(500, () => {
    });
  });

  //second event listner to delay the getRandCocktails call until after the fadeOut above has run
  $("#see-more").on("click", (event) => {
    setTimeout(() => {
      $("#random").empty();
      getRandCocktails(4);
    }, 500);
  });
});
