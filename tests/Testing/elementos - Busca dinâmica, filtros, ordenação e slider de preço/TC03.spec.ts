import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  // Aguarda o grid de produtos carregar completamente antes de interagir
  await page.waitForLoadState("networkidle");
});

// =========================================================
// TEST CASE 3: Ordenação de Produtos (Sorting)
// =========================================================
test("Deve ordenar os produtos do maior para o menor preço", async ({
  page,
}) => {
  const dropdownSort = page.locator('[data-test="sort"]');

  // Seleciona a opção "Price (High - Low)"
  await dropdownSort.selectOption("price,desc");

  // Aguardamos a lista ser reordenada
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

  // Removemos o cifrão ($) e convertemos para número decimal
  const precoItem1 = parseFloat(precoItem1Texto.replace("$", ""));
  const precoItem2 = parseFloat(precoItem2Texto.replace("$", ""));

  // O preço do primeiro item deve ser maior ou igual ao do segundo
  expect(precoItem1).toBeGreaterThanOrEqual(precoItem2);
});
