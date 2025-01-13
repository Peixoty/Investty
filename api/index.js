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
//--------------------------------------------------------


app.get("/:ticker", async (req, res) => {
    const { ticker } = req.params
    const url = `https://www.google.com/finance/quote/${ticker}:BVMF`

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