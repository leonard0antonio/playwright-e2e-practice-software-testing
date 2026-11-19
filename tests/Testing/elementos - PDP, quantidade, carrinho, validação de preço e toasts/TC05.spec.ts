import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// TEST CASE 5: Validação da Página de Detalhes
// =========================================================
test("Deve acessar os detalhes do produto e validar suas informações", async ({
  page,
}) => {
  // Capturamos o nome do primeiro produto na Home para comparar depois
  const nomeNaHome = await page
    .locator('[data-test="product-name"]')
    .first()
    .innerText();

  // Clicamos no primeiro produto da vitrine
  await page.locator('[data-test^="product-"]').first().click();

  // Aguardamos a URL mudar, confirmando que saímos da Home
  await expect(page).toHaveURL(/.*product\/.+/);

  // Validamos se a imagem principal carregou
  await expect(page.locator(".img-fluid")).toBeVisible();

  // Validamos se o nome do produto na página de detalhes é o mesmo que vimos na Home
  const nomeNosDetalhes = page.locator('[data-test="product-name"]');
  await expect(nomeNosDetalhes).toHaveText(nomeNaHome);

  // Validamos a presença da marca (Brand) e da descrição
  await expect(
    page.locator('span[aria-label="brand"]'),
  ).toBeVisible();
  await expect(page.locator('[data-test="product-description"]')).toBeVisible();
});
