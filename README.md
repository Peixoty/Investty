# Investty - Monitor de Ativos

**Investty** é uma extensão para o Google Chrome que permite adicionar e monitorar os preços de ativos da bolsa de valores, como ações, diretamente no seu navegador. A extensão faz uso de uma API local que busca os dados de preços de ações na web e exibe os resultados de forma simples e prática.

---

## Funcionalidades

- **Adicionar ativos**: Insira o ticker do ativo que deseja monitorar.
- **Visualizar preços**: A extensão busca o preço de cada ativo em tempo real e exibe na lista.
- **Remover ativos**: Você pode remover ativos da sua lista a qualquer momento.
  
---

## Como usar

### 1. Baixe e instale a extensão

1. Abra o [Google Chrome](https://www.google.com/chrome/).
2. Acesse a página de extensões do Chrome digitando `chrome://extensions` na barra de endereços.
3. Ative o modo **Desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta do seu projeto onde a extensão foi criada.

### 2. Configure a API

**Atenção**: A extensão depende de uma API para buscar os preços dos ativos. Para fazer isso funcionar, você precisa rodar a API localmente. Siga os passos abaixo para configurá-la:

#### Passo 1: Clonar o repositório da API

Se você ainda não tem o repositório da API, baixe ou clone o projeto:

```bash
git clone <URL_DO_REPOSITORIO_DA_API>
```
#### Passo 2: Rodar a API localmente
No terminal da pasta, rode:
```bash
node api.js
```
Isso fará com que a API seja iniciada em http://localhost:3000/

### Passo 4: Configuração final
Agora que a API está rodando, a extensão poderá buscar os preços dos ativos corretamente.

## Exemplos de uso
1. Abra a extensão no Chrome.
2. Digite o ticker de uma ação (por exemplo, VALE3) no campo de entrada e clique em Adicionar.
3. O preço do ativo será mostrado ao lado do nome da ação.
4. Caso deseje remover o ativo da lista, basta clicar no botão de remoção ao lado do ativo.

## Estrutura do projeto
```bash
/Investty
|
|-/backend
| |- popup.js
| |- background.js
|
|-/public
| |-popup.html
| |-style.css
|
|-/api
  |-index.js
```

## Contribuindo
Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades! Se tiver alguma dúvida, não hesite em abrir uma issue ou enviar um pull request.

## Problemas Comuns
Erro ao rodar a API: Certifique-se de que você está executando o comando node api.js a partir da pasta correta e que as dependências (express, axios, cheerio) estão instaladas.

CORS: A API deve ser executada no mesmo domínio (localhost) que a extensão para evitar problemas com a política de CORS.

## Contato
- E-mail: maestrellipeixoto@gmail.com

Se precisar de ajuda ou tiver dúvidas, entre em contato!
