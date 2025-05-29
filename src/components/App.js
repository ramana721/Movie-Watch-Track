import { useState, useEffect } from "react";
import NavBar from "./NavBar";
// import Main from "./main/main";
import MovieResults from "./main/MovieResults";
import MovieWatched from "./main/MovieWatched";
import MovieDetails from "./main/MovieDetails";

// import StarRating from "./StarRating";
import { hover } from "@testing-library/user-event/dist/hover";

// import axios from 'axios';


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
  const [query, setQuery] = useState("real");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isError, setIsError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [movieDetails, setMovieDetails] = useState({});

  const [newAddedMovie, setNewAddedMovie] = useState("");

  const [showModal, setShowModal] = useState(false);

  function handleSelectedId(id) {
    if (id === selectedId) return setSelectedId(null);
    return setSelectedId(id);
  }

  function handleMovieDelete(id) {
    return setWatched((w) => w.filter((m) => m.imdbID !== id));
  }

  function handleAddMovie(movie) {
    return setWatched((watched) => [...watched, movie]);
  }
  // To Fetch Data from OMDB API
  useEffect(
    function () {
      async function fetchResults() {
        if (!query || query.length < 3) return;
        try {
          setIsError("");
          setIsLoading1((b) => !b);
          const res = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${apikey}`
          );

          if (!res.ok) throw new Error("Something Went Wrong...!");

          const data = await res.json();

          if (data.Response === "False")
            throw new Error(data.error || "No Results found");

          // setMovies(() => [...data.Search]);
          setMovies(() => data.Search);
          // console.log(movies);
        } catch (error) {
          setIsError(error.message || "Something Went Wrong.");
        } finally {
          setIsLoading1((b) => !b);
        }
      }
      fetchResults();
    },
    [query]
  );
  // To Fetch In Depth Details of selected Movie
  useEffect(
    function () {
      if (!selectedId) return;
      async function fetchMovieDetails() {
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
    },
    [selectedId]
  );

  return (
    <>
      <NavBar movies={movies} query={query} setQuery={setQuery} />

      <Main>
        <>
          {!isLoading1 && isError.length == 0 && (
            <MovieResults
              handleSelectedId={handleSelectedId}
              setIsOpen1={setIsOpen1}
              isOpen1={isOpen1}
              movies={movies}
            />
          )}
          {isLoading1 && <Loader />}
          {isError.length > 0 && <Error isError={isError} />}

          {!isLoading2 && !selectedId && (
            <MovieWatched
              setIsOpen2={setIsOpen2}
              isOpen2={isOpen2}
              watched={watched}
              handleMovieDelete={handleMovieDelete}
            />
          )}
          {showModal && (
            <SuccessModal
              toggleShowModal={setShowModal}
              movieName={newAddedMovie}
            />
          )}
          {isLoading2 && <Loader />}
          {!isLoading2 && selectedId != null && (
            <MovieDetails
              movieDetails={movieDetails}
              handleSelectedId={handleSelectedId}
              handleAddMovie={handleAddMovie}
              toggleShowModal={setShowModal}
              setNewAddedMovie={setNewAddedMovie}
              watched ={watched}
            />
          )}
        </>
      </Main>
      {/* <StarRating /> */}
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
  return <div className="loader box">Loading ...!</div>;
}

function Error({ isError }) {
  return <div className="error box">{isError}</div>;
}



function SuccessModal({ toggleShowModal, movieName }) {
  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <button
            onClick={() => toggleShowModal((s) => !s)}
            className="modal-close"
          >
            &times;
          </button>
          <h2 className="text-green-600 text-lg font-bold mb-2">Success!</h2>
          <p>{movieName} Movie added to Your Watchlist.</p>
        </div>
      </div>
    </div>
  );
}
