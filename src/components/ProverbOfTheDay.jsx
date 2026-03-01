import { useEffect, useState } from "react";

function ProverbOfTheDay({ proverbs }) {
  const [todayProverb, setTodayProverb] = useState(null);

  useEffect(() => {
    if (proverbs.length === 0) return;

    const today = new Date().toDateString();
    const saved = localStorage.getItem("dailyProverbDate");
    const savedProverb = localStorage.getItem("dailyProverb");

    if (saved === today && savedProverb) {
      setTodayProverb(JSON.parse(savedProverb));
    } else {
      const random = proverbs[Math.floor(Math.random() * proverbs.length)];
      localStorage.setItem("dailyProverbDate", today);
      localStorage.setItem("dailyProverb", JSON.stringify(random));
      setTodayProverb(random);
    }
  }, [proverbs]);

  if (!todayProverb) return null;

  return (
    <div style={styles.card}>
      <h2>🌟 Proverb of the Day</h2>
      <h3>{todayProverb.ameru_text}</h3>
      <p>{todayProverb.polished_translation}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "#e9dcc9",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px"
  }
};

export default ProverbOfTheDay;