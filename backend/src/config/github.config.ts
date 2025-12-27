import { registerAs } from "@nestjs/config";

export default registerAs('github', () => ({
  baseUrl: process.env.GITHUB_BASE_URL,
  token: process.env.GITHUB_TOKEN,
}));