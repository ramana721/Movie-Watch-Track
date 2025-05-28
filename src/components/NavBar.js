export default function NavBar({ query, setQuery, movies }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery}/>
      <NumResults movies={movies} />
    </nav>
  );
}

function Logo(){
  return (
    <div className="logo">
      <h1>WatchTrack</h1>
      <span role="img">🎬</span>
    </div>
  );
}

function Search({query, setQuery}) {
  return (
    <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
  );
}

function NumResults({movies}){
  return (
    <p className="num-results">
      Found <strong>{movies ? movies.length : 0}</strong> results
    </p>
  );
}