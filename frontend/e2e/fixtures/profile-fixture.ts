import { test as checkoutTest } from './checkout-fixture';
import { ProfilePage } from '../pages/profile-page';

interface ProfileFixtures {
  profilePage: ProfilePage;
}

export const test = checkoutTest.extend<ProfileFixtures>({
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
});

export { expect } from '@playwright/test';
