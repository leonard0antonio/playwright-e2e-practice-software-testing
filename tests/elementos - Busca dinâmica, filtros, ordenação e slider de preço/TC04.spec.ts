import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    // Aguarda o grid de produtos carregar completamente antes de interagir
    await page.waitForLoadState('networkidle');
  });

// =========================================================
  // TEST CASE 4: Filtro por Slider de Preço
  // =========================================================
  test('Deve mover o slider de preço e validar que produtos cabem no orçamento', async ({ page }) => {
    // Identificamos o "ponteiro" do valor máximo no slider
    const ponteiroMaximo = page.locator('.ngx-slider-pointer-max');
    
    // O slider desta aplicação requer interações do teclado para maior precisão, 
    // simulando a usabilidade acessível.
    await ponteiroMaximo.click();
    
    // Pressionamos a seta para a esquerda 10 vezes para reduzir o preço máximo
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('ArrowLeft');
    }

    await page.waitForTimeout(1000); // Aguarda o grid atualizar

    // Captura o preço do primeiro item retornado para validar se ele obedece ao filtro
    const precoTexto = await page.locator('[data-test="product-price"]').first().innerText();
    const preco = parseFloat(precoTexto.replace('$', ''));

    // Neste site, clicar 10x para a esquerda abaixa o preço máximo. 
    // Vamos garantir que o preço retornado não é exorbitante (ex: menor que $100)
    expect(preco).toBeLessThan(100);
  });