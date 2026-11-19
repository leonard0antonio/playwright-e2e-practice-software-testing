import type { Page } from "@playwright/test";

export async function openFirstInStockProduct(
  page: Page,
  baseUrl = "https://practicesoftwaretesting.com/",
) {
  const productLinks = page.locator('[data-test^="product-"]');
  await productLinks.first().waitFor({ state: "visible", timeout: 40_000 });

  const count = await productLinks.count();
  for (let index = 0; index < count; index += 1) {
    await productLinks.nth(index).click();
    await page.waitForURL(/.*\/product\/.+/, { timeout: 10_000 });

    const addToCart = page.locator('[data-test="add-to-cart"]');
    await addToCart.waitFor({ state: "visible", timeout: 10_000 });
    if (await addToCart.isEnabled()) {
      return;
    }

    await page.goto(baseUrl);
    await productLinks.first().waitFor({ state: "visible", timeout: 20_000 });
  }

  throw new Error("Nenhum produto disponivel encontrado.");
}
