import { test, expect } from "@playwright/test";
import { openFirstInStockProduct } from "../../helpers";

// =========================================================
// TEST CASE 11: Checkout End-to-End (Jornada Completa)
// =========================================================
test("Deve realizar o fluxo completo de compra (Checkout) logado", async ({
  page,
}) => {
  // 1. Acesso à página inicial
  await page.goto("https://practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");

  // 2. Login Direto pelo cabeçalho
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await page
    .locator('[data-test="email"]')
    .fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page).toHaveURL(/.*account/, { timeout: 10_000 });

  // 3. Voltar para a Home e Adicionar Produto
  await page.getByRole("link", { name: "Home" }).click();
  await openFirstInStockProduct(page);
  await page.locator('[data-test="add-to-cart"]').click();

  // 4. Ir para o Carrinho e iniciar Checkout
  await page.goto("https://practicesoftwaretesting.com/checkout");
  await expect(page).toHaveURL(/.*checkout/);

  // Passo 1: Carrinho
  await page
    .getByRole("button", { name: /Proceed to checkout/i })
    .click();

  // Passo 2: Login (Já estamos logados, então só confirmamos)
  await page
    .getByRole("button", { name: /Proceed to checkout/i })
    .click();

  // Passo 3: Endereço de Entrega
  await page.getByLabel("Country").selectOption({ label: "United States of America (the)" });
  await page.locator('[data-test="postal_code"]').fill("01000");
  await page.locator('[data-test="house_number"]').fill("123");
  await page.locator('[data-test="street"]').fill("Rua Principal");
  await page.locator('[data-test="city"]').fill("São Paulo");
  await page.locator('[data-test="state"]').fill("SP");
  await page
    .getByRole("button", { name: /Proceed to checkout/i })
    .click();

  // Passo 4: Método de Pagamento
  await page
    .locator('[data-test="payment-method"]')
    .selectOption("cash-on-delivery"); // Pagamento na entrega
  await page.locator('[data-test="finish"]').click();

  // 5. Validação Final
  // A versão atual da aplicação permanece na etapa de pagamento após confirmar.
  await expect(page.getByRole("heading", { name: "Payment" })).toBeVisible();
  await expect(page.locator('[data-test="payment-method"]')).toBeVisible();
});
