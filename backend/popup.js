document.getElementById("addButton").addEventListener("click", () => {
  const ticker = document.getElementById("ticker").value;
  if (ticker) {
    // Adiciona o ativo à lista no armazenamento
    chrome.storage.local.get("ativos", (data) => {
      const ativos = data.ativos || [];
      ativos.push(ticker);
      chrome.storage.local.set({ ativos });
      loadAtivos();
    });
    document.getElementById("ticker").value = "";
  }
});

document.getElementById("addAlertButton").addEventListener("click", () => {
  const ticker = document.getElementById("alertaTicker").value;
  const minPrice = parseFloat(document.getElementById("minPrice").value);
  const maxPrice = parseFloat(document.getElementById("maxPrice").value);

  if (ticker && !isNaN(minPrice) && !isNaN(maxPrice)) {
    // Adiciona o alerta ao armazenamento
    chrome.storage.local.get("alertas", (data) => {
      const alertas = data.alertas || [];
      alertas.push({ ticker, minPrice, maxPrice });
      chrome.storage.local.set({ alertas });
      loadAlertas();
    });

    // Limpa os campos após adicionar o alerta
    document.getElementById("alertaTicker").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
  }
});

// Lógica para alternar entre as abas
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove a classe 'active' de todas as abas
    tabButtons.forEach(btn => btn.classList.remove("active"));
    tabContents.forEach(content => content.classList.remove("active"));

    // Adiciona a classe 'active' à aba clicada
    button.classList.add("active");

    // Adiciona a classe 'active' à seção correspondente
    const targetSection = document.getElementById("section-" + button.id.split('-')[1]);
    targetSection.classList.add("active");
  });
});

// Função para carregar os alertas armazenados
function loadAlertas() {
  chrome.storage.local.get("alertas", (data) => {
    const alertas = data.alertas || [];
    const alertasList = document.getElementById("alertasList");
    alertasList.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

    alertas.forEach((alerta, index) => {
      const listItem = document.createElement("li");

      // Criando o conteúdo do item
      listItem.textContent = `${alerta.ticker}: Min: ${alerta.minPrice}, Max: ${alerta.maxPrice}`;

      // Criando o botão de remover
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remover";
      removeButton.classList.add("remove-button"); // Estilo para o botão
      removeButton.addEventListener("click", () => {
        removeAlerta(index);
      });

      // Adicionando o botão ao item da lista
      listItem.appendChild(removeButton);

      // Adiciona o item à lista
      alertasList.appendChild(listItem);
    });
  });
}

function removeAlerta(index) {
  chrome.storage.local.get("alertas", (data) => {
    let alertas = data.alertas || [];
    // Remove o alerta do array
    alertas.splice(index, 1);
    chrome.storage.local.set({ alertas }, () => {
      loadAlertas(); // Recarrega a lista após a remoção
    });
  });
}

// Função para verificar preços e enviar notificações
function checkAlertas() {
  chrome.storage.local.get(["alertas", "ativos"], (data) => {
    const alertas = data.alertas || [];
    const ativos = data.ativos || [];

    alertas.forEach((alerta) => {
      if (ativos.includes(alerta.ticker)) {
        // Verifica o preço do ativo
        getPrecoAtivo(alerta.ticker, null, (price) => {
          if (price <= alerta.minPrice) {
            sendNotification(
              `Preço baixo atingido!`,
              `${alerta.ticker} caiu para ${price} (Min: ${alerta.minPrice})`
            );
          } else if (price >= alerta.maxPrice) {
            sendNotification(
              `Preço alto atingido!`,
              `${alerta.ticker} subiu para ${price} (Max: ${alerta.maxPrice})`
            );
          }
        });
      }
    });
  });
  loadAtivos()
}

// Função para enviar notificações
function sendNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "../public/icon.png",
    title: title,
    message: message,
  });
}

// Função para buscar o preço do ativo
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

// Função para carregar os ativos armazenados
function loadAtivos() {
  chrome.storage.local.get("ativos", (data) => {
    const ativos = data.ativos || [];
    const list = document.getElementById("ativosList");
    list.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

    ativos.forEach((ativo, index) => {
      const listItem = document.createElement("li");

      // Criando o conteúdo do item
      const itemText = document.createElement("span");
      itemText.textContent = `${ativo} - Carregando preço...`;
      listItem.appendChild(itemText);

      // Criando o botão de remover
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remover";
      removeButton.classList.add("remove-button"); // Estilo para o botão
      removeButton.addEventListener("click", () => {
        removeAtivo(index);
      });

      // Adicionando o botão ao item da lista
      listItem.appendChild(removeButton);

      // Adiciona o item à lista
      list.appendChild(listItem);

      // Chama a função para buscar o preço e atualizar apenas o texto relacionado ao preço
      getPrecoAtivo(ativo, itemText);
    });
  });
}

function removeAtivo(index) {
  chrome.storage.local.get("ativos", (data) => {
    let ativos = data.ativos || [];
    // Remove o ativo do array
    ativos.splice(index, 1);
    chrome.storage.local.set({ ativos }, () => {
      loadAtivos(); // Recarrega a lista após a remoção
    });
  });
}

// Carrega os ativos e alertas ao abrir o popup
loadAtivos();
loadAlertas();

// Verifica alertas a cada 5 minutos
setInterval(checkAlertas, 10 * 1000);
