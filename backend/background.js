chrome.runtime.onInstalled.addListener(() => {
  console.log("Monitor de Ativos instalado.");
  
  // Definir um alarme para verificar os alertas a cada 2 minutos (120 segundos)
  chrome.alarms.create("verificarAlertas", {
    periodInMinutes: 0.1 // Periodicidade do alarme (2 minutos)
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
  const url = `http://localhost:3000/${ticker}`;

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

// Função para verificar os alertas
function checkAlertas() {
  chrome.storage.local.get(["alertas", "ativos"], (data) => {
    const alertas = data.alertas || [];

    alertas.forEach((alerta) => {
      getPrecoAtivo(alerta.ticker, null, ({ticker, name, price}) => {
        const precoNumerico = parseFloat(price.replace("R$", "").replace(",", "."));

        if (precoNumerico <= alerta.minPrice) {
          sendNotification(
            `${name} - Preço baixo atingido!`,
            `${ticker} caiu para ${price} (Min: R$${alerta.minPrice})`
          );
        } else if (precoNumerico >= alerta.maxPrice) {
          sendNotification(
            `${name} - Preço alto atingido!`,
            `${ticker} subiu para ${price} (Max: R$${alerta.maxPrice})`
          );
        }
      });
    });
  });
}

// Ouvir o alarme e chamar a função para verificar alertas
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "verificarAlertas") {
    checkAlertas();
  }
});