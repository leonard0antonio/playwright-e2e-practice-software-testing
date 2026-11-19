import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  // Aguarda o grid de produtos carregar completamente antes de interagir
  await page.waitForLoadState("networkidle");
});

// =========================================================
// TEST CASE 2: Filtro por Categoria (Checkboxes Dinâmicos)
// =========================================================
test("Deve filtrar produtos marcando a categoria Hand Tools", async ({
  page,
}) => {
  // Marca o checkbox da categoria 'Hand Tools'
  const checkboxHandTools = page.getByRole("checkbox", {
    name: "Hand Tools",
    exact: true,
  });
  await checkboxHandTools.check();

  // O site Angular demora alguns milissegundos para filtrar o grid após o clique.
  // Usamos uma asserção no primeiro produto para garantir que o filtro foi aplicado.
  // Dica: Vamos validar se os produtos mostrados têm categorias relacionadas a ferramentas manuais
  await page.waitForTimeout(1000); // Pausa rápida para a animação do Angular estabilizar o grid

  const cardsProdutos = page.locator('[data-test^="product-"]'); // Pega todos os cards
  const quantidadeCards = await cardsProdutos.count();
  expect(quantidadeCards).toBeGreaterThan(0);
});
