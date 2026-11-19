import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Agora apontamos para a URL com defeitos inseridos propositalmente
  await page.goto("https://with-bugs.practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// BUG 8: Validação de Cadastro e Vazamento Visual (UI)
// =========================================================
test("Deve falhar ao cadastrar um usuário repetido e exibir mensagem correta - BUG CONHECIDO", async ({
  page,
}) => {
  // Marcamos o bug: Às vezes o site "engole" o erro 500 da API e não mostra nada para o usuário,
  // ou mostra uma mensagem técnica feia (ex: "SQL_ERROR_DUPLICATE_KEY") em vez de um texto amigável.
  test.fail(
    true,
    "Ticket Jira-127: O sistema trava sem exibir erro amigável ao registrar e-mail duplicado",
  );

  await page.goto(
    "https://with-bugs.practicesoftwaretesting.com/#/auth/register",
  );

  // Preenchemos com dados de um cliente que JÁ EXISTE no banco de dados deles
  await page.locator('[data-test="first-name"]').fill("Jane");
  await page.locator('[data-test="last-name"]').fill("Doe");
  await page.locator('[data-test="dob"]').fill("1990-01-01");
  await page.locator('[data-test="address"]').fill("Rua Central");
  await page.locator('[data-test="postcode"]').fill("12345");
  await page.locator('[data-test="city"]').fill("Test City");
  await page.locator('[data-test="state"]').fill("Test State");
  await page.locator('[data-test="country"]').selectOption("US");
  await page.locator('[data-test="phone"]').fill("5551234567");

  // Usamos o e-mail do usuário padrão de demonstração
  await page
    .locator('[data-test="email"]')
    .fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");

  await page.locator('[data-test="register-submit"]').click();

  // Asserção: O sistema NÃO PODE redirecionar para a tela de login.
  // Ele deve permanecer na tela de registro e mostrar uma notificação.
  await expect(page).toHaveURL(/.*auth\/register/);

  // O Playwright vai buscar a mensagem amigável de erro na tela.
  // Se o desenvolvedor deixou o erro de banco de dados vazar, a asserção vai capturar o bug.
  const alertaErro = page.locator('[data-test="register-error"]');
  await expect(alertaErro).toBeVisible();
  await expect(alertaErro).toContainText(
    "A user with this email address already exists",
  );
});
