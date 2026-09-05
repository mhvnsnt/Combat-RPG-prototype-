import { Octokit } from 'octokit';
import * as dotenv from 'dotenv';

dotenv.config();

export class GitHubConnector {
  private octokit: Octokit;
  private owner: string;

  constructor() {
    const token = process.env.GITHUB_PAT;
    if (!token) {
      throw new Error('GITHUB_PAT environment variable is required to initialize the connector.');
    }
    
    // Defaulting to the authenticated user's login if an owner isn't explicitly set per request
    this.octokit = new Octokit({ auth: token });
    this.owner = ''; 
  }

  async initialize() {
    const { data } = await this.octokit.rest.users.getAuthenticated();
    this.owner = data.login;
    console.log(`GitHub Connector authenticated as: ${this.owner}`);
  }

  async listRepositories() {
    const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    });
    return data.map(repo => ({ name: repo.name, fullName: repo.full_name, private: repo.private }));
  }

  async inspectRepository(repo: string) {
    const { data } = await this.octokit.rest.repos.get({
      owner: this.owner,
      repo
    });
    return data;
  }

  async readFile(repo: string, path: string, ref?: string) {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo,
        path,
        ref
      });

      if (!Array.isArray(data) && data.type === 'file' && data.content) {
        return Buffer.from(data.content, 'base64').toString('utf8');
      }
      return data;
    } catch (error: any) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async writeFile(repo: string, path: string, content: string, message: string, branch: string = 'main') {
    // Check if file exists to get its SHA
    let sha: string | undefined;
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo,
        path,
        ref: branch
      });
      if (!Array.isArray(data) && data.type === 'file') {
        sha = data.sha;
      }
    } catch (error: any) {
      if (error.status !== 404) throw error;
    }

    const { data } = await this.octokit.rest.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch
    });
    return data;
  }

  async createBranch(repo: string, newBranch: string, baseBranch: string = 'main') {
    // Get base branch SHA
    const { data: refData } = await this.octokit.rest.git.getRef({
      owner: this.owner,
      repo,
      ref: `heads/${baseBranch}`
    });

    // Create new branch
    const { data: newRef } = await this.octokit.rest.git.createRef({
      owner: this.owner,
      repo,
      ref: `refs/heads/${newBranch}`,
      sha: refData.object.sha
    });
    return newRef;
  }

  async createPullRequest(repo: string, title: string, head: string, base: string = 'main', body: string = '') {
    const { data } = await this.octokit.rest.pulls.create({
      owner: this.owner,
      repo,
      title,
      head,
      base,
      body
    });
    return data;
  }
}
