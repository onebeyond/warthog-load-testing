# Contributing to Warthog

Thank you for your interest in contributing to Warthog!

## Development setup

To get a basic development environment for <a href="https://nodejs.org">Node.js</a> and <a href="https://docs.docker.com/compose/install/">Docker Compose</a> up and running, first make sure you have `Git`, `Pnpm`, `Node.js` (see our `package.json` for minimum required version) installed and working properly.

### Dependencies

Consult <a href="https://pnpm.io/cli/install">pnpm docs</a> to find out more about how we manage Warthog dependencies.

```bash
# Installing all dependencies
pnpm install
```

### Running the test suite

```bash
pnpm run test
```

### Running the linter

```bash
pnpm exec eslint . --fix
```

### Commit format

There is a <a href="https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks">git hook</a> that will have been installed via <a href="https://www.npmjs.com/package/husky">husky</a> in charge of checking the syntax in the commits by using <a href="https://www.npmjs.com/package/@commitlint/cli">commitlint</a>.

For more details check the file `.husky/commit-msg`
