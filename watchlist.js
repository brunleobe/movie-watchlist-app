const API_KEY = 'f6bd7416';
const container = document.getElementById('watchlist-container');
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function loadWatchlist() {
 if (watchlist.length === 0) {
    container.innerHTML = `
      <div class="empty-watchlist">
        <p style="color: #dfddddf1; font-size: 1.5em; font-weight: 600;">Your watchlist is looking a little empty...</p>
        <button id="add-movies-btn" style="margin-top: 20px; background: none; border: none; cursor: pointer; font-size: 1.2em; display: flex; align-items: center;">
          <span style="font-size: 2em; margin-right: 10px;">&#43;</span>
          <span style="font-weight: bold;">Let’s add some movies!</span>
        </button>
      </div>
    `;
    // Optionally, add an event listener to the button to redirect or open a modal
    document.getElementById('add-movies-btn').onclick = function() {
      
    };
    return;
  }

  container.innerHTML = "";

  watchlist.forEach(id => {
    fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
      .then(res => res.json())
      .then(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");
        movieDiv.innerHTML = `
          <img src="${movie.Poster}" />
          <div>
            <h3>${movie.Title} (${movie.Year})</h3>
            <p>${movie.Plot}</p>
            <button class="remove-button" onclick="removeFromWatchlist('${movie.imdbID}')">
  <span class="remove-icon">−</span>
  Remove
</button>

          </div>
        `;
        container.appendChild(movieDiv);
      });
  });
}

function removeFromWatchlist(imdbID) {
  watchlist = watchlist.filter(id => id !== imdbID);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  loadWatchlist();
}

loadWatchlist();
