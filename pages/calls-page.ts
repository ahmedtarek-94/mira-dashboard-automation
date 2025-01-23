import { type Page, type Locator, expect } from '@playwright/test';

export class CallsPage {
    // Enum-like constant for channel types
    static readonly ChannelType = {
        WEBSITE: 'Website',
        PHONE: 'Phone'
    } as const;

    static readonly PhoneDirection = {
        INBOUND: 'Inbound',
        OUTBOUND: 'Outbound'
    } as const;

    static readonly FilterStatus = {
        PENDING: 'Pending',
        ACTIVE: 'Active',
        RESOLVED: 'Resolved',
        ESCALATED: 'Escalated',
        MISSED: 'Missed',
        DROPPED: 'Dropped'
    } as const;

    // Page and Locator properties
    private readonly page: Page;
    private readonly callsTab: Locator;
    private readonly noLogsLabel: Locator;
    private readonly channelDropdown: Locator;

    private readonly NO_LOGS_TEXT = 'No call logs found! Check back later!';

    constructor(page: Page) {
        this.page = page;
        this.callsTab = page.getByRole('link', { name: 'Calls' });
        this.noLogsLabel = page.getByText(this.NO_LOGS_TEXT);
        this.channelDropdown = page.getByRole('button', { name: 'Channel' });
    }

    // Navigate to Calls tab
    async navigateToCallsTab() {
        try {
            await this.callsTab.click();
            await this.page.waitForLoadState('domcontentloaded');
        } catch (error) {
            throw new Error(`Failed to navigate to Calls tab: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Select channel with error handling
    async selectChannelFilter(channelType: string) {
        try {
            await this.channelDropdown.click();
            const channelOption = this.page.getByRole('menuitemcheckbox', { name: channelType });
            await channelOption.click();
        } catch (error) {
            throw new Error(`Failed to select channel filter ${channelType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Verify channel filter results
    async verifyChannelFilterResults(channelType: string) {
        try {
            switch (channelType) {
                case CallsPage.ChannelType.WEBSITE:
                    await expect(this.noLogsLabel).toBeVisible();
                    break;
                case CallsPage.ChannelType.PHONE:
                    const phoneRow = this.page.getByRole('row', { 
                        name: 'Unknown 90585028895 Sep 30,' 
                    }).locator('div').nth(2);
                    await expect(phoneRow).toBeVisible();
                    break;
                default:
                    throw new Error(`Unsupported channel type: ${channelType}`);
            }
        } catch (error) {
            throw new Error(`Channel filter verification failed for ${channelType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Comprehensive method to test all channel filters
    async testAllChannelFilters() {
        const channelTypes = Object.values(CallsPage.ChannelType);
        
        for (const channelType of channelTypes) {
            try {
                await this.selectChannelFilter(channelType);
                await this.verifyChannelFilterResults(channelType);
                console.log(`Successfully tested channel filter: ${channelType}`);
            } catch (error) {
                console.error(`Failed to test channel filter: ${channelType}`, error);
                throw error;
            }
        }
    }
}

export default CallsPage;