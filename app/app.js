//establishing global variables to be used in requests to the API
const baseURL = "https://www.thecocktaildb.com/api/json/v1/";
const guid = "1";  //this can be replaced by an API key should I decide to use premium features of the API
const randomEndpoint = "/random.php";
const filterEndpoint = "/filter.php?i=";
const lookupEndpoint = "/lookup.php?i=";

//function that queries the random endpoint and calls displayCocktail with an array of cocktail details
const getRandCocktails = (num) => {
  for (let i = 0; i < num; i++) {
    $.ajax({
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
  const $image = $("<img>").attr("src", obj.strDrinkThumb);
  $cocktail.append($("<h3>").text(obj.strDrink));
  $cocktail.append($image);
  // $cocktail.append($ingredients);
  // const $ingredients = $("<ul>").addClass("ingredients");
  $cocktail.append($("<p>").addClass("instructions").text(`Glass | ${obj.strGlass}`));
  for (let i = 1; i <= 15; i++) {
    const ingredient = "strIngredient"+i;
    const measure = "strMeasure"+i;
    if (obj[ingredient] !== "" && obj[ingredient] !== null) {
      $cocktail.append($("<p>").addClass("instructions").text(`${obj[ingredient]} | ${obj[measure]}`));
    };
  };
  $cocktail.append($("<p>").addClass("instructions").text(obj.strInstructions));
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

  //event listener for the See More button in the #random section
  $("#see-more").on("click", (event) => {
    $("#random").empty();
    getRandCocktails(4);
  });
});
