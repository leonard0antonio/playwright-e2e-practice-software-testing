import { test, expect } from "@playwright/test";
import { openFirstInStockProduct } from "../../helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// BUG 3: Validação de Funcionalidade Fantasma no Carrinho
// =========================================================
test("Deve adicionar ao carrinho e verificar se a notificação aparece corretamente", async ({
  page,
}) => {
  // Na versão "with-bugs", clicar no carrinho às vezes não atualiza o contador (badge)
  // ou exibe o Toast de erro/sucesso de forma intermitente.

  // Clicamos no primeiro produto e mandamos adicionar
  await openFirstInStockProduct(page);
  await page.locator('[data-test="add-to-cart"]').click();

  // A versão atual pode não exibir mais o toast, mas atualiza o contador do carrinho.
  await expect(page.locator('[data-test="cart-quantity"]')).toHaveText("1");
});
