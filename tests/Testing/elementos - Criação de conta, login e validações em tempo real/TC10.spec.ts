import { test, expect } from "@playwright/test";

// =========================================================
// TEST CASE 10: Login com Credenciais Válidas
// =========================================================
test("Deve realizar o login com sucesso e acessar o painel da conta", async ({
  page,
}) => {
  await page.goto("https://practicesoftwaretesting.com/auth/login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

  // Este e-mail e senha são oficiais de demonstração fornecidos pelos criadores do site
  await page
    .locator('[data-test="email"]')
    .fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.locator('[data-test="login-submit"]').click();

  // Aguardamos o redirecionamento para o painel da conta (My Account)
  await expect(page).toHaveURL(/.*account/);
  await expect(page.locator("h1")).toHaveText("My account");

  // Validamos se o menu do usuário exibe o nome logado
  const menuUsuario = page.locator('[data-test="nav-menu"]');
  await expect(menuUsuario).toBeVisible();
  await expect(menuUsuario).toContainText("Jane Doe"); // Nome padrão do usuário "customer"
});
