const API_KEY = 'f6bd7416';
const resultsDiv = document.getElementById('results');

document.getElementById('search-btn').addEventListener('click', () => {
  const query = document.getElementById('search-input').value.trim();

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        // Fetch full details for each movie
        const movieDetailsPromises = data.Search.map(movie =>
          fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=short`)
            .then(res => res.json())
        );

        Promise.all(movieDetailsPromises).then(movies => {
          resultsDiv.innerHTML = movies.map(movie => `
            <div class="movie">
              <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" />
              <div class="movie-info">
                <h3>
                  ${movie.Title} <span class="year">(${movie.Year})</span>
                  <span class="rating">
                    <span class="star">★</span> ${movie.imdbRating}
                  </span>
                </h3>
                <div class="meta">
                  ${movie.Runtime}
                  &nbsp;&nbsp;
                  ${movie.Genre}
                  &nbsp;&nbsp;
                  <button class="watchlist-btn" onclick="addToWatchlist('${movie.imdbID}')">
                    <span class="icon">+</span> Watchlist
                  </button>
                </div>
                <p>${movie.Plot}</p>
              </div>
            </div>
          `).join('');
        });
      } else {
        resultsDiv.innerHTML = `<p>Unable to find what you're looking for. Please try another search.</p>`;
      }
    });
});

function addToWatchlist(imdbID) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!watchlist.includes(imdbID)) {
    watchlist.push(imdbID);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert("Movie added to watchlist!");
  } else {
    alert("Already in watchlist.");
  }
}
