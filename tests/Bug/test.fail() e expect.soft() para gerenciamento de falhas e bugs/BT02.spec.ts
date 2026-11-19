import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Agora apontamos para a URL com defeitos inseridos propositalmente
  await page.goto("https://with-bugs.practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// BUG 2: Asserções Suaves (expect.soft) na Busca
// =========================================================
test("Deve realizar a busca e validar múltiplos elementos visuais sem parar no primeiro erro", async ({
  page,
}) => {
  // Fazemos uma busca
  await page.locator('[data-test="search-query"]').fill("Pliers");
  await page.locator('[data-test="search-submit"]').click();
  await page.waitForTimeout(1000);

  const primeiroProduto = page.locator('[data-test^="product-"]').first();

  // Na versão com bugs, várias coisas podem quebrar na interface.
  // Se usarmos 'expect' normal, na primeira falha o teste morre.
  // Usando 'expect.soft()', o Playwright anota a falha, mas continua verificando o resto.

  // Verifica se a imagem carregou (Pode falhar na versão com bug)
  await expect.soft(primeiroProduto.locator(".card-img-top")).toBeVisible();

  // Verifica se o título apareceu corretamente
  await expect.soft(primeiroProduto.locator(".card-title")).toBeVisible();

  // Verifica se o preço está visível e correto
  await expect
    .soft(primeiroProduto.locator('[data-test="product-price"]'))
    .toBeVisible();

  // Verifica se o termo da busca reflete no título (Pode estar quebrado e retornar itens errados)
  await expect
    .soft(primeiroProduto.locator(".card-title"))
    .toContainText(/Pliers/i);
});
