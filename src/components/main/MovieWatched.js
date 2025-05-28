import { average } from "../App";

export default function MovieWatched({ setIsOpen2, isOpen2, watched, handleMovieDelete }) {
    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen2((open) => !open)}
            >
                {isOpen2 ? "–" : "+"}
            </button>
            {isOpen2 && (
                <>
                    <Summary watched={watched} />
                    <MovieWatchList watched={watched} handleMovieDelete={handleMovieDelete} />
                </>
            )}
        </div>
    );
}
function Summary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}
function MovieWatchList({ watched, handleMovieDelete}) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <li key={movie.imdbID}>
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                        <p>
                            <span>⭐️</span>
                            <span>{movie.imdbRating}</span>
                        </p>
                        <p>
                            <span>🌟</span>
                            <span>{movie.userRating}</span>
                        </p>
                        <p>
                            <span>⏳</span>
                            <span>{movie.runtime} min</span>
                        </p>
                        <button className="btn-delete" onClick={() => handleMovieDelete(movie.imdbID)}>X</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
