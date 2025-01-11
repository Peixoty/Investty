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
      document.getElementById("ticker").value = ""
    }
  });
  
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
  
  // Função para buscar o preço do ativo
  function getPrecoAtivo(ticker, itemText) {
    const url = `http://localhost:3000/${ticker}`;
  
    // Faz a requisição à API para buscar o preço
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.price) {
          itemText.textContent = `${ticker}: ${data.price}`;
        } else {
          itemText.textContent = `${ticker} - Preço não encontrado`;
        }
      })
      .catch(error => {
        console.error('Erro ao buscar o preço:', error);
        itemText.textContent = `${ticker} - Erro ao carregar preço`;
      });
  }
  
  // Carrega os ativos ao abrir o popup
  loadAtivos();
  