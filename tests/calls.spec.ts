import { test } from '@playwright/test';
import LoginPage from '../pages/login-page';
import CallsPage from '../pages/calls-page';

test.describe('Calls Page Filters', () => {
    let loginPage: LoginPage;
    let callsPage: CallsPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        
        // Login with default credentials
        const { email, password } = LoginPage.getDefaultCredentials();
        await loginPage.login(email, password);
        
        // Initialize calls page
        callsPage = new CallsPage(page);
        await callsPage.navigateToCallsTab();
    });

    test('Verify Channel Filters', async () => {
        await callsPage.testAllChannelFilters();
    });
});