import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  // Aguarda o grid de produtos carregar completamente antes de interagir
  await page.waitForLoadState("networkidle");
});

// =========================================================
// TEST CASE 1: Busca Dinâmica de Produtos
// =========================================================
test("Deve buscar por uma ferramenta específica e validar os resultados", async ({
  page,
}) => {
  // Usamos o atributo 'data-test' que os desenvolvedores criaram para nós
  await page.locator('[data-test="search-query"]').fill("Pliers"); // Pliers = Alicate
  await page.locator('[data-test="search-submit"]').click();

  // Como o Angular atualiza a tela sem recarregar, aguardamos o título da busca aparecer
  await expect(page.locator('[data-test="search-caption"]')).toBeVisible();
  await expect(page.locator('[data-test="search-caption"]')).toContainText(
    "Searched for: Pliers",
  );

  // Validamos se os itens retornados realmente contêm a palavra buscada
  const nomesProdutos = page.locator('[data-test="product-name"]');
  await expect(nomesProdutos).toHaveCount(4);
  const quantidade = await nomesProdutos.count();

  expect(quantidade).toBeGreaterThan(0);

  const nomes = await nomesProdutos.allTextContents();
  nomes.forEach((nome) => expect(nome).toMatch(/Pliers/i));
});
