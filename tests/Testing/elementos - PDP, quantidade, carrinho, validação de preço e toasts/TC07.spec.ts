import { test, expect } from "@playwright/test";
import { openFirstInStockProduct } from "../../helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// TEST CASE 7: Validação Matemática no Carrinho
// =========================================================
test("Deve ir para o carrinho, validar a tabela de preços e remover o produto", async ({
  page,
}) => {
  // 1. Adicionamos um produto previamente
  await openFirstInStockProduct(page);

  // Capturamos o preço unitário na página de detalhes
  const precoUnitarioTexto = await page
    .locator('[data-test="unit-price"]')
    .innerText();
  const precoUnitario = parseFloat(precoUnitarioTexto);

  await page.locator('[data-test="add-to-cart"]').click();
  await page.waitForTimeout(1000); // Aguarda a notificação estabilizar

  // 2. Navegamos para a tela do Carrinho pelo cabeçalho
  await page.locator('[data-test="nav-cart"]').click();
  await expect(page).toHaveURL(/.*checkout/);

  // 3. Validamos a linha do produto na tabela
  const linhaProduto = page.locator("tbody tr").first();
  await expect(linhaProduto).toBeVisible();

  // Extraímos o preço Total (Total = Preço Unitário * Quantidade) listado na tabela
  const precoTotalTexto = await linhaProduto
    .locator('[data-test="line-price"]')
    .innerText();
  const precoTotal = parseFloat(precoTotalTexto.replace("$", ""));

  // Validamos a regra de negócio básica: O total precisa fazer sentido matemático
  // (Como adicionamos 1 item, o total deve ser igual ao unitário)
  expect(precoTotal).toEqual(precoUnitario);

  // 4. Removemos o item clicando no ícone de lixeira (Delete)
  await linhaProduto.locator("a.btn-danger").click();

  // 5. Validamos se a tela exibe a mensagem de carrinho vazio
  // O Angular remove a tabela e exibe um texto dinamicamente
  await expect(
    page.getByText("The cart is empty. Nothing to display."),
  ).toBeVisible();
});
