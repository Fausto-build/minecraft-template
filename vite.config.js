/**
* @type {import('vite').UserConfig}
*/
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default {
  base: repositoryName ? `/${repositoryName}/` : '/',
  build: {
    sourcemap: true
  }
}
