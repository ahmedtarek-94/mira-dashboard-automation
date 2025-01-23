import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
    // Configuration object for login details
    private static readonly CONFIG = {
        URL: 'https://dev-fe.getmira.ai/sign-in?redirect_url=https%3A%2F%2F0.0.0.0%3A4000%2Fdashboard%2Fappointments',
        CREDENTIALS: {
            EMAIL: 'ahmed.tarek@locai.ai',
            PASSWORD: 'qwe@1234qwe'
        }
    };

    // Page and Locator properties
    private readonly page: Page;
    private readonly userName: Locator;
    private readonly password: Locator;
    private readonly loginButton: Locator;
    private readonly pageTitle: RegExp;

    constructor(page: Page) {
        this.page = page;
        this.userName = page.getByPlaceholder('Enter your email');
        this.password = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Sign in', exact: true });
        this.pageTitle = /Mira/;
    }

    // Static method to get default credentials
    static getDefaultCredentials() {
        return { 
            email: this.CONFIG.CREDENTIALS.EMAIL, 
            password: this.CONFIG.CREDENTIALS.PASSWORD 
        };
    }

    // Navigate to login page
    async navigateToLoginPage() {
        await this.page.goto(LoginPage.CONFIG.URL);
    }

    // Fill email with validation
    private async fillEmail(email: string) {
        if (!email) throw new Error('Email cannot be empty');
        await this.userName.click();
        await this.userName.fill(email);
    }

    // Fill password with validation
    private async fillPassword(password: string) {
        if (!password) throw new Error('Password cannot be empty');
        await this.password.click();
        await this.password.fill(password);
    }

    // Comprehensive login method with error handling
    async login(email?: string, password?: string) {
        // Use default credentials if not provided
        const loginEmail = email || LoginPage.CONFIG.CREDENTIALS.EMAIL;
        const loginPassword = password || LoginPage.CONFIG.CREDENTIALS.PASSWORD;

        try {
            // Implement wait strategy
            await this.page.waitForLoadState('networkidle');

            await this.fillEmail(loginEmail);
            await this.fillPassword(loginPassword);
            await this.loginButton.click();

            // Wait for login to complete
            await this.page.waitForLoadState('domcontentloaded');
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Verify login success
    async verifyLoginSuccess() {
        try {
            await expect(this.page).toHaveTitle(this.pageTitle);
        } catch (error) {
            throw new Error('Login verification failed');
        }
    }
}

export default LoginPage;