import { test, expect } from "@playwright/test";

// =========================================================
// TEST CASE 12: Interceptação de API (Network Mocking)
// =========================================================
test("Deve interceptar a API de produtos e alterar os dados falsamente na tela", async ({
  page,
}) => {
  // 1. GRAMPO NA REDE (Interceptação)
  // Antes de navegar, avisamos o Playwright para vigiar a API do back-end (/api/products)
  await page.route("**://api.practicesoftwaretesting.com/products**", async (route) => {
    // Deixamos a requisição real ir até o servidor e pegamos a resposta oficial
    const respostaOriginal = await route.fetch();
    const dadosOriginais = await respostaOriginal.json();

    // ALTERAÇÃO DOS DADOS (Mock)
    // Substituímos o nome do primeiro produto pelo nosso próprio nome
    dadosOriginais.data[0].name = "Mjolnir - O Martelo do QA Sênior";
    // E colocamos o preço absurdo de $9999.99
    dadosOriginais.data[0].price = 9999.99;

    // Devolvemos os dados alterados para o navegador (Front-end)
    await route.fulfill({
      response: respostaOriginal,
      json: dadosOriginais, // O site vai receber nossa versão falsificada
    });
  });

  // 2. Navegação (Isso vai disparar a API que nós acabamos de grampear)
  await page.goto("https://practicesoftwaretesting.com/");
  await page.waitForLoadState("networkidle");

  // 3. Validação Visual
  // Verificamos se a tela montou o primeiro produto usando os nossos dados falsos em vez dos dados reais do banco
  const nomeProdutoMockado = page.locator('[data-test="product-name"]').first();
  const precoProdutoMockado = page
    .locator('[data-test="product-price"]')
    .first();

  await expect(nomeProdutoMockado).toHaveText(
    "Mjolnir - O Martelo do QA Sênior",
  );
  await expect(precoProdutoMockado).toHaveText("$9999.99");
});
