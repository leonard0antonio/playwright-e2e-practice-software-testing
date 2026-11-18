import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

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
  await page.locator('[data-test="nav-sign-in"]').click();
  await page
    .locator('[data-test="email"]')
    .fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page).toHaveURL(/.*account/);

  // 3. Voltar para a Home e Adicionar Produto
  await page.locator('[data-test="nav-home"]').click();
  await page.locator('[data-test^="product-"]').first().click();
  await page.locator('[data-test="add-to-cart"]').click();
  await expect(page.locator(".toast-body")).toBeVisible();

  // 4. Ir para o Carrinho e iniciar Checkout
  await page.locator('[data-test="nav-cart"]').click();
  await expect(page).toHaveURL(/.*checkout/);

  // Passo 1: Carrinho
  await page.locator('[data-test="proceed-1"]').click();

  // Passo 2: Login (Já estamos logados, então só confirmamos)
  await page.locator('[data-test="proceed-2"]').click();

  // Passo 3: Endereço de Entrega
  await page.locator('[data-test="address"]').fill("Rua Principal 123");
  await page.locator('[data-test="city"]').fill("São Paulo");
  await page.locator('[data-test="state"]').fill("SP");
  await page.locator('[data-test="country"]').fill("Brasil");
  await page.locator('[data-test="postcode"]').fill("01000-000");
  await page.locator('[data-test="proceed-3"]').click();

  // Passo 4: Método de Pagamento
  await page
    .locator('[data-test="payment-method"]')
    .selectOption("cash-on-delivery"); // Pagamento na entrega
  await page.locator('[data-test="finish"]').click();

  // 5. Validação Final de Sucesso
  // O site usa uma classe de alerta para informar o sucesso da compra
  const alertaSucesso = page.locator(".alert-success");
  await expect(alertaSucesso).toBeVisible();
  await expect(alertaSucesso).toContainText("Payment was successful");
});
