const searchBox = document.querySelector("#movie-search-box"); //input box
const searchList = document.querySelector("#search-list"); // search suggestions box
const resultGrid = document.querySelector("#result-grid"); // result container from movie page
let favMovies = JSON.parse(localStorage.getItem("favMovies"));
// Set default data to localstorage
if (!localStorage.getItem("favMovies")) {
  let favMovies = [];
  localStorage.setItem("favMovies", JSON.stringify(favMovies));
}

//Find movies for the user
const findMovies = () => {
  let searchTerm = searchBox.value.trim(); // Get typed value and remove whitespace

  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list"); // show the suggestion box
    fetchMovies(searchTerm); //Load movies from API
  } else {
    searchList.classList.add("hide-search-list"); // Hide the suggestion box if no character is present in the search box
  }
};

// fetching movies from OMDB API
async function fetchMovies(searchTerm) {
  const URL = `http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=286d69e2`;

  const res = await fetch(`${URL}`); //Fetching data from server

  const data = await res.json(); //convert data to readable format (JSON)

  if (data.Response == "True") {
    displayMoviesList(data.Search);
  }

}

// Displaying matched movies in the suggestions box
const displayMoviesList = (movies) => {
  searchList.innerHTML = ""; //clear the earlier list of movies

  for (let i = 0; i < movies.length; i++) {
    let movieListItem = document.createElement("div"); // Create a Div
    movieListItem.id = movies[i].imdbID; // Set Id to each movie result
    movieListItem.classList.add("search-list-item"); //Adding 'search-list-item' class to this 'div'

    //Set poster image address
    if (movies[i].Poster != "N/A") {
      moviePoster = movies[i].Poster; // Set image address
    } else {
      moviePoster = "./asset/notFound.png"; //If image not found then set notFound image
    }

    //Add results to suggestions list
    movieListItem.innerHTML = `
        <div class="search-item-thumbnail"> 
            <img src="${moviePoster}" alt="movie">
        </div>

        <div class="search-item-info">
            <h3>${movies[i].Title}</h3>
            <p>${movies[i].Year}</p>
        </div>
        `;

        // adding fav button & updating functionality & icon based on fav value
        const btn = document.createElement("button");
        btn.setAttribute("class", "fav-btn"); // Add CSS
       
        
        
        const prsnt = favMovies.includes(movies[i].imdbID)
    
      if(prsnt){
    btn.innerHTML = `<i class="fa-solid fa-heart" style="color: #d80e22;"></i>`; //Set unique id to delete exact movie
    } else{
      btn.innerHTML = `<i class="fa-regular fa-heart" style="color: #f1f2f3;"></i>`; //Set unique id to delete exact movie
    }
    
      
      btn.addEventListener("click",(e) => { e.stopPropagation(); alterFav(e,btn,movies[i].imdbID)}); // Add event listener to each button
      movieListItem.appendChild(btn);

    searchList.appendChild(movieListItem); //Add a matched movie to autocomplete list
  }

  loadMovieDetails(); //Load movie details
};

//Loading movie details
const loadMovieDetails = () => {
  const searchListMovies = searchList.querySelectorAll(".search-list-item"); //Select all Matched movies

//  Add all matched movies to suggestion box
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list"); //Add CSS
      searchBox.value = ""; //Reset search box

      localStorage.setItem("movieID", movie.id); // Set movie id to localstorage to use it in moviePage.html

      window.location.href = "./moviePage/moviePage.html"; //Redirect to a new page
    });
  });
};

const alterFav = (e ,btn,delID) => {
  const present = favMovies.includes(delID);
  
  if(present) {
      btn.innerHTML = `<i class="fa-regular fa-heart" style="color: #f1f2f3;"></i>`; //Set unique id to delete exact movie
      favMovies = favMovies.filter((id) => id != delID);

  //put updated favMovies to localstorage
  localStorage.setItem("favMovies", JSON.stringify(favMovies));
}
 else{
    btn.innerHTML = `<i class="fa-solid fa-heart" style="color: #d80e22;"></i>`
      favMovies.push(delID); //Add movie to favourite list

    //add new favMovies data to local storage
    localStorage.setItem("favMovies", JSON.stringify(favMovies)); //set data to localstorage
   }
}

// Adding EventListners to different elements
window.addEventListener("click", function (e) {
  if (e.target.className != "form-control") {
    searchList.classList.add("hide-search-list"); // It will hide suggestions box if user click anywhere other than suggestion box
  }
});

searchBox.addEventListener("keyup", findMovies);

