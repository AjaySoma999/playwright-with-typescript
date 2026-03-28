# Sauce Demo Automation Tests

A Playwright-based automation testing framework for [saucedemo.com](https://www.saucedemo.com/) using the Page Object Model (POM) pattern.

## Project Structure

```
saucedemo/e2e/
├── pages/
│   ├── BasePage.ts          # Base class for all page objects
│   └── HomePage.ts          # Home page object
├── test/
│   └── home.spec.ts         # Test specifications
├── utils/                   # Utility functions (for future use)
├── package.json             # Dependencies configuration
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. Navigate to the e2e directory:
   ```bash
   cd saucedemo/e2e
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests with browser visible (headed mode)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Report

After running tests, an HTML report is generated:

```bash
npx playwright show-report
```

## Configuration

### Browsers Tested

- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox)
- **WebKit** (Desktop Safari)

### Playwright Configuration

The `playwright.config.ts` includes:
- Base URL: https://www.saucedemo.com/
- Parallel execution of tests
- Screenshots on failure
- Video recording on failure
- Trace recording on failure
- HTML report generation

## Page Object Model (POM) Pattern

### BasePage

The `BasePage` class provides common functionality for all page objects:
- Navigation
- Page title retrieval
- URL management
- Page content access
- Browser navigation (back/forward)

### HomePage

The `HomePage` class extends `BasePage` and includes:
- Login form elements (username, password, login button)
- Login method
- Error message handling
- Form visibility checks

## Adding New Tests

1. Create a new page object in the `pages/` directory:
   ```typescript
   import { Page } from '@playwright/test';
   import { BasePage } from './BasePage';

   export class NewPage extends BasePage {
     // Add page elements and methods
   }
   ```

2. Create a new test file in the `test/` directory:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { NewPage } from '../pages/NewPage';

   test.describe('New Page Tests', () => {
     test('Test name', async ({ page }) => {
       const newPage = new NewPage(page);
       // Add test steps
     });
   });
   ```

## Data-driven test guidelines

1. Store test inputs in `test/data` as JSON (or YAML/CSV) files.
2. Use `utils/testData.ts` as a wrapper for data access and computed helpers (`getValidUsers()`, `getCheckoutData()`).
3. Reference wrapper methods in spec files (`login.spec.ts`, `checkout.spec.ts`, `cart.spec.ts`, etc.) to avoid repeated JSON path wiring.
4. Write parameterized tests over data sets:
   - `for (const user of getUsers())` for login behavior
   - `for (const customer of getCheckoutData().customerInfo)` for checkout steps
5. Keep expected assertions close to data (e.g., `expectSuccess` flag in user payload) for clear pass/fail rules.
6. Add a dedicated data-driven spec (`data-driven.spec.ts`) showing canonical usage.


## Troubleshooting

### Tests not running
- Ensure Node.js is installed: `node --version`
- Verify you're in the e2e directory: `pwd`
- Reinstall dependencies: `npm install`
- Install browsers again: `npx playwright install`

### Browser not found
```bash
npx playwright install
```

### Tests fail with network errors
- Check your internet connection
- Ensure saucedemo.com is accessible

## Best Practices

1. Keep page objects focused on a single page/component
2. Use meaningful locator names with data-test attributes when possible
3. Write clear, descriptive test names
4. Use test hooks (beforeEach, afterEach) for setup and teardown
5. Avoid hard-coded waits; use Playwright's auto-waiting
6. Organize tests logically in test suites

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [SauceDemo Test Site](https://www.saucedemo.com/)

## License

ISC
