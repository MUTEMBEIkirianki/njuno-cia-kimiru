import { useState, useEffect } from "react";

function ProverbCard({ proverb }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setLiked(saved.some((item) => item.id === proverb.id));
  }, [proverb.id]);

  const toggleLike = () => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];

    let updated;

    if (liked) {
      updated = saved.filter((item) => item.id !== proverb.id);
    } else {
      updated = [...saved, proverb];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setLiked(!liked);
  };

  const handleShare = () => {
    const message = `Njuno Cia Kĩmĩrũ

${proverb.ameru_text}

Meaning:
${proverb.polished_translation}

Shared from Njuno App`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div style={styles.card}>
      <h3>{proverb.ameru_text}</h3>
      <p><strong>English:</strong> {proverb.english_translation}</p>
      <p><strong>Meaning:</strong> {proverb.polished_translation}</p>
      <p>{proverb.explanation}</p>

      <div style={styles.actions}>
        <button onClick={toggleLike}>
          {liked ? "❤️" : "🤍"}
        </button>

        <button onClick={handleShare}>
          Share to WhatsApp
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#f9f5ef",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  }
};

export default ProverbCard;