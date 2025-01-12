chrome.runtime.onInstalled.addListener(() => {
    console.log("Monitor de Ativos instalado.");
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

function getPrecoAtivo(ticker, itemText, callback) {
  const url = `http://localhost:3000/${ticker}`;

  // Faz a requisição à API para buscar o preço
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
          callback(data.price);
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

// Função para verificar preços e enviar notificações
function checkAlertas() {
  chrome.storage.local.get(["alertas", "ativos"], (data) => {
    const alertas = data.alertas || [];

    alertas.forEach((alerta) => {
        // Verifica o preço do ativo
        getPrecoAtivo(alerta.ticker, null, (price) => {
          // Converte o preço para um número (remove "R$" e vírgula)
          const precoNumerico = parseFloat(price.replace("R$", "").replace(",", "."));

          if (precoNumerico <= alerta.minPrice) {
            sendNotification(
              `Preço baixo atingido!`,
              `${alerta.ticker} caiu para R$${price} (Min: R$${alerta.minPrice})`
            );
          } else if (precoNumerico >= alerta.maxPrice) {
            sendNotification(
              `Preço alto atingido!`,
              `${alerta.ticker} subiu para R$${price} (Max: R$${alerta.maxPrice})`
            );
          }
        });
    });
  });
}

// Verifica alertas a cada 2 minutos
setInterval(checkAlertas, 5 * 1000);

