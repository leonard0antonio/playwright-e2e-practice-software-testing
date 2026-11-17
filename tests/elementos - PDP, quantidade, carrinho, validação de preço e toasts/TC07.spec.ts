import { test, expect } from '@playwright/test';

  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    await page.waitForLoadState('networkidle');
  });

// =========================================================
  // TEST CASE 7: Validação Matemática no Carrinho
  // =========================================================
  test('Deve ir para o carrinho, validar a tabela de preços e remover o produto', async ({ page }) => {
    // 1. Adicionamos um produto previamente
    await page.locator('[data-test^="product-"]').first().click();
    
    // Capturamos o preço unitário na página de detalhes
    const precoUnitarioTexto = await page.locator('[data-test="product-price"]').innerText();
    const precoUnitario = parseFloat(precoUnitarioTexto.replace('$', ''));

    await page.locator('[data-test="add-to-cart"]').click();
    await page.waitForTimeout(1000); // Aguarda a notificação estabilizar

    // 2. Navegamos para a tela do Carrinho pelo cabeçalho
    await page.locator('[data-test="nav-cart"]').click();
    await expect(page).toHaveURL(/.*checkout/);

    // 3. Validamos a linha do produto na tabela
    const linhaProduto = page.locator('tbody tr').first();
    await expect(linhaProduto).toBeVisible();

    // Extraímos o preço Total (Total = Preço Unitário * Quantidade) listado na tabela
    const precoTotalTexto = await linhaProduto.locator('td').nth(4).innerText();
    const precoTotal = parseFloat(precoTotalTexto.replace('$', ''));

    // Validamos a regra de negócio básica: O total precisa fazer sentido matemático
    // (Como adicionamos 1 item, o total deve ser igual ao unitário)
    expect(precoTotal).toEqual(precoUnitario);

    // 4. Removemos o item clicando no ícone de lixeira (Delete)
    await linhaProduto.locator('button.btn-danger').click();

    // 5. Validamos se a tela exibe a mensagem de carrinho vazio
    // O Angular remove a tabela e exibe um texto dinamicamente
    await expect(page.locator('text=There are no items in your cart.')).toBeVisible();
  });