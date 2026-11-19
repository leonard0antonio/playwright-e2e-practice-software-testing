import { test, expect } from "@playwright/test";
import { openFirstInStockProduct } from "../../helpers";

test.beforeEach(async ({ page }) => {
  // Agora apontamos para a URL com defeitos inseridos propositalmente
  await page.goto("https://with-bugs.practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// BUG 4: Cálculo Matemático Quebrado no Carrinho
// =========================================================
test("Deve falhar ao calcular o total do carrinho ao aumentar a quantidade - BUG CONHECIDO", async ({
  page,
}) => {
  // Marcamos como bug conhecido: O desenvolvedor errou o cálculo (ex: concatenou texto em vez de somar)
  test.fail(
    true,
    "Ticket Jira-124: O total do carrinho está quebrado ao multiplicar itens",
  );

  // 1. Adicionamos o primeiro produto
  await openFirstInStockProduct(
    page,
    "https://with-bugs.practicesoftwaretesting.com/",
  );

  // Pegamos o preço unitário e convertemos para número
  const precoUnitarioTexto = await page
    .locator('[data-test="product-price"]')
    .innerText();
  const precoUnitario = parseFloat(precoUnitarioTexto.replace("$", ""));

  await page.locator('[data-test="add-to-cart"]').click();
  await page.waitForTimeout(1000); // Esperar Toast
  await page.locator('[data-test="nav-cart"]').click();

  // 2. Aumentamos a quantidade na tabela do carrinho
  // O site usa um botão de "+" para incrementar
  const btnAdicionarItem = page.locator("button i.fa-plus").first();
  await btnAdicionarItem.click();
  await page.waitForTimeout(1000); // Aguardar o Angular recalcular a tela

  // 3. Capturamos o Total geral (Total = Preço * 2)
  // Extraímos da última coluna da tabela
  const precoTotalTexto = await page
    .locator("tbody tr")
    .first()
    .locator("td")
    .nth(4)
    .innerText();
  const precoTotal = parseFloat(precoTotalTexto.replace("$", ""));

  // A asserção: O Total DEVE ser igual ao preço unitário multiplicado por 2.
  // Como a versão é bugada, o Playwright vai capturar o erro matemático.
  expect(precoTotal).toEqual(precoUnitario * 2);
});
