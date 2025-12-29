import { Link } from 'react-router-dom';
import styles from '../styles/repo-list.module.css';
import type { RepoSearchResult } from '../api/github-api';

interface Props {
  repos: RepoSearchResult[];
}

export default function RepoList({ repos }: Props) {
  if (!repos.length) return null;

  return (
    <div className={styles.grid}>
      {repos.map((repo) => (
        <div key={repo.id} className={styles.card}>
          <div className={styles.fullName}>{repo.fullName} </div>
          <div>
            <Link to={`/repo/${repo.id}`} className={styles.link}>
              <h3 className={styles.heading}>{repo.description}</h3>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
