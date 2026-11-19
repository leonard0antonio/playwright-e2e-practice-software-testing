import { test, expect } from "@playwright/test";

// =========================================================
// TEST CASE 9: Login com Credenciais Inválidas (Validação)
// =========================================================
test("Deve exibir erro ao tentar logar com senha incorreta", async ({
  page,
}) => {
  await page.goto("https://practicesoftwaretesting.com/auth/login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

  await page
    .locator('[data-test="email"]')
    .fill("admin@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("senha_errada");
  await page.locator('[data-test="login-submit"]').click();

  // O site exibe um alerta vermelho customizado do Bootstrap informando o erro
  const mensagemErro = page.locator('[data-test="login-error"]');
  await expect(mensagemErro).toBeVisible();
  await expect(mensagemErro).toHaveText("Invalid email or password");
});
