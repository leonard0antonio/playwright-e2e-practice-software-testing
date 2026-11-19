# Playwright E2E — Practice Software Testing

Projeto de prática de testes end-to-end (E2E) com [Playwright](https://playwright.dev/) para a aplicação [Practice Software Testing](https://practicesoftwaretesting.com/).

A suíte cobre catálogo, busca e filtros, carrinho, checkout, autenticação, criação de conta, interceptação de API e cenários de bugs conhecidos.

## Tecnologias

- [Playwright Test](https://playwright.dev/docs/intro) `^1.65.1`
- [Node.js](https://nodejs.org/) (LTS recomendado)
- TypeScript

## Pré-requisitos
- [Node.js](https://nodejs.org/) na versão LTS
- npm (instalado junto com o Node.js)

## Instalação

```bash
npm install
npx playwright install --with-deps
```

## Executando os testes

```bash
# Executa todos os testes (Chromium, Firefox e WebKit)
npx playwright test

# Executa apenas no Chromium
npx playwright test --project=chromium

# Executa um arquivo específico
npx playwright test "tests/Testing/elementos - PDP, quantidade, carrinho, validação de preço e toasts/TC06.spec.ts"

# Abre o modo interativo
npx playwright test --ui

# Abre o último relatório HTML gerado
npx playwright show-report
```

No Windows, os caminhos podem ser usados com barras normais ou barras invertidas.

## Estrutura do projeto

```text
playwright-e2e-practice-software-testing/
├── .github/workflows/
│   └── playwright.yml
├── tests/
│   ├── helpers.ts
│   ├── Bug/
│   │   ├── Bugs de autenticação e exposição indevida de dados/
│   │   ├── Captura de problemas lógicos e de negócio/
│   │   └── test.fail() e expect.soft() para gerenciamento de falhas e bugs/
│   └── Testing/
│       ├── elementos - Busca dinâmica, filtros, ordenação e slider de preço/
│       ├── elementos - PDP, quantidade, carrinho, validação de preço e toasts/
│       ├── elementos - Criação de conta, login e validações em tempo real/
│       └── elementos - Interceptação de API (Network Mocking)/
├── playwright.config.ts        # Configuração do Playwright
└── package.json
```

## Casos de teste

| Teste | Descrição |
| --- | --- |
| TC01-TC04 | Busca, filtros de categoria e preço, ordenação e slider. |
| TC05-TC07 | Página de detalhes, quantidade, carrinho, preços e remoção de itens. |
| TC08-TC10 | Cadastro, login e validações de formulário. |
| TC11-TC12 | Fluxo de checkout e interceptação/mocking de respostas da API. |
| BT01-BT03 | Uso de `test.fail()` e `expect.soft()` para bugs conhecidos. |
| BT04-BT06 | Problemas lógicos no carrinho e nos filtros. |
| BT07-BT08 | Problemas de autenticação e cadastro. |

Os testes BT representam cenários conhecidos e podem depender do comportamento da aplicação hospedada em `https://with-bugs.practicesoftwaretesting.com/`.

O arquivo [tests/helpers.ts](tests/helpers.ts) contém o helper `openFirstInStockProduct`, utilizado para encontrar e abrir um produto disponível antes das ações de carrinho.

## Configuração

A configuração principal está em [playwright.config.ts](playwright.config.ts):

- três projetos: Chromium, Firefox e WebKit;
- execução sequencial, com um worker;
- timeout padrão de 60 segundos;
- timeout de asserções de 15 segundos;
- timeout de ações de 20 segundos;
- trace gerado na primeira repetição;
- retries ativos apenas em ambiente de CI.

Os testes dependem de uma aplicação externa. Falhas de DNS, indisponibilidade da API ou alteração nos dados podem afetar as execuções.

## Integração contínua (CI)

O workflow em [.github/workflows/playwright.yml](.github/workflows/playwright.yml) executa automaticamente os testes em pushes e pull requests para as branches `main`/`master`. A pipeline:

1. Faz o checkout do código;
2. Configura o Node.js (LTS);
3. Instala as dependências (`npm ci`);
4. Instala os navegadores e suas dependências do sistema;
5. Executa os testes (`npx playwright test`);
6. Publica o relatório HTML como artefato.

## Resultados e depuração

Os resultados são armazenados em `test-results/` e o relatório HTML em `playwright-report/`.

Para investigar uma falha:

```bash
npx playwright test --project=chromium --grep "nome do teste"
npx playwright test --debug
npx playwright show-report
```

## Referências

- [Documentação do Playwright](https://playwright.dev/docs/intro)
- [Site de prática](https://practicesoftwaretesting.com/)