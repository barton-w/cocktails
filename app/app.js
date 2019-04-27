//establishing global variables to be used in requests to the API
const baseURL = "https://www.thecocktaildb.com/api/json/v1/";
const guid = "1";  //this can be replaced by an API key should I decide to use premium features of the API
const randomEndpoint = "/random.php";
const ingredientEndpoint = "/filter.php?i=";

//function to return an array of alcoholic cocktails from the API
const getRandCocktails = (num) => {
  for (let i = 0; i < num; i++) {
    $.ajax({
      url: baseURL+guid+randomEndpoint
    }).then((cocktail) => {
      displayCocktail(cocktail.drinks[0]);
    }, (error) => {
      console.log(error);
    });
  };
};

//function that gets called by getRandCocktails to display them on the page
const displayCocktail = (obj) => {
  console.log(obj);
  const $cocktail = $("<div>").addClass("cocktail").text(obj.strDrink);
  const $image = $("<img>").attr("src", obj.strDrinkThumb);
  $cocktail.append($image);
  $("#random").append($cocktail);
}

//function to receive user input from the form, and hit the API's ingredient endpoint
const getSearchCocktails = (value, num) => {
  $.ajax({
    url: baseURL+guid+ingredientEndpoint+value
  }).then((obj) => {
    const cocktailIdArray = [];
    //push 4 random cocktails to an array
    for (let i = 0; i < num; i++) {
      let position = Math.floor(Math.random()*obj.drinks.length);
      cocktailIdArray.push(obj.drinks[position].idDrink);
    };
    getSearchCocktailDetails(cocktailArray);
  }, (error) => {
    console.log(error);
  });
};

//jQuery document ready function
$(() => {
  //on page load, populate the random section with 4 cocktails
  // getRandCocktails(4);

  //event listener for the form
  $("#spirit-form").submit((event) => {
    getSearchCocktails($("#spirit").val(), 4);
    event.preventDefault();
  });
});
