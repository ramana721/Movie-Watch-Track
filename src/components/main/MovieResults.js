export default function MovieResults({ handleSelectedId, isOpen1, setIsOpen1, movies }) {
    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen1((open) => !open)}
            >
                {isOpen1 ? "–" : "+"}
            </button>
            {isOpen1 && (
                <ul className="list list-movies">
                    {movies? movies.map((movie) => (
                        <li key={movie.imdbID} onClick={() => handleSelectedId(movie.imdbID)}>
                            <img src={movie.Poster} alt={`${movie.Title} poster`} />
                            <h3>{movie.Title}</h3>
                            <div>
                                <p>
                                    <span>🗓</span>
                                    <span>{movie.Year}</span>
                                </p>
                            </div>
                        </li>
                    )) : null}
                </ul>
            )}
        </div>
    );
}
