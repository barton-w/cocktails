# Fancy Booze for Fancy Folks

## Simple application to search for cocktails by spirit and also browse random selections

### https://barton-w.github.io/fancy-booze/

### API - https://www.thecocktaildb.com/api.php

* On load, the app queries the API's random endpoint multiple times via AJAX with async: false.
* Each request returns a random cocktail which is parsed and displayed on the random section of the page.
* The user has the option to search for a specific spirit via a simple form.
* Form submissions are handled via 2 requests to the API:
  1. The filter endpoint returns all cocktail names, images, and ids associated with the specified spirit.
  2. Ids are selected randomly, and a subsequent call is made for each id to the lookup endpoint to retrieve full ingredients and instructions.
* Ingredients and instructions are populated into overlay divs, initially fully-transparent with an opacity transition on hover.

#### Initial Page Wireframe
![Wireframe](images/cocktails-wireframe.png?raw=true "Title")
