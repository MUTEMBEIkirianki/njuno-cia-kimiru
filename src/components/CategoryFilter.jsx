const categories = [
  "All",
  "Wisdom",
  "Community",
  "Leadership",
  "Family",
  "Humor"
];

function CategoryFilter({ selected, setSelected }) {
  return (
    <div style={styles.container}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelected(cat)}
          style={{
            ...styles.button,
            background: selected === cat ? "#8b6f47" : "#ddd",
            color: selected === cat ? "white" : "black"
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  button: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  }
};

export default CategoryFilter;