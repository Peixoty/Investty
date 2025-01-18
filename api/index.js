// Importação dos módulos
// Import do express: ele roda o app
const express = require("express")
const app = express()
const PORT = 3000

// Import do axios: Realiza requisições HTTP
const axios = require("axios")

// Import do cheerio: Manipula o HTML
const cheerio = require("cheerio")

// Importando o pacote CORS
const cors = require('cors')

//--------------------------------------------------------
//Middleware Global

// Habilitando o CORS para todas as origens
app.use(cors())

// Para JSON
app.use(express.json()); 

// Para query strings
app.use(express.urlencoded({ extended: true }));
//--------------------------------------------------------

app.get("/tickers", async (req, res) => {
    const { ativos } = req.query; // Ex: ativos=BEEF3,VALE3,RAIZ4

    if (!ativos) {
        return res.status(400).json({ error: "Nenhum ativo foi fornecido." });
    }

    const tickers = ativos.split(","); // Divide os ativos em uma lista
    const results = [];

    for (const ticker of tickers) {
        let formattedTicker = ticker.includes(":") ? ticker : `${ticker}:BVMF`;
        const url = `https://www.google.com/finance/quote/${formattedTicker}`;

        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            const stockName = $(".zzDege").text();
            const stockPrice = $(".YMlKec.fxKbKc").first().text();
            const stockClose = $(".P6K39c").first().text();

            if (stockName && stockPrice) {
                results.push({
                    ticker: formattedTicker,
                    name: stockName,
                    price: stockPrice,
                    close: stockClose,
                });
            } else {
                results.push({
                    ticker: formattedTicker,
                    error: "Dados não encontrados",
                });
            }
        } catch (error) {
            console.error(`Erro ao buscar dados para o ativo ${formattedTicker}:`, error.message);
            results.push({
                ticker: formattedTicker,
                error: "Erro ao buscar dados",
            });
        }
    }

    res.json(results); // Retorna a lista de resultados
});

app.get("/:ticker", async (req, res) => {
    let { ticker } = req.params

    // Verifica se o ticker não contém ":" (indicando que é um ticker da BVMF)
    if(!ticker.includes(":")){
        ticker = `${ticker}:BVMF`;
    }

    const url = `https://www.google.com/finance/quote/${ticker}`

    try {
        const { data } = await axios.get(url)
        const $ = cheerio.load(data)

        const stockName = $('.zzDege').text() // Nome da ação
        const stockPrice = $('.YMlKec.fxKbKc').first().text() // Preço atual
        const stockClose = $('.P6K39c').first().text(); // Valor de fechamento

        if (!stockName || !stockPrice) return res.status(404).json({ error: "Ativo não encontrado" })

        res.json({
            ticker: ticker,
            name: stockName,
            price: stockPrice,
            close: stockClose
        })
    } catch (error) {
        console.error("Erro ao buscar dados de ativo: ", error.message)
        res.status(500).json({ error: "Falhou ao buscar dados de ativo" })
    }
})



app.listen(PORT, () => console.log(`http://localhost:${PORT}`))