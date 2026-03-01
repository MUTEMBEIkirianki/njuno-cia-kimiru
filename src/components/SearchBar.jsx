function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search proverbs..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={styles.input}
    />
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "20px"
  }
};

export default SearchBar;