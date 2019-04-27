//establish variables to be used in requests to the API
const baseURL = "https://www.thecocktaildb.com/api/json/v1/";
const guid = "1";  //this can be replaced by an API key should I decide to use premium features of the API
const randomEndpoint = "/random.php";
const ingredientEndpoint = "/search.php?i=";
//function to get random alcoholic cocktails and push them into an array
const randCocktail = (num) => {
  let randCocktailArray = [];
  for (let i = 1; i <= num; i++) {
    $.ajax({
      url: baseURL+guid+randomEndpoint
    }).then((cocktail) => {
      randCocktailArray.push(cocktail);
    }, (error) => {
      console.log(error);
      return;
    });
  };
  console.log(randCocktailArray);
};

//jQuery document ready function
$(() => {
  // $.ajax({
  //   url: "https://www.thecocktaildb.com/api/json/v1/1/random.php?",
  //   success: (result) => {
  //     console.log(result);
  //   }
  // });
  randCocktail(3);
});
