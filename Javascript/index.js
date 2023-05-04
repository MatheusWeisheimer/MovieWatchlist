let currentMovies = []
let watchlist = []

getWatchlist()

document.addEventListener('click', (e) => {
    const id = e.target.dataset.id
    const addRemove = e.target.dataset.addRemove
    if (id) {
        if (addRemove === 'add') {
            modifyWatchlist(id, true)
            renderMovies(currentMovies)
        }
        else {
            modifyWatchlist(id, false)
            renderMovies(currentMovies)
        }
    }
    else if (e.target.id === 'search-btn') {
        e.preventDefault()
        getMoviesArray()
    }
})

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname == '/watchlist.html') {
        initWatchlist()
    }
  });

function getWatchlist() {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist'))
    if(storedWatchlist)
        watchlist = storedWatchlist
}

async function getMoviesArray() {
    const title = document.getElementById('search-bar').value.replaceAll(' ', '+')
    const res = await fetch(`http://www.omdbapi.com/?apikey=af9f9545&s=${title}`)
    const data = await res.json()
    const resultingMovies = await Promise.all(data.Search.map(async (film) => {
            const res = await fetch(`http://www.omdbapi.com/?apikey=af9f9545&i=${film.imdbID}`)
            const data = await res.json()
            return data
    }))
    currentMovies = resultingMovies
    renderMovies(currentMovies, false)
}

function renderMovies(array) {
    const moviesArray = array
    const moviesDisplayHtml = moviesArray.map(movie => {
        const isInWatchlist = watchlist.find(film => film.imdbID === movie.imdbID)
            if(isInWatchlist !== undefined) {console.log('it is')}
    
        return `
            <div class='movie'>
                <h3 class='movie-title'>${movie.Title}<spam class='movie-rating'>⭐${movie.imdbRating}</spam></h3>
                <img src='${movie.Poster}' class='movie-poster' />
                <p class='movie-plot'>${movie.Plot}</p>
                <ul class='movie-info'>
                    <li><p class='movie-runtime'>${movie.Runtime}</p></li>
                    <li><p class='movie-genre'>${movie.Genre}</p></li>
                    <li class='add-to-watchlist'>
                        <img class='sign' src='./images/${isInWatchlist!==undefined?'minus-sign':'plus-sign'}.png' data-id='${movie.imdbID}' data-add-remove='${isInWatchlist!==undefined?'remove':'add'}'>
                        <p class='text' data-id='${movie.imdbID}' data-add-remove='${isInWatchlist!==undefined?'remove':'add'}'>${isInWatchlist!==undefined?'Remove':'Watchlist'}</div>
                    </li>
                </ul>
            </div>
        `
    }).join('')
    document.getElementById('movies-display').innerHTML = moviesDisplayHtml
}

function modifyWatchlist(id, boolean)  {
    const isAdding = boolean
    const toAddMovie = currentMovies.filter(movie => movie.imdbID === id)
    const isRepeated = watchlist.find(movie => movie.imdbID === id)
    
    if (isAdding) {
        if (isRepeated != undefined) {
        }
        else {
            watchlist.push(toAddMovie[0])
            localStorage.setItem('watchlist', JSON.stringify(watchlist))
        }   
    } 
    else {
        const newWatchlist = watchlist.filter(movie => movie.imdbID !== id)
        watchlist = newWatchlist
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
        if (window.location.pathname == '/watchlist.html') {
            currentMovies = watchlist
            renderMovies(currentMovies)
        }
    }
}

function initWatchlist() {
    currentMovies = watchlist
    renderMovies(currentMovies)
    document.querySelector('.absolute').style.display = 'none'
}