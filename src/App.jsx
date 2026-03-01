import { useEffect, useState } from "react";
import { db } from "./firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Analytics } from "@vercel/analytics/next"
function App() {

  const [page, setPage] = useState("home");
  const [proverbs, setProverbs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [dailyProverb, setDailyProverb] = useState(null);

  const [form, setForm] = useState({
    ameru_text: "",
    english_translation: "",
    polished_translation: "",
    explanation: "",
    category: ""
  });

  const categories = [
    "All",
    "Wisdom",
    "Community",
    "Leadership",
    "Family",
    "Humor"
  ];

  // Fetch Proverbs
  useEffect(() => {
    const fetchProverbs = async () => {
      const querySnapshot = await getDocs(collection(db, "proverbs"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProverbs(data);
    };

    fetchProverbs();
  }, []);

  // Load Favorites
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // Proverb of the Day
  useEffect(() => {
    if (proverbs.length === 0) return;

    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("dailyProverbDate");
    const savedProverb = localStorage.getItem("dailyProverb");

    if (savedDate === today && savedProverb) {
      setDailyProverb(JSON.parse(savedProverb));
    } else {
      const random = proverbs[Math.floor(Math.random() * proverbs.length)];
      localStorage.setItem("dailyProverbDate", today);
      localStorage.setItem("dailyProverb", JSON.stringify(random));
      setDailyProverb(random);
    }
  }, [proverbs]);

  const toggleLike = (proverb) => {
    let updated;

    if (favorites.some(item => item.id === proverb.id)) {
      updated = favorites.filter(item => item.id !== proverb.id);
    } else {
      updated = [...favorites, proverb];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  const handleShare = (proverb) => {
    const message = `Njuno Cia Kĩmĩrũ

${proverb.ameru_text}

Meaning:
${proverb.polished_translation}

Shared from Njuno App`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const filteredProverbs = proverbs.filter((p) => {
    const matchesSearch =
      p.ameru_text?.toLowerCase().includes(search.toLowerCase()) ||
      p.english_translation?.toLowerCase().includes(search.toLowerCase()) ||
      p.polished_translation?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      p.category?.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "submitted_proverbs"), form);
    alert("Proverb submitted successfully!");
    setForm({
      ameru_text: "",
      english_translation: "",
      polished_translation: "",
      explanation: "",
      category: ""
    });
  };

  const isFavorite = (id) =>
    favorites.some(item => item.id === id);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#1E1E1E" : "#F5EFE6",
        color: darkMode ? "#F5EFE6" : "#2C2C2C",
        fontFamily: "'Segoe UI', sans-serif",
        transition: "all 0.3s ease"
      }}
    >

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <div>
          <button onClick={() => setPage("home")} style={navButton}>Home</button>
          <button onClick={() => setPage("about")} style={navButton}>About Ameru Culture</button>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            background: darkMode ? "#C19A6B" : "#8B5E34",
            color: "white"
          }}
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      {page === "home" && (
        <>
          <h1 style={{ color: darkMode ? "#C19A6B" : "#8B5E34" }}>
            Njuno Cia Kĩmĩrũ
          </h1>
          <p style={{ fontStyle: "italic" }}>
            Preserving Ameru Wisdom for Future Generations
          </p>

          {dailyProverb && (
            <div style={dailyCard}>
              <h2>🌟 Proverb of the Day</h2>
              <h3>{dailyProverb.ameru_text}</h3>
              <p>{dailyProverb.polished_translation}</p>
            </div>
          )}

          <input
            type="text"
            placeholder="Search proverbs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

          <div style={{ marginBottom: "30px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  background: selectedCategory === cat ? "#8B5E34" : "#E0D6C8",
                  color: selectedCategory === cat ? "white" : "#333"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProverbs.map(proverb => (
            <div key={proverb.id} style={cardStyle(darkMode)}>
              <h3>{proverb.ameru_text}</h3>
              <p><strong>English:</strong> {proverb.english_translation}</p>
              <p><strong>Meaning:</strong> {proverb.polished_translation}</p>
              <p>{proverb.explanation}</p>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => toggleLike(proverb)}>
                  {isFavorite(proverb.id) ? "❤️" : "🤍"}
                </button>
                <button onClick={() => handleShare(proverb)}>
                  Share to WhatsApp
                </button>
              </div>
            </div>
          ))}

          <div style={submitStyle(darkMode)}>
            <h2>🏡 Submit a Proverb</h2>
            <form onSubmit={handleSubmit}>
              {Object.keys(form).map(key => (
                <input
                  key={key}
                  name={key}
                  placeholder={key.replace("_", " ")}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                  style={inputStyle}
                />
              ))}
              <button type="submit" style={submitButton}>
                Submit
              </button>
            </form>
          </div>
        </>
      )}

      {page === "about" && (
        <div style={{ lineHeight: "1.8" }}>
          <h1 style={{ color: darkMode ? "#C19A6B" : "#8B5E34" }}>
            🏛 About Ameru Culture
          </h1>

          <p>
            The Ameru people are a Bantu-speaking community located primarily
            on the eastern slopes of Mount Kenya in Kenya.
          </p>

          <p>
            Ameru culture is rich in oral traditions, storytelling,
            proverbs (Njuno), songs, and communal values that guide social life,
            leadership, morality, and family structure.
          </p>

          <p>
            Proverbs play a central role in teaching wisdom, discipline,
            courage, humility, and unity across generations.
          </p>

          <p>
            This platform — Njuno Cia Kĩmĩrũ — was created to preserve,
            document, and digitally archive Ameru wisdom so that future
            generations can continue learning from their heritage.
          </p>

          <p>
            By digitizing proverbs and encouraging community contributions,
            we ensure that cultural knowledge is not lost in the modern era.
          </p>

          <h3>🌍 Our Mission</h3>
          <p>
            To preserve, celebrate, and promote Ameru cultural wisdom
            through technology.
          </p>
        </div>
      )}

    </div>
  );
}

// Styles
const navButton = {
  marginRight: "10px",
  padding: "6px 14px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  background: "#8B5E34",
  color: "white"
};

const dailyCard = {
  background: "linear-gradient(135deg, #8B5E34, #A47148)",
  color: "white",
  padding: "30px",
  borderRadius: "20px",
  marginBottom: "40px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd"
};

const cardStyle = (darkMode) => ({
  background: darkMode ? "#2A2A2A" : "white",
  padding: "25px",
  borderRadius: "16px",
  marginBottom: "25px",
  borderLeft: `6px solid ${darkMode ? "#C19A6B" : "#8B5E34"}`
});

const submitStyle = (darkMode) => ({
  marginTop: "60px",
  padding: "30px",
  background: darkMode ? "#2A2A2A" : "white",
  borderRadius: "20px"
});

const submitButton = {
  background: "#8B5E34",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer"
};

export default App;