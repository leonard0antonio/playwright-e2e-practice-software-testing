import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Agora apontamos para a URL com defeitos inseridos propositalmente
  await page.goto("https://with-bugs.practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// BUG 1: Regressão da ordenação por preço
// =========================================================
test("Deve ordenar produtos por preço (Alto-Baixo)", async ({
  page,
}) => {
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
  expect(precoItem1).toBeGreaterThanOrEqual(precoItem2);
});
