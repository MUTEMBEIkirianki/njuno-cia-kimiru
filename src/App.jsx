import { useEffect, useState } from "react";
import { db } from "./firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";

function App() {

  /* ================= PWA INSTALL ================= */

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("App installed");
    }

    setDeferredPrompt(null);
    setCanInstall(false);
  };

  /* ================= APP STATE ================= */

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

  /* ================= FETCH ================= */

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

  /* ================= FAVORITES ================= */

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

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

  const isFavorite = (id) =>
    favorites.some(item => item.id === id);

  /* ================= DAILY PROVERB ================= */

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

  /* ================= SHARE ================= */

  const handleShare = (proverb) => {
    const message = `Njuno Cia Kĩmĩrũ

${proverb.ameru_text}

Meaning:
${proverb.polished_translation}

Shared from Njuno App`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  /* ================= FILTER ================= */

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

  /* ================= SUBMIT ================= */

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

  /* ================= UI ================= */

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

      {/* Install Button */}
      {canInstall && (
        <button onClick={installApp} style={installButton}>
          📱 Install Njuno App
        </button>
      )}

      {/* HOME PAGE */}
      {page === "home" && (
        <>
          <h1 style={{ color: darkMode ? "#C19A6B" : "#8B5E34" }}>
            Njuno Cia Kĩmĩrũ
          </h1>

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

          {filteredProverbs.map(proverb => (
            <div key={proverb.id} style={cardStyle(darkMode)}>
              <h3>{proverb.ameru_text}</h3>
              <p><strong>English:</strong> {proverb.english_translation}</p>
              <p><strong>Meaning:</strong> {proverb.polished_translation}</p>

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
        </>
      )}

    </div>
  );
}

/* ================= STYLES ================= */

const navButton = {
  marginRight: "10px",
  padding: "6px 14px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  background: "#8B5E34",
  color: "white"
};

const installButton = {
  padding: "10px 18px",
  borderRadius: "20px",
  border: "none",
  background: "#8B5E34",
  color: "white",
  cursor: "pointer",
  marginTop: "15px"
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

export default App;