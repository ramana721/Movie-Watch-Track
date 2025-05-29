import { useState } from "react";
import StarRating from "../StarRating";

export default function MovieDetails({
  movieDetails,
  handleSelectedId,
  handleAddMovie,
  toggleShowModal,
  setNewAddedMovie,
  watched,
}) {
  const [rated, setRated] = useState(0);

  const {
    Title: title,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Director: director,
    Actors: actors,
    Plot: plot,
    Poster: poster,
    imdbRating,
    imdbID,
    Year: year,
  } = movieDetails;

  const run = typeof runtime === "string" ? Number(runtime.split(" ")[0]) : 0;
  // |^ Change this way because sometimes the runtime is not being defined in that cases it's better to just consider as 0
  const movie = {
    imdbID: imdbID,
    Title: title,
    Year: year,
    Poster: poster,
    runtime: run,
    imdbRating: imdbRating,
    // userRating: 9,
  };
  const isRated = watched.find((movie) => movie.imdbID === imdbID);

  return (
    <div className="details box">
      <header>
        <button className="btn-back" onClick={() => handleSelectedId(imdbID)}>
          &larr;
        </button>
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
        {!isRated ? (
          <div className="rating">
            <StarRating
              maxRating={10}
              getRated={setRated}
              className={"rating-align"}
            />
            {rated > 0 && (
              <button
                className="btn-add"
                onClick={() => {
                  movie["userRating"] = rated;
                  handleAddMovie(movie);
                  handleSelectedId(imdbID);
                  setNewAddedMovie((m) => title);
                  toggleShowModal((s) => true);
                }}
              >
                + Add to Watched
              </button>
            )}
          </div>
        ) : <p>You have rated this Movie as {isRated.userRating} ⭐</p>}
        <p>
          <em>{plot}</em>
        </p>
        <p>Cast :- {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}
