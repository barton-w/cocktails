if ($()) {
  console.log("jquery is on");
};
//jQuery document ready function
$(() => {
  $.ajax({
    url: "https://www.thecocktaildb.com/api/json/v1/1/random.php?",
    success: (result) => {
      console.log(result);
    }
  });
});
