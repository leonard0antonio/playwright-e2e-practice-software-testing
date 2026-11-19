import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  // Agora apontamos para a URL com defeitos inseridos propositalmente
  await page.goto("https://with-bugs.practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");
});

// =========================================================
// BUG 7: Sessão Quebrada e Redirecionamento de Login
// =========================================================
test("Deve tentar acessar uma rota protegida sem login e ser bloqueado - BUG CONHECIDO", async ({
  page,
}) => {
  // Um dos defeitos clássicos de segurança: rotas que deveriam exigir login estão abertas
  test.fail(
    true,
    "Ticket Jira-126: Acesso não autorizado permitido na rota /checkout",
  );

  // 1. O usuário NÃO está logado. Nós tentamos acessar o checkout diretamente via URL.
  await page.goto("https://with-bugs.practicesoftwaretesting.com/#/checkout");
  await page.waitForLoadState("networkidle");

  // 2. Asserção de Segurança: O sistema DEVE interceptar e redirecionar para a tela de login.
  // Na versão com bugs, o sistema permite que um usuário anônimo caia no primeiro passo do checkout.
  await expect(page).toHaveURL(/.*auth\/login/);

  // 3. Verificamos se o erro "Não autorizado" aparece na tela
  const mensagemErro = page.locator(".alert-danger");
  await expect(mensagemErro).toBeVisible();
  await expect(mensagemErro).toContainText("Unauthorized");
});
