import { useEffect, useState } from "react";
import ProverbCard from "./ProverbCard";

function FavoritesSection() {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  if (favorites.length === 0) return null;

  return (
    <div>
      <h2>❤️ Your Favorites</h2>
      {favorites.map((proverb) => (
        <ProverbCard key={proverb.id} proverb={proverb} />
      ))}
    </div>
  );
}

export default FavoritesSection;