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

// Ouvir as mensagens de outros scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "sendNotification") {
    sendNotification(message.title, message.message);
  }
});

