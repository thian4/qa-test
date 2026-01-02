# DemoBlaze QA Automation Framework

A comprehensive end-to-end test automation framework for [DemoBlaze](https://www.demoblaze.com/) e-commerce demo site, built with **Playwright** and **TypeScript**.

## Features

- **Cross-browser Testing**: Chromium, Firefox, WebKit, and mobile viewports
- **Page Object Model (POM)**: Modular, maintainable page classes
- **TypeScript**: Full type safety and IntelliSense support
- **Parallel Execution**: Configurable parallel test runs
- **CI/CD Ready**: GitHub Actions workflow for automated testing
- **Comprehensive Reporting**: HTML reports with screenshots and traces
- **71 Automated Tests**: Covering UI, API, and E2E scenarios

### Test Summary

| Test File                | Category | Tests  |
| ------------------------ | -------- | ------ |
| `login.spec.ts`          | UI       | 20     |
| `cart.spec.ts`           | UI       | 22     |
| `product-browse.spec.ts` | UI       | 19     |
| `auth.api.spec.ts`       | API      | 7      |
| `purchase-flow.spec.ts`  | E2E      | 3      |
| **Total**                |          | **71** |

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd qa-test
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Playwright browsers**

   ```bash
   npx playwright install
   ```

## Running Tests

### Run Specific Test Suites

```bash
# UI tests only
npm run test:ui

# API tests only
npm run test:api

# E2E tests only
npm run test:e2e
```

### Run Tests by Browser

```bash
# Chromium only (71 tests)
npm run test:chromium

# Firefox only (71 tests)
npm run test:firefox

# WebKit (Safari) only (71 tests)
npm run test:webkit

# Desktop browsers only - skips mobile (213 tests)
npm run test:desktop
```

### Run Specific Test File

```bash
npx playwright test tests/ui/login.spec.ts
```

### Run All Tests With All Browsers (213 tests)

```bash
npm test
```

### Code Quality Checks

```bash
# TypeScript type checking
npm run typecheck

# ESLint linting
npm run lint

# ESLint with auto-fix
npm run lint:fix
```

To regenerate the test cases Excel file:

```bash
npm run generate-test-cases
```

## Configuration

### Playwright Configuration (`playwright.config.ts`)

Key settings:

| Setting         | Value                       | Description           |
| --------------- | --------------------------- | --------------------- |
| `testDir`       | `./tests`                   | Test directory        |
| `fullyParallel` | `true`                      | Run tests in parallel |
| `retries`       | 2 (CI) / 0 (local)          | Retry failed tests    |
| `timeout`       | 60000ms                     | Global test timeout   |
| `baseURL`       | `https://www.demoblaze.com` | Application URL       |

### Browser Projects

- **Desktop**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5 (Chrome), iPhone 12 (Safari)

### Environment Variables

| Variable   | Default                     | Description          |
| ---------- | --------------------------- | -------------------- |
| `BASE_URL` | `https://www.demoblaze.com` | Application base URL |
| `CI`       | `false`                     | CI environment flag  |

## Page Object Model

## Reports

### HTML Report

After running tests, view the HTML report:

```bash
npm run report
```

### Report Features

- Test results summary
- Screenshots on failure
- Trace files for debugging
- Video recordings (on failure)

### Artifacts Location

- `playwright-report/` - HTML report
- `test-results/` - Screenshots, traces, videos

## CI/CD Integration

The framework includes a GitHub Actions workflow for automated testing.

### GitHub Actions Workflow

Located at `.github/workflows/playwright.yml`, the workflow:

- **Triggers**: On push/PR to `main` or `master` branches
- **Matrix Testing**: Runs tests on Chromium, Firefox, and WebKit in parallel
- **Artifacts**: Uploads HTML reports and test results on failure
- **Retries**: Automatically retries failed tests (2 retries in CI)

### Running in CI

The workflow runs automatically on push. You can also trigger manually via the GitHub Actions UI.

### CI-Specific Configuration

| Setting | CI Value   | Local Value          |
| ------- | ---------- | -------------------- |
| Workers | 1          | Auto (CPU cores / 2) |
| Retries | 2          | 0                    |
| Video   | On failure | On failure           |
