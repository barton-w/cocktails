//establishing global variables to be used in requests to the API
const baseURL = "https://www.thecocktaildb.com/api/json/v1/";
const guid = "1";  //this can be replaced by an API key should I decide to use premium features of the API
const randomEndpoint = "/random.php";
const ingredientEndpoint = "/search.php?i=";

//function to return an array of alcoholic cocktails from the API
const getRandCocktails = (num) => {
  const randCocktails = [];
  for (let i = 1; i <= num; i++) {
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

//jQuery document ready function
$(() => {
  getRandCocktails(4);
});
