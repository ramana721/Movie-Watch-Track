import { useState, useEffect } from "react";
import NavBar from "./NavBar";
// import Main from "./main/main";
import MovieResults from "./main/MovieResults";
import MovieWatched from "./main/MovieWatched";

// import axios from 'axios';

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const apikey = "a1af4c5a";
// www.omdbapi.com/?s=${query}&apikey=${apikey}

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isError, setIsError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [movieDetails, setMovieDetails] = useState({});

  function handleSelectedId(id){
    if (id === selectedId) return setSelectedId(null);
    return setSelectedId(id);
  }

  function handleMovieDelete(id){
    return setWatched((w) => w.filter((m) => m.imdbID !== id));
  }

  useEffect(function(){
    async function fetchResults() {
      if (!query || query.length < 3) return ;
      try{
        setIsError('');
        setIsLoading1((b) => !b);
        const res = await fetch(
          `https://www.omdbapi.com/?s=${query}&apikey=${apikey}`
        );
        
        if (!res.ok) throw new Error('Something Went Wrong...!');

        const data = await res.json();

        if (data.Response === "False") throw new Error(data.error || "No Results found");

        // setMovies(() => [...data.Search]);
        setMovies(() => data.Search)
        // console.log(movies);
      }catch(error){
        setIsError(error.message || "Something Went Wrong.");
      }finally{
        setIsLoading1((b) => !b);
      }

    }
    fetchResults();
  }, [query]);

  useEffect(function(){
    if (!selectedId) return ;
    async function fetchMovieDetails(){
      try {
        setIsError("");
        setIsLoading2((b) => !b);
        const res = await fetch(
          `https://www.omdbapi.com/?i=${selectedId}&apikey=${apikey}`
        );

        if (!res.ok) throw new Error("Something Went Wrong...!");

        const data = await res.json();

        if (data.Response === "False")
          throw new Error(data.error || "No Results found");

        setMovieDetails(data);
        // setMovies(() => data.Search);
        // console.log(movies);
      } catch (error) {
        // console.error(error);
      } finally {
        setIsLoading2((b) => !b);
      }
    }
    fetchMovieDetails();
  }, [selectedId])
  

  return (
    <>
    <NavBar movies={movies} query={query} setQuery={setQuery}/>
    
    <Main >
      <>

      {!isLoading1 && isError.length == 0 && <MovieResults handleSelectedId={handleSelectedId} setIsOpen1={setIsOpen1} isOpen1={isOpen1} movies={movies}/>}
      {isLoading1 && <Loader />}
      {isError.length > 0 && <Error isError={isError}/>}

      {!isLoading2 && !selectedId && <MovieWatched setIsOpen2={setIsOpen2} isOpen2={isOpen2} watched={watched} handleMovieDelete={handleMovieDelete}/>}
      {isLoading2 && <Loader />}
      {!isLoading2 && selectedId != null && <MovieDetails movieDetails={movieDetails} handleSelectedId={handleSelectedId}/>}
      
      </>
    </Main >
    <StarRating />
    </>
  );
}


function Main({ children }) {
  return (
    <main className="main">
      {children}
      {/* <MovieResults /> */}
      {/* <MovieWatched /> */}
    </main>
  );
}

function Loader() {
  return (
    <div className="loader box">
      Loading ...!
    </div>
  )
}

function Error({isError}){
  return(
    <div className="error box">
      {isError}
    </div>
  )
}

function MovieDetails({movieDetails, handleSelectedId}) {
  const {
    Title:title,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Director: director, 
    Actors: actors,
    Plot: plot,
    Poster: poster,
    imdbRating,
    imdbID
  } = movieDetails;

  return (
    <div className="details box">
      <header>
        <button className="btn-back" onClick={() => handleSelectedId(imdbID)}>&larr;</button>
        <img src={poster} alt={`${title} Poster`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released}
            <strong>&bull;</strong>
            {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <p>
          <em>{plot}</em>
        </p>
        <p>Cast :- {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}


function StarRating({height=24, width=24, className, color="yellow", maxRating=5}){
  const [rating, setRating] = useState(0);

  function handleRating(id){
    return setRating(id);
  }

  return (
  <div className={className} style={{backgroundColor:"white"}}>
    {Array.from({ length: maxRating }, (_, id) => 
      <span onClick={() => handleRating(id+1)}>
      {rating <= id ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
          width={width}
          height={height}
          border= "2px solid red"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
          width={width}
          height={height}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
    
      </span>
    )}
    <p>{rating || ""}</p>
  </div>
  );
}

// function Star({isEmpty, height, width, color, id, handleRating}){
//   return (
    
//   );
// }