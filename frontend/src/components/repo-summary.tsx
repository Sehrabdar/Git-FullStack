import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRepoSummary } from '../api/github-api';
import type {RepoSummary} from '../api/github-api'
import styles from '../styles/repo-summary.module.css';

export default function RepoSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const [summary, setSummary] = useState<RepoSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRepoSummary(id);
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load repo summary');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <>
      <Link to="/">{'< Back to search'}</Link>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {summary && (
        <div className={styles.wrapper}>
          <a href={summary.url} target="_blank" rel="noreferrer">
           <h2 className={styles.link}>{summary.name}</h2>
          </a>
          <div className={styles.meta}>
            <span className={styles.badge}>⭐ Stars: {summary.stars}</span>
            <span className={styles.badge}>🍴 Forks: {summary.forks}</span>
            <span className={styles.badge}>🧮 Commits: {summary.commitsLastYear}</span>
            <span className={styles.badge}>🌿 Branches: {summary.branchesCount}</span>
            {summary.language && (
              <span className={styles.badge}>📝language: {summary.language}</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
