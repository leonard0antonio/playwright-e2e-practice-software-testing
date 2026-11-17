import { test, expect } from '@playwright/test';

  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    await page.waitForLoadState('networkidle');
  });

// =========================================================
  // TEST CASE 6: Botão de Adicionar ao Carrinho e Badge
  // =========================================================
  test('Deve alterar a quantidade e validar a notificação e o ícone do carrinho', async ({ page }) => {
    await page.locator('[data-test^="product-"]').first().click();

    // O botão de aumentar quantidade (+) usa um data-test próprio
    const btnAumentar = page.locator('[data-test="increase-quantity"]');
    const inputQuantidade = page.locator('[data-test="quantity"]');

    // Clicamos duas vezes para pedir 3 itens
    await btnAumentar.click();
    await btnAumentar.click();
    await expect(inputQuantidade).toHaveValue('3');

    // Clicamos em adicionar ao carrinho
    await page.locator('[data-test="add-to-cart"]').click();

    // O site exibe um Toast (notificação flutuante) de sucesso.
    // Como ele some em poucos segundos, o Playwright intercepta instantaneamente.
    const notificaçãoSucesso = page.locator('.toast-body');
    await expect(notificaçãoSucesso).toBeVisible();
    await expect(notificaçãoSucesso).toContainText('Product added to shopping cart');

    // Validamos se a "bolinha vermelha" (badge) no cabeçalho atualizou para 3
    const badgeCarrinho = page.locator('[data-test="cart-quantity"]');
    await expect(badgeCarrinho).toHaveText('3');
  });