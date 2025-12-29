import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface RepoSearchResult {
  id: number;
  name: string;
  fullName: string;
  description: string;
}

export interface RepoSummary {
  name: string;
  description: string;
  stars: number;
  forks: number;
  commitsLastYear: number;
  branchesCount: number;
  language?: string;
  url: string;
}

export const searchRepos = async (term: string): Promise<RepoSearchResult[]> => {
  const { data } = await client.get('/github/search-repos', {
    params: { term },
  });
  return data;
};

export const getRepoSummary = async (id: string): Promise<RepoSummary> => {
  const { data } = await client.get(`/github/${id}/summary`);
  return data;
};
