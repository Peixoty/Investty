chrome.runtime.onInstalled.addListener(() => {
  console.log("Monitor de Ativos instalado.");
  
  // Definir um alarme para verificar os alertas a cada 2 minutos (120 segundos)
  chrome.alarms.create("verificarAlertas", {
    periodInMinutes: 2 // Periodicidade do alarme (2 minutos)
  });
});

// Função para enviar notificações
function sendNotification(title, message) {
  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: "../icons/icon128x128.png",
      title: title,
      message: message,
      priority: 2
    });
}

// Função para buscar o preço do ativo
function getPrecoAtivo(ticker, itemText, callback) {
  const url = `https://stock-scraper-api.vercel.app/${ticker}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.price) {
        if (itemText) {
          itemText.textContent = `${ticker}: ${data.price}`;
        }
        if (callback) {
          callback(data);
        }
      } else if (itemText) {
        itemText.textContent = `${ticker} - Preço não encontrado`;
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar o preço:", error);
      if (itemText) {
        itemText.textContent = `${ticker} - Erro ao carregar preço`;
      }
    });
}

let isFetching = false; // Variável para evitar múltiplas chamadas

function getInfoAtivos(tickers, callback) {

  if (isFetching) {
    console.log("Já estamos buscando os ativos. Ignorando chamada.");
    return;
  }

  const url = `https://stock-scraper-api.vercel.app/tickers?ativos=${tickers.join(",")}`;

  // Moedas das bolsas do mundo
  const moedas = ["R$", "$", "€", "£"];

  isFetching = true; // Bloqueia novas chamadas

  // Faz a requisição à API para buscar o preço
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const infoAtivos = [];

      data.forEach((ativo) => {
        if (ativo.price && ativo.close) {
          let precoAtual = ativo.price;
          let precoFechamento = ativo.close;

          // Remove os símbolos de moeda dinamicamente
          moedas.forEach((moeda) => {
            precoAtual = precoAtual.replace(moeda, "");
            precoFechamento = precoFechamento.replace(moeda, "");
          });

          const precoAtualNumerico = parseFloat(precoAtual.replace(",", "."));
          const precoFechamentoNumerico = parseFloat(precoFechamento.replace(",", "."));

          const variacaoDia = ((precoAtualNumerico / precoFechamentoNumerico) - 1) * 100;

          // Formata a variação com sinal e 2 casas decimais
          const variacaoTexto =
            variacaoDia >= 0 ? `+${variacaoDia.toFixed(2)}%` : `${variacaoDia.toFixed(2)}%`;

          // Adiciona as informações ao array
          infoAtivos.push({
            ticker: ativo.ticker,
            name: ativo.name,
            symbolPrice: ativo.price,
            price: precoAtual,
            close: precoFechamento,
            variacao: variacaoTexto,
            variacaoClasse: variacaoDia >= 0 ? "positivo" : "negativo",
          });
        }
      });

      if (callback) {
        callback(infoAtivos);  // Passa o array infoAtivos para o callback
      }

    })
    .catch((error) => {
      console.error("Erro ao buscar informações dos ativos:", error);
    })
    .finally(() => {
      isFetching = false; // Libera novas chamadas após a conclusão
    });
}

// Função para verificar os alertas
function checkAlertas() {
  chrome.storage.local.get(["alertas"], (data) => {
    const alertas = data.alertas || [];

    const tickers = alertas.map((alerta) => alerta.ticker)

    getInfoAtivos(tickers, (ativos) => {
      ativos.forEach((ativo, index) => {
        if (ativo.price <= alertas[index].minPrice){
          sendNotification(
            `${ativo.name} - Preço baixo atingido!`,
            `${ativo.ticker} caiu para ${ativo.price} (Min: R$${alertas[index].minPrice})`
          );
        } else if (ativo.price >= alertas[index].maxPrice){
          sendNotification(
            `${ativo.name} - Preço alto atingido!`,
            `${ativo.ticker} subiu para ${ativo.price} (Max: R$${alertas[index].maxPrice})`
          );
        }
      })
    })
  });
}

// Ouvir o alarme e chamar a função para verificar alertas
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "verificarAlertas") {
    checkAlertas();
  }
});