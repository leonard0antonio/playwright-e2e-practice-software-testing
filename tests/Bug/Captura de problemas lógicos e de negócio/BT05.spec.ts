import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Agora apontamos para a URL com defeitos inseridos propositalmente
  await page.goto("https://with-bugs.practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// BUG 5: Validação Fantasma em Formulários (Contact)
// =========================================================
test("Deve validar todas as mensagens de erro de campos obrigatórios no Contato", async ({
  page,
}) => {
  await page.locator('[data-test="nav-contact"]').click();
  await expect(page).toHaveURL(/.*contact/);

  // Clicamos em enviar sem preencher NADA
  await page.locator('[data-test="contact-submit"]').click();

  // Em uma versão com bugs, o desenvolvedor pode ter esquecido de validar o e-mail ou a mensagem.
  // Usamos expect.soft() para testar TODOS os campos e entregar um relatório completo de quais validações falharam.
  await expect
    .soft(page.locator('[data-test="first-name-error"]'))
    .toBeVisible();
  await expect
    .soft(page.locator('[data-test="last-name-error"]'))
    .toBeVisible();
  await expect.soft(page.locator('[data-test="email-error"]')).toBeVisible();
  await expect.soft(page.locator('[data-test="subject-error"]')).toBeVisible();
  await expect.soft(page.locator('[data-test="message-error"]')).toBeVisible();
});
