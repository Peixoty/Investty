# Investty - Monitor de Ativos

**Investty** é uma extensão para o Google Chrome que permite adicionar e monitorar os preços de ativos da bolsa de valores, como ações, diretamente no seu navegador. A extensão faz uso de uma API local que busca os dados de preços de ações na web e exibe os resultados de forma simples e prática.

---

## Funcionalidades

- **Adicionar ativos**: Insira o ticker do ativo que deseja monitorar.
- **Visualizar preços**: A extensão busca o preço de cada ativo em tempo real e exibe na lista.
- **Remover ativos**: Você pode remover ativos da sua lista a qualquer momento.
- **Alertas de preço**: A extensão agora verifica periodicamente os preços dos ativos e envia notificações sempre que um preço atinge o limite configurado (mínimo ou máximo). A verificação é feita a cada 2 minutos. (Você pode alterar esse tempo na linha 6 do arquivo background.js)
- **Notícias de Ativos**: A extensão busca e exibe as últimas notícias relacionadas aos ativos que você está monitorando.
  
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

#### Passo 1: Clone este repositório

Se você ainda não tem o repositório, baixe ou clone o projeto:

```bash
git clone https://github.com/Peixoty/Investty.git
```

Caso você não tenha o `git` instalado, baixe por aqui:

[Faça o download do projeto](https://github.com/Peixoty/Investty/archive/refs/heads/main.zip)

Após baixar o zip, extraia o projeto para uma pasta.

### Novidades
- Agora, a extensão tem uma funcionalidade adicional: alertas de preço. A cada 2 minutos, a extensão verifica o preço dos ativos cadastrados e envia notificações caso o preço de um ativo atinja os limites configurados (mínimo ou máximo). Essa funcionalidade é controlada pela API ```chrome.alarms```, que cria um alarme para a verificação periódica.

- Notícias de Ativos: A extensão também agora busca as últimas notícias relacionadas aos ativos monitorados. Essas notícias são exibidas na interface da extensão, ajudando a manter você informado sobre os desenvolvimentos mais recentes nos ativos que está acompanhando.

Como funciona:

- O alarme é disparado a cada 2 minutos.
- A extensão verifica o preço de cada ativo e, caso um preço atinja o limite definido para aquele ativo, uma notificação é enviada.
- As notícias são exibidas diretamente na interface da extensão, associadas aos ativos monitorados.

Isso permite que você fique sempre atualizado com as flutuações de preço e as notícias mais recentes dos seus ativos.


## Exemplos de uso
1. Abra a extensão no Chrome.
2. Digite o ticker de uma ação (por exemplo, VALE3) no campo de entrada e clique em Adicionar.
3. O preço do ativo será mostrado ao lado do nome da ação.
4. Caso deseje remover o ativo da lista, basta clicar no botão de remoção ao lado do ativo.
5. Você pode configurar alertas de preço para ser notificado quando o ativo atingir um valor mínimo ou máximo.
6. A cada 2 minutos, a extensão verifica os preços e envia as notificações automaticamente.


## Estrutura do projeto
```bash
/Investty
|
|-/backend
| |- popup.js
| |- background.js
|
|-/icons
| |- icon16x16.png
| |- icon128x128.png
|
|-/public
| |- popup.html
| |- style.css
|
```

## Contribuindo
Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades! Se tiver alguma dúvida, não hesite em abrir uma issue ou enviar um pull request.

## Contato
- E-mail: maestrellipeixoto@gmail.com

Se precisar de ajuda ou tiver dúvidas, entre em contato!

