import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Agora apontamos para a URL com defeitos inseridos propositalmente
  await page.goto("https://with-bugs.practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// BUG 1: A Anotação test.fail() para Bugs Conhecidos (Ordenação)
// =========================================================
test("Deve falhar ao ordenar produtos por Preço (Alto-Baixo) - BUG CONHECIDO", async ({
  page,
}) => {
  // 1. Sinalizamos que este teste VAI falhar por causa de um bug do sistema
  test.fail(
    true,
    "Ticket Jira-123: A ordenação por preço está quebrada nesta versão",
  );

  const dropdownSort = page.locator('[data-test="sort"]');

  // Selecionamos a ordenação do Maior para o Menor preço
  await dropdownSort.selectOption("price,desc");
  await page.waitForTimeout(1000);

  // Capturamos os preços dos dois primeiros itens na tela
  const precoItem1Texto = await page
    .locator('[data-test="product-price"]')
    .nth(0)
    .innerText();
  const precoItem2Texto = await page
    .locator('[data-test="product-price"]')
    .nth(1)
    .innerText();

  const precoItem1 = parseFloat(precoItem1Texto.replace("$", ""));
  const precoItem2 = parseFloat(precoItem2Texto.replace("$", ""));

  // A asserção matemática: O primeiro deve ser mais caro ou igual ao segundo.
  // Como a versão "with-bugs" tem esse defeito, a matemática vai falhar.
  // Mas, graças ao test.fail() lá em cima, o Playwright vai marcar o teste com um ícone especial de "Falha Esperada" em vez de quebrar a esteira de CI/CD.
  expect(precoItem1).toBeGreaterThanOrEqual(precoItem2);
});
