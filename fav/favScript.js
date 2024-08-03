//selecting the result container div, so that we can append favMovies inside it
const resultContainer = document.querySelector(".result-container");

//Get fav moview id from localstorage
let favMovies = JSON.parse(localStorage.getItem("favMovies"));

//Get all Favourite movies
favMovies.forEach((id) => {
  getData(id); // Get Movie from API with ID
});

//Get Movies from Server
async function getData(movieID) {
  console.log(movieID);
  const result = await fetch(
    `http://www.omdbapi.com/?i=${movieID}&apikey=286d69e2`
  ); //Get data from API using IMDB id
  const movieDetails = await result.json(); //Make data readable

  AddMovie(movieDetails); //Add to DOM
}

//Add movie to DOM
const AddMovie = (details) => {
  const movieItem = document.createElement("div"); //Create movie box

  movieItem.setAttribute("id", details.imdbID); //Set unique id to delete exact movie
  movieItem.setAttribute("class", "result-grid"); //Add CSS

  movieItem.innerHTML = `<div class="movie-poster">
        <img src="${
          details.Poster != "N/A" ? details.Poster : "../notFound.png"
        }" alt="movie-poster">
        </div>

        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>

            <p class="genre"><b>Genre: </b>${details.Genre}</p>
            <p class="writer"><b>Writer: </b> ${details.Writer}</p>
            <p class="actors"><b>Actors: </b> ${details.Actors}</p>
            <p class="plot"><b>Plot: </b> ${details.Plot}</p>
            <p class="language"><b>Language: </b> ${details.Language}</p>
            <p class="awards"><b>Awards: <i class="fa-solid fa-award"></i></b> ${
              details.Awards
            }</p>
        </div> 
        `;

  //Create button for each favourite movie
  const btn = document.createElement("button");
  btn.setAttribute("class", "delete-btn"); // Add CSS
  btn.innerHTML = `<i class="fa-solid fa-trash">`; //Set unique id to delete exact movie

  btn.addEventListener("click",() =>{ deleteMovie(details.imdbID)}); // Add event listener to each button
  movieItem.appendChild(btn); //Add button to Movie

  resultContainer.appendChild(movieItem); //Add movie to DOM
};

//Delete movie from DOM
const deleteMovie = (delID) => {
  
//Get the specific movie
  const movie = document.getElementById(`${delID}`);

  //Delete movie from view
  movie.remove();

  //Delete the movie from list
  favMovies = favMovies.filter((id) => id != delID);

  //put updated favMovies to localstorage
  localStorage.setItem("favMovies", JSON.stringify(favMovies));
};
