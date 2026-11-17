# Playwright E2E — Practice Software Testing

Projeto de prática de testes end-to-end (E2E) com [Playwright](https://playwright.dev/), cobrindo funcionalidades do site de demonstração [Practice Software Testing](https://practicesoftwaretesting.com/): busca dinâmica, filtros por categoria, ordenação por preço e slider de faixa de preço.

## Tecnologias

- [Playwright Test](https://playwright.dev/docs/intro) `^1.65.1`
- [Node.js](https://nodejs.org/) (LTS recomendado)
- TypeScript

## Pré-requisitos

- [Node.js](https://nodejs.org/) na versão LTS
- npm (instalado junto com o Node.js)

## Instalação

```bash
# Instala as dependências do projeto
npm install

# Instala os navegadores utilizados pelo Playwright
npx playwright install
```

## Executando os testes

```bash
# Executa todos os testes (Chromium, Firefox e WebKit)
npx playwright test

# Executa os testes em um navegador específico
npx playwright test --project=chromium

# Executa os testes com a interface gráfica do Playwright
npx playwright test --ui

# Abre o último relatório HTML gerado
npx playwright show-report
```

## Estrutura do projeto

```text
playwright-e2e-practice-software-testing/
├── .github/
│   └── workflows/
│       └── playwright.yml      # Pipeline de CI (GitHub Actions)
├── tests/
│   └── elementos - Busca dinâmica, filtros, ordenação e slider de preço/
│       ├── TC01.spec.ts        # Busca dinâmica de produtos
│       ├── TC02.spec.ts        # Filtro por categoria (checkboxes)
│       ├── TC03.spec.ts        # Ordenação por preço (sorting)
│       └── TC04.spec.ts        # Filtro por slider de preço
├── playwright.config.ts        # Configuração do Playwright
└── package.json
```

## Casos de teste

| Teste | Descrição |
| --- | --- |
| TC01 | Busca por uma ferramenta específica ("Pliers") e validação dos resultados retornados. |
| TC02 | Filtro de produtos pela categoria "Hand Tools" via checkbox. |
| TC03 | Ordenação dos produtos do maior para o menor preço. |
| TC04 | Ajuste do slider de preço máximo e validação de que os produtos cabem no orçamento. |

## Integração contínua (CI)

O workflow em [.github/workflows/playwright.yml](.github/workflows/playwright.yml) executa automaticamente os testes em pushes e pull requests para as branches `main`/`master`. A pipeline:

1. Faz o checkout do código;
2. Configura o Node.js (LTS);
3. Instala as dependências (`npm ci`);
4. Instala os navegadores do Playwright;
5. Executa os testes (`npx playwright test`);
6. Publica o relatório HTML como artefato.

## Referências

- [Documentação do Playwright](https://playwright.dev/docs/intro)
- [Site de prática](https://practicesoftwaretesting.com/)