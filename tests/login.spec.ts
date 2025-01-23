import { test } from '@playwright/test';
import LoginPage from '../pages/login-page';

test.describe('Login Functionality', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
    });

    test('Successful Login with Default Credentials', async () => {
        const { email, password } = LoginPage.getDefaultCredentials();
        
        await loginPage.login(email, password);
        await loginPage.verifyLoginSuccess();
    });

    // Additional login test scenarios can be added here
});