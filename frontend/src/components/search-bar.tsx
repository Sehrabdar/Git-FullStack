import { useState } from 'react';
import styles from '../styles/search-bar.module.css';

interface Props {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = term.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        className={styles.input}
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search GitHub repos (e.g. nestjs)"
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
}
