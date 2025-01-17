/*Eventos adicionados*/

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

document.getElementById("voltarButtonSeta").addEventListener("click", () => {
  // Alterna de volta para a lista de ativos
  document.getElementById("section-noticias").classList.remove("active");
  document.getElementById("section-lista").classList.add("active");
});

document.getElementById("voltarButton").addEventListener("click", () => {
  // Alterna de volta para a lista de ativos
  document.getElementById("section-noticias").classList.remove("active");
  document.getElementById("section-lista").classList.add("active");
});
//---------------------------------------------------------------------------------
/*Função que carrega os preços */
// Função para buscar o preço do ativo
function getPrecoAtivo(ticker, itemText, callback) {
  const url = `https://stock-scraper-api.vercel.app/${ticker}`;

  // Moedas das bolsas do mundo
  const moedas = ["R$", "$", "€", "£"];

  // Faz a requisição à API para buscar o preço
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.price && data.close) {
        if (itemText) {
          let precoAtual = data.price;
          let precoFechamento = data.close;

          // Remove os símbolos de moeda dinamicamente
          moedas.forEach(moeda => {
            precoAtual = precoAtual.replace(moeda, "");
            precoFechamento = precoFechamento.replace(moeda, "");
          });

          const precoAtualNumerico = parseFloat(precoAtual.replace(",", "."));
          const precoFechamentoNumerico = parseFloat(precoFechamento.replace(",", "."));

          const variacaoDia = ((precoAtualNumerico/precoFechamentoNumerico)-1)*100;

          // Formata a variação com sinal e 2 casas decimais
          const variacaoTexto = variacaoDia >= 0 
          ? `+${variacaoDia.toFixed(2)}%` 
          : `${variacaoDia.toFixed(2)}%`;

          // Define a classe com base na variação
          const variacaoClasse = variacaoDia >= 0 ? "positivo" : "negativo";

          itemText.innerHTML = `${ticker.split(":")[0]}: ${data.price} <span class="${variacaoClasse}">(${variacaoTexto})</span>`;
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
//---------------------------------------------------------------------------------
/*Abas*/
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
//---------------------------------------------------------------------------------
/*Área dos alertas */
// Função para carregar os alertas armazenados
function loadAlertas() {
  chrome.storage.local.get("alertas", (data) => {
    const alertas = data.alertas || [];
    const alertasList = document.getElementById("alertasList");
    alertasList.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

    alertas.forEach((alerta, index) => {
      const listItem = document.createElement("li");

      // Criando o conteúdo do item (somente com o texto do alerta, sem o botão)
      const alertaText = document.createElement("span");
      alertaText.textContent = `${alerta.ticker.split(":")[0]}: Min: ${alerta.minPrice}, Max: ${alerta.maxPrice}, Atual: Carregando...`;

      // Adiciona o texto do alerta à lista
      listItem.appendChild(alertaText);

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

      // Agora chama a função getPrecoAtivo passando o alertaText, onde o preço será atualizado
      getPrecoAtivo(alerta.ticker, alertaText, (precoAtual) => {
        // Atualiza o texto do alerta com o preço atual
        alertaText.textContent = `${alerta.ticker.split(":")[0]}: Min: ${alerta.minPrice}, Max: ${alerta.maxPrice}, Atual: ${precoAtual}`;
      });
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
//---------------------------------------------------------------------------------
/*Área da lista de ativos*/
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
      itemText.textContent = `${ativo.split(":")[0]} - Carregando preço...`;
      listItem.appendChild(itemText);

      const info = document.createElement("button")
      info.classList.add("info-button");
      info.innerHTML = '<i class="fas fa-circle-info"></i>';
      info.addEventListener("click", () => {
        showNoticiasSection(ativo)
      })
      
      listItem.appendChild(info)

      // Criando o botão de remover
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remover";
      removeButton.classList.add("remove-button"); // Estilo para o botão
      removeButton.addEventListener("click", (event) => {
        event.stopPropagation();
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
//---------------------------------------------------------------------------------
/*Área das notícias */
function showNoticiasSection(ticker) {
  // Atualiza o texto com o ticker selecionado
  document.getElementById("noticiasTicker").textContent = `Notícias relacionadas ao ativo: ${ticker.split(":")[0]}`;
  
  // Limpa a lista de notícias antes de carregar novas
  const noticiasList = document.getElementById("noticiasList");
  noticiasList.innerHTML = "";

  const newsUrl = `https://news.google.com/rss/search?q=${ticker.split(":")[0]}`
  const numeroNoticias = 25 // Número de notícias que serão carregadas

  // Faz a busca de notícias (usei a API do Google Notícias)
  fetch(newsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ao buscar notícias: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      const parser = new DOMParser();
      const rss = parser.parseFromString(data, "application/xml");
      const items = rss.querySelectorAll("item");

      // Array para armazenar as notícias com suas datas
      const noticiasArray = [];

      // Limita a iteração aos primeiros 15 itens
      Array.from(items).slice(0, numeroNoticias).forEach((item) => {
        const title = item.querySelector("title").textContent;
        const pubDate = item.querySelector("pubDate").textContent;
        const link = item.querySelector("link").textContent;

        // Formatar a data (usando uma biblioteca de data ou JavaScript puro)
        const date = new Date(pubDate);

        // Armazenar cada notícia e a data no array
        noticiasArray.push({ title, link, date });
      });
      
      // Ordenar as notícias pela data de publicação (mais recentes primeiro)
      noticiasArray.sort((a, b) => b.date - a.date);

      noticiasArray.forEach((noticia) => {
        const { title, link, date } = noticia;

        const formattedDate = date.toLocaleDateString("pt-BR", {
          year: '2-digit', month: '2-digit', day: '2-digit',
        });

        const listItem = document.createElement("li");
        const anchor = document.createElement("a");
        anchor.href = link;
        anchor.target = "_blank";
        anchor.textContent = title;

        // Adicionar a data formatada ao item da lista
        const dateElement = document.createElement("span");
        dateElement.classList.add("noticia-date");
        dateElement.textContent = formattedDate;

        listItem.appendChild(anchor);
        listItem.appendChild(dateElement);
        noticiasList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error(error);
      noticiasList.innerHTML = "<li>Erro ao carregar notícias.</li>";
    });

  // Alterna para a seção de notícias
  document.getElementById("section-lista").classList.remove("active");
  document.getElementById("section-noticias").classList.add("active");
}

//---------------------------------------------------------------------------------

// Carrega os ativos e alertas ao abrir o popup
loadAtivos();
loadAlertas();

// No popup, atualiza o preço dos ativos a cada 10 segundos
setInterval(loadAtivos, 10 * 1000)
setInterval(loadAlertas, 10 * 1000)

