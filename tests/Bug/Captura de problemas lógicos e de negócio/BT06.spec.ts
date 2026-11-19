import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  // Agora apontamos para a URL com defeitos inseridos propositalmente
  await page.goto("https://with-bugs.practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// BUG 6: Filtros que quebram o Estado do Grid
// =========================================================
test("Deve aplicar um filtro, limpar, e garantir que os produtos retornam - BUG CONHECIDO", async ({
  page,
}) => {
  test.fail(
    true,
    "Ticket Jira-125: Desmarcar filtros deixa o grid de produtos travado/vazio",
  );

  // 1. Contamos quantos produtos existem na tela inicial ANTES de mexer em qualquer coisa
  const gridProdutos = page.locator('[data-test^="product-"]');
  const totalInicial = await gridProdutos.count();

  // 2. Aplicamos o filtro de categoria
  await page.locator('input[value="hand-tools"]').check();
  await page.waitForTimeout(1500); // Aguarda animação de filtro

  // 3. Desmarcamos o filtro (Tentamos restaurar a tela ao estado original)
  await page.locator('input[value="hand-tools"]').uncheck();
  await page.waitForTimeout(1500);

  // 4. Contamos os produtos novamente
  const totalFinal = await gridProdutos.count();

  // Asserção: Se nós desmarcamos o filtro, o número de produtos deve ser exatamente igual ao inicial.
  // O Playwright capturará a falha provando que o Angular não está limpando os estados (State Mutation Bug).
  expect(totalFinal).toEqual(totalInicial);
});
