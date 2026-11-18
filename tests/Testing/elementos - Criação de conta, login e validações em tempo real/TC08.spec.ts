import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// TEST CASE 8: Cadastro Completo de Novo Usuário
// =========================================================
test("Deve registrar um novo usuário com sucesso", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/#/auth/login");

  // Clica no link de registrar nova conta
  await page.locator('[data-test="register-link"]').click();

  // Validamos que estamos na tela de registro
  await expect(page).toHaveURL(/.*auth\/register/);
  await expect(page.locator("h3")).toHaveText("Customer registration");

  // Preenchemos os dados pessoais
  await page.locator('[data-test="first-name"]').fill("QA");
  await page.locator('[data-test="last-name"]').fill("Tester");

  // O campo de data (Date of Birth) pode ser preenchido digitando no formato AAAA-MM-DD
  await page.locator('[data-test="dob"]').fill("1990-05-15");

  await page.locator('[data-test="address"]').fill("Rua dos Bugs, 404");
  await page.locator('[data-test="postcode"]').fill("12345");
  await page.locator('[data-test="city"]').fill("Test City");
  await page.locator('[data-test="state"]').fill("Test State");
  await page.locator('[data-test="country"]').selectOption("US"); // Seleciona pelo valor
  await page.locator('[data-test="phone"]').fill("5551234567");

  // Geramos um e-mail dinâmico para não dar conflito de "usuário já existe"
  const emailAleatorio = `qa_pst_${Date.now()}@teste.com`;
  await page.locator('[data-test="email"]').fill(emailAleatorio);
  await page.locator('[data-test="password"]').fill("SenhaForte123!");

  // Clicamos em registrar
  await page.locator('[data-test="register-submit"]').click();

  // O Angular redireciona automaticamente para a tela de login em caso de sucesso
  await expect(page).toHaveURL(/.*auth\/login/);

  // Validamos se a tela de login realmente carregou após o redirecionamento
  await expect(page.locator("h3")).toHaveText("Login");
});
