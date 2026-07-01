import { test as cartTest } from './cart-fixture';
import { CheckoutPage } from '../pages/checkout-page';

interface CheckoutFixtures {
  checkoutPage: CheckoutPage;
}

export const test = cartTest.extend<CheckoutFixtures>({
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

export { expect } from '@playwright/test';
