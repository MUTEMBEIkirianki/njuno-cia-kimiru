import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

function SubmitProverb() {

  const [form, setForm] = useState({
    ameru_text: "",
    english_translation: "",
    polished_translation: "",
    explanation: "",
    category: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "submitted_proverbs"), form);
      setMessage("Proverb submitted successfully!");
      setForm({
        ameru_text: "",
        english_translation: "",
        polished_translation: "",
        explanation: "",
        category: ""
      });
    } catch (error) {
      setMessage("Submission failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🏡 Submit a Proverb</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="ameru_text"
          placeholder="Ameru Proverb"
          value={form.ameru_text}
          onChange={handleChange}
          required
        />
        <input
          name="english_translation"
          placeholder="English Translation"
          value={form.english_translation}
          onChange={handleChange}
        />
        <input
          name="polished_translation"
          placeholder="Meaning"
          value={form.polished_translation}
          onChange={handleChange}
        />
        <textarea
          name="explanation"
          placeholder="Explanation"
          value={form.explanation}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "40px",
    padding: "20px",
    background: "#f4eee6",
    borderRadius: "12px"
  }
};

export default SubmitProverb;