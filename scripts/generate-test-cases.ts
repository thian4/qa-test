/**
 * Script to generate test cases Excel file
 */

import * as XLSX from 'xlsx';
import * as path from 'path';
import { TestCase } from '../src/types';

// Login Module Test Cases
const loginTestCases: TestCase[] = [
  // Functional Test Cases
  {
    id: 'LOGIN-001',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Valid Login with correct credentials',
    preconditions: 'User account exists in the system',
    testSteps: '1. Navigate to DemoBlaze homepage\n2. Click "Log in" button\n3. Enter valid username\n4. Enter valid password\n5. Click "Log in" button in modal',
    expectedResult: 'User is successfully logged in. Welcome message displays username. Login button changes to Logout.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'LOGIN-002',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Logout functionality',
    preconditions: 'User is logged in',
    testSteps: '1. Verify user is logged in\n2. Click "Log out" link in navigation\n3. Observe page state',
    expectedResult: 'User is logged out. Login button reappears. Welcome message is removed.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'LOGIN-003',
    module: 'Login',
    feature: 'User Registration',
    scenario: 'Successful new user signup',
    preconditions: 'Username does not exist in system',
    testSteps: '1. Navigate to DemoBlaze homepage\n2. Click "Sign up" button\n3. Enter new unique username\n4. Enter password\n5. Click "Sign up" button in modal',
    expectedResult: 'Alert displays "Sign up successful." New user can login with created credentials.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'LOGIN-004',
    module: 'Login',
    feature: 'Login Modal',
    scenario: 'Close login modal with X button',
    preconditions: 'User is on homepage',
    testSteps: '1. Click "Log in" button\n2. Verify modal appears\n3. Click X button on modal',
    expectedResult: 'Login modal closes without any action',
    priority: 'Medium',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'LOGIN-005',
    module: 'Login',
    feature: 'Login Modal',
    scenario: 'Close login modal with Close button',
    preconditions: 'User is on homepage',
    testSteps: '1. Click "Log in" button\n2. Verify modal appears\n3. Click "Close" button',
    expectedResult: 'Login modal closes without any action',
    priority: 'Medium',
    type: 'Functional',
    status: 'Ready',
  },

  // Negative Test Cases
  {
    id: 'LOGIN-006',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Login with invalid password',
    preconditions: 'User account exists in the system',
    testSteps: '1. Navigate to DemoBlaze homepage\n2. Click "Log in" button\n3. Enter valid username\n4. Enter incorrect password\n5. Click "Log in" button',
    expectedResult: 'Alert displays "Wrong password." User remains logged out.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'LOGIN-007',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Login with non-existent username',
    preconditions: 'Username does not exist in system',
    testSteps: '1. Navigate to DemoBlaze homepage\n2. Click "Log in" button\n3. Enter non-existent username\n4. Enter any password\n5. Click "Log in" button',
    expectedResult: 'Alert displays "User does not exist." User remains logged out.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'LOGIN-008',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Login with empty username',
    preconditions: 'User is on homepage',
    testSteps: '1. Click "Log in" button\n2. Leave username field empty\n3. Enter password\n4. Click "Log in" button',
    expectedResult: 'Alert displays "Please fill out Username and Password." Login fails.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'LOGIN-009',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Login with empty password',
    preconditions: 'User is on homepage',
    testSteps: '1. Click "Log in" button\n2. Enter username\n3. Leave password field empty\n4. Click "Log in" button',
    expectedResult: 'Alert displays "Please fill out Username and Password." Login fails.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'LOGIN-010',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Login with both fields empty',
    preconditions: 'User is on homepage',
    testSteps: '1. Click "Log in" button\n2. Leave username field empty\n3. Leave password field empty\n4. Click "Log in" button',
    expectedResult: 'Alert displays "Please fill out Username and Password." Login fails.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'LOGIN-011',
    module: 'Login',
    feature: 'User Registration',
    scenario: 'Signup with existing username',
    preconditions: 'Username already exists in system',
    testSteps: '1. Click "Sign up" button\n2. Enter existing username\n3. Enter password\n4. Click "Sign up" button',
    expectedResult: 'Alert displays "This user already exist." Signup fails.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'LOGIN-012',
    module: 'Login',
    feature: 'User Registration',
    scenario: 'Signup with empty username',
    preconditions: 'User is on homepage',
    testSteps: '1. Click "Sign up" button\n2. Leave username empty\n3. Enter password\n4. Click "Sign up" button',
    expectedResult: 'Alert displays "Please fill out Username and Password." Signup fails.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },

  // Edge Cases
  {
    id: 'LOGIN-013',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Login with username containing special characters',
    preconditions: 'User account with special chars exists',
    testSteps: '1. Click "Log in" button\n2. Enter username with special chars (e.g., test@user#123)\n3. Enter correct password\n4. Click "Log in" button',
    expectedResult: 'System handles special characters appropriately. Login succeeds if account exists.',
    priority: 'Medium',
    type: 'Edge Case',
    status: 'Ready',
  },
  {
    id: 'LOGIN-014',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Login with very long username (100+ characters)',
    preconditions: 'None',
    testSteps: '1. Click "Log in" button\n2. Enter username with 100+ characters\n3. Enter password\n4. Click "Log in" button',
    expectedResult: 'System handles long input gracefully. Either truncates or displays appropriate error.',
    priority: 'Low',
    type: 'Edge Case',
    status: 'Ready',
  },
  {
    id: 'LOGIN-015',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Login with whitespace-only username',
    preconditions: 'None',
    testSteps: '1. Click "Log in" button\n2. Enter only spaces as username\n3. Enter password\n4. Click "Log in" button',
    expectedResult: 'System treats whitespace-only input as empty. Displays appropriate error.',
    priority: 'Medium',
    type: 'Edge Case',
    status: 'Ready',
  },
  {
    id: 'LOGIN-016',
    module: 'Login',
    feature: 'User Authentication',
    scenario: 'Login case sensitivity check',
    preconditions: 'User "TestUser" exists in system',
    testSteps: '1. Click "Log in" button\n2. Enter username in different case (e.g., "testuser" instead of "TestUser")\n3. Enter correct password\n4. Click "Log in" button',
    expectedResult: 'Verify case sensitivity behavior. Document whether login is case-sensitive.',
    priority: 'Medium',
    type: 'Edge Case',
    status: 'Ready',
  },

  // Security Test Cases
  {
    id: 'LOGIN-017',
    module: 'Login',
    feature: 'Security',
    scenario: 'SQL Injection attempt in username field',
    preconditions: 'None',
    testSteps: '1. Click "Log in" button\n2. Enter SQL injection string in username (e.g., "\' OR \'1\'=\'1")\n3. Enter any password\n4. Click "Log in" button',
    expectedResult: 'System rejects malicious input. No unauthorized access granted. No SQL errors exposed.',
    priority: 'High',
    type: 'Security',
    status: 'Ready',
  },
  {
    id: 'LOGIN-018',
    module: 'Login',
    feature: 'Security',
    scenario: 'XSS attempt in username field',
    preconditions: 'None',
    testSteps: '1. Click "Log in" button\n2. Enter XSS payload (e.g., "<script>alert(1)</script>")\n3. Enter password\n4. Click "Log in" button',
    expectedResult: 'Script is not executed. Input is sanitized or escaped properly.',
    priority: 'High',
    type: 'Security',
    status: 'Ready',
  },
  {
    id: 'LOGIN-019',
    module: 'Login',
    feature: 'Security',
    scenario: 'Session persistence after browser refresh',
    preconditions: 'User is logged in',
    testSteps: '1. Verify user is logged in\n2. Refresh the browser page\n3. Check login state',
    expectedResult: 'User session persists after page refresh. User remains logged in.',
    priority: 'Medium',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'LOGIN-020',
    module: 'Login',
    feature: 'Security',
    scenario: 'Multiple failed login attempts',
    preconditions: 'Valid username exists',
    testSteps: '1. Attempt login with wrong password 5 times\n2. Observe system behavior',
    expectedResult: 'Document rate limiting behavior if any. Check for account lockout policies.',
    priority: 'Medium',
    type: 'Security',
    status: 'Ready',
  },
];

// Cart Module Test Cases
const cartTestCases: TestCase[] = [
  // Functional Test Cases
  {
    id: 'CART-001',
    module: 'Cart',
    feature: 'Add to Cart',
    scenario: 'Add single product to cart',
    preconditions: 'User is on product detail page',
    testSteps: '1. Navigate to any product detail page\n2. Click "Add to cart" button\n3. Accept the alert\n4. Navigate to Cart',
    expectedResult: 'Alert confirms "Product added." Product appears in cart with correct name and price.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'CART-002',
    module: 'Cart',
    feature: 'Add to Cart',
    scenario: 'Add multiple different products to cart',
    preconditions: 'User is on homepage',
    testSteps: '1. Add first product to cart\n2. Navigate back to homepage\n3. Add second different product to cart\n4. Navigate to Cart',
    expectedResult: 'Both products appear in cart. Total price is sum of both products.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'CART-003',
    module: 'Cart',
    feature: 'Add to Cart',
    scenario: 'Add same product multiple times',
    preconditions: 'User is on product detail page',
    testSteps: '1. Add product to cart\n2. Click "Add to cart" again\n3. Navigate to Cart',
    expectedResult: 'Product appears twice in cart (or quantity increases). Total updates accordingly.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'CART-004',
    module: 'Cart',
    feature: 'Remove from Cart',
    scenario: 'Remove single item from cart',
    preconditions: 'Cart has at least one item',
    testSteps: '1. Navigate to Cart\n2. Click "Delete" link for an item\n3. Observe cart update',
    expectedResult: 'Item is removed from cart. Total price updates. If last item, cart shows empty.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'CART-005',
    module: 'Cart',
    feature: 'Remove from Cart',
    scenario: 'Remove all items from cart',
    preconditions: 'Cart has multiple items',
    testSteps: '1. Navigate to Cart with 3+ items\n2. Delete each item one by one\n3. Observe final state',
    expectedResult: 'All items removed. Cart is empty. Total shows 0 or is hidden.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'CART-006',
    module: 'Cart',
    feature: 'Cart Total',
    scenario: 'Verify total price calculation',
    preconditions: 'Cart is empty',
    testSteps: '1. Add product A ($X) to cart\n2. Add product B ($Y) to cart\n3. Navigate to Cart\n4. Check displayed total',
    expectedResult: 'Total equals $X + $Y. Calculation is accurate.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'CART-007',
    module: 'Cart',
    feature: 'Place Order',
    scenario: 'Complete purchase with valid information',
    preconditions: 'Cart has at least one item',
    testSteps: '1. Navigate to Cart\n2. Click "Place Order"\n3. Fill all required fields (Name, Country, City, Credit Card, Month, Year)\n4. Click "Purchase"',
    expectedResult: 'Success modal appears with order confirmation. Shows amount and card number.',
    priority: 'High',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'CART-008',
    module: 'Cart',
    feature: 'Place Order',
    scenario: 'Close order confirmation modal',
    preconditions: 'Order has been placed successfully',
    testSteps: '1. Complete a purchase\n2. Click "OK" on confirmation modal\n3. Observe page state',
    expectedResult: 'Modal closes. User is returned to homepage. Cart is cleared.',
    priority: 'Medium',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'CART-009',
    module: 'Cart',
    feature: 'Cart Persistence',
    scenario: 'Cart persists after page refresh',
    preconditions: 'Cart has items',
    testSteps: '1. Add items to cart\n2. Refresh the page\n3. Navigate to Cart',
    expectedResult: 'Cart items persist after refresh. Same products and quantities.',
    priority: 'Medium',
    type: 'Functional',
    status: 'Ready',
  },
  {
    id: 'CART-010',
    module: 'Cart',
    feature: 'Cart Navigation',
    scenario: 'Navigate to cart from any page',
    preconditions: 'User is logged in with items in cart',
    testSteps: '1. Navigate to different pages (Home, category pages)\n2. Click "Cart" link from each page',
    expectedResult: 'Cart is accessible from all pages. Content is consistent.',
    priority: 'Medium',
    type: 'Functional',
    status: 'Ready',
  },

  // Negative Test Cases
  {
    id: 'CART-011',
    module: 'Cart',
    feature: 'Empty Cart',
    scenario: 'View empty cart',
    preconditions: 'Cart is empty',
    testSteps: '1. Ensure cart is empty\n2. Navigate to Cart page\n3. Observe display',
    expectedResult: 'Cart page loads without errors. Shows empty state or no items message.',
    priority: 'Medium',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'CART-012',
    module: 'Cart',
    feature: 'Place Order',
    scenario: 'Place order with empty cart',
    preconditions: 'Cart is empty',
    testSteps: '1. Navigate to empty Cart\n2. Click "Place Order"\n3. Observe behavior',
    expectedResult: 'System prevents ordering or shows appropriate message.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'CART-013',
    module: 'Cart',
    feature: 'Place Order',
    scenario: 'Place order with missing required fields',
    preconditions: 'Cart has items',
    testSteps: '1. Navigate to Cart\n2. Click "Place Order"\n3. Leave Name field empty\n4. Fill other fields\n5. Click "Purchase"',
    expectedResult: 'Alert displays "Please fill out Name and Creditcard." Order not placed.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'CART-014',
    module: 'Cart',
    feature: 'Place Order',
    scenario: 'Place order with missing credit card',
    preconditions: 'Cart has items',
    testSteps: '1. Navigate to Cart\n2. Click "Place Order"\n3. Fill Name\n4. Leave Credit Card empty\n5. Click "Purchase"',
    expectedResult: 'Alert displays "Please fill out Name and Creditcard." Order not placed.',
    priority: 'High',
    type: 'Negative',
    status: 'Ready',
  },
  {
    id: 'CART-015',
    module: 'Cart',
    feature: 'Place Order',
    scenario: 'Cancel order modal',
    preconditions: 'Cart has items',
    testSteps: '1. Navigate to Cart\n2. Click "Place Order"\n3. Click "Close" or X button',
    expectedResult: 'Order modal closes. Cart remains unchanged. No order placed.',
    priority: 'Medium',
    type: 'Functional',
    status: 'Ready',
  },

  // Edge Cases
  {
    id: 'CART-016',
    module: 'Cart',
    feature: 'Cart Display',
    scenario: 'Add product with long name',
    preconditions: 'None',
    testSteps: '1. Find product with longest name available\n2. Add to cart\n3. View in Cart',
    expectedResult: 'Product name displays correctly. No text overflow issues.',
    priority: 'Low',
    type: 'Edge Case',
    status: 'Ready',
  },
  {
    id: 'CART-017',
    module: 'Cart',
    feature: 'Cart Total',
    scenario: 'Cart with high-value items (large total)',
    preconditions: 'None',
    testSteps: '1. Add multiple expensive items\n2. Navigate to Cart\n3. Check total calculation',
    expectedResult: 'Total calculates correctly for large amounts. No overflow or display issues.',
    priority: 'Low',
    type: 'Edge Case',
    status: 'Ready',
  },
  {
    id: 'CART-018',
    module: 'Cart',
    feature: 'Place Order',
    scenario: 'Place order with special characters in fields',
    preconditions: 'Cart has items',
    testSteps: '1. Click "Place Order"\n2. Enter special characters in Name (e.g., "José O\'Brien")\n3. Complete other fields\n4. Click "Purchase"',
    expectedResult: 'Order processes successfully. Special characters handled correctly.',
    priority: 'Medium',
    type: 'Edge Case',
    status: 'Ready',
  },
  {
    id: 'CART-019',
    module: 'Cart',
    feature: 'Add to Cart',
    scenario: 'Add product from category page vs product page',
    preconditions: 'None',
    testSteps: '1. From category view, click on product\n2. Add to cart from product detail page\n3. Verify cart entry',
    expectedResult: 'Product added correctly regardless of navigation path.',
    priority: 'Low',
    type: 'Edge Case',
    status: 'Ready',
  },
  {
    id: 'CART-020',
    module: 'Cart',
    feature: 'Cart Persistence',
    scenario: 'Cart behavior across login/logout',
    preconditions: 'None',
    testSteps: '1. Add items to cart while logged out\n2. Login\n3. Check cart\n4. Logout\n5. Check cart again',
    expectedResult: 'Document cart persistence behavior across auth states.',
    priority: 'Medium',
    type: 'Edge Case',
    status: 'Ready',
  },

  // Security Test Cases
  {
    id: 'CART-021',
    module: 'Cart',
    feature: 'Security',
    scenario: 'XSS attempt in order form fields',
    preconditions: 'Cart has items',
    testSteps: '1. Click "Place Order"\n2. Enter XSS payload in Name field\n3. Complete order',
    expectedResult: 'Script not executed. Input sanitized. Order either fails safely or sanitizes input.',
    priority: 'High',
    type: 'Security',
    status: 'Ready',
  },
  {
    id: 'CART-022',
    module: 'Cart',
    feature: 'Security',
    scenario: 'Credit card format validation',
    preconditions: 'Cart has items',
    testSteps: '1. Click "Place Order"\n2. Enter invalid credit card format (letters, symbols)\n3. Click "Purchase"',
    expectedResult: 'Document validation behavior. Note if any format checking exists.',
    priority: 'Medium',
    type: 'Security',
    status: 'Ready',
  },
];

// Generate Excel workbook
function generateTestCasesExcel(): void {
  const workbook = XLSX.utils.book_new();

  // Convert test cases to worksheet format
  const loginData = loginTestCases.map((tc) => ({
    'Test ID': tc.id,
    'Module': tc.module,
    'Feature': tc.feature,
    'Scenario': tc.scenario,
    'Preconditions': tc.preconditions,
    'Test Steps': tc.testSteps,
    'Expected Result': tc.expectedResult,
    'Priority': tc.priority,
    'Type': tc.type,
    'Status': tc.status,
  }));

  const cartData = cartTestCases.map((tc) => ({
    'Test ID': tc.id,
    'Module': tc.module,
    'Feature': tc.feature,
    'Scenario': tc.scenario,
    'Preconditions': tc.preconditions,
    'Test Steps': tc.testSteps,
    'Expected Result': tc.expectedResult,
    'Priority': tc.priority,
    'Type': tc.type,
    'Status': tc.status,
  }));

  // Create worksheets
  const loginSheet = XLSX.utils.json_to_sheet(loginData);
  const cartSheet = XLSX.utils.json_to_sheet(cartData);

  // Set column widths
  const colWidths = [
    { wch: 12 },  // Test ID
    { wch: 10 },  // Module
    { wch: 20 },  // Feature
    { wch: 45 },  // Scenario
    { wch: 35 },  // Preconditions
    { wch: 60 },  // Test Steps
    { wch: 50 },  // Expected Result
    { wch: 10 },  // Priority
    { wch: 12 },  // Type
    { wch: 10 },  // Status
  ];

  loginSheet['!cols'] = colWidths;
  cartSheet['!cols'] = colWidths;

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(workbook, loginSheet, 'Login Tests');
  XLSX.utils.book_append_sheet(workbook, cartSheet, 'Cart Tests');

  // Summary sheet
  const summaryData = [
    { 'Category': 'Login Module', 'Total Tests': loginTestCases.length, 'High Priority': loginTestCases.filter(t => t.priority === 'High').length, 'Functional': loginTestCases.filter(t => t.type === 'Functional').length, 'Negative': loginTestCases.filter(t => t.type === 'Negative').length, 'Edge Cases': loginTestCases.filter(t => t.type === 'Edge Case').length, 'Security': loginTestCases.filter(t => t.type === 'Security').length },
    { 'Category': 'Cart Module', 'Total Tests': cartTestCases.length, 'High Priority': cartTestCases.filter(t => t.priority === 'High').length, 'Functional': cartTestCases.filter(t => t.type === 'Functional').length, 'Negative': cartTestCases.filter(t => t.type === 'Negative').length, 'Edge Cases': cartTestCases.filter(t => t.type === 'Edge Case').length, 'Security': cartTestCases.filter(t => t.type === 'Security').length },
    { 'Category': 'TOTAL', 'Total Tests': loginTestCases.length + cartTestCases.length, 'High Priority': [...loginTestCases, ...cartTestCases].filter(t => t.priority === 'High').length, 'Functional': [...loginTestCases, ...cartTestCases].filter(t => t.type === 'Functional').length, 'Negative': [...loginTestCases, ...cartTestCases].filter(t => t.type === 'Negative').length, 'Edge Cases': [...loginTestCases, ...cartTestCases].filter(t => t.type === 'Edge Case').length, 'Security': [...loginTestCases, ...cartTestCases].filter(t => t.type === 'Security').length },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [
    { wch: 15 },
    { wch: 12 },
    { wch: 13 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Write the file
  const outputPath = path.join(__dirname, '..', 'test-data', 'test-cases.xlsx');
  XLSX.writeFile(workbook, outputPath);

  console.log(`Test cases Excel file generated at: ${outputPath}`);
  console.log(`Total Login test cases: ${loginTestCases.length}`);
  console.log(`Total Cart test cases: ${cartTestCases.length}`);
}

// Run the generator
generateTestCasesExcel();

