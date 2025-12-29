import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchBar from './components/search-bar';
import RepoList from './components/repo-list';
import RepoSummaryPage from './components/repo-summary';
import { searchRepos } from './api/github-api';
import type { RepoSearchResult } from './api/github-api';

export default function App() {
  const [repos, setRepos] = useState<RepoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (term: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await searchRepos(term);
      setRepos(results);
    } catch (err) {
      console.error(err);
      setError('Failed to search repositories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              GitHub Repository Search
            </h1>
            <SearchBar onSearch={handleSearch} />
            {loading && <p>Hold on...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <RepoList repos={repos} />
          </>
        }
      />
      <Route path="/repo/:id" element={<RepoSummaryPage />} />
    </Routes>
  );
}
