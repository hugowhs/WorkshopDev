// usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")
/*
//Coleção
const ideas = [
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
        title: "Curso de Programação",
        category: "Estudo",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem sit",
        url: "https://rocketseat.com.br"
    },
]
*/
/*const latinhas = [ //array (vetores) ideia de coleção
    {
    marca: "coca-cola"
    },
    {
    marca: "pepsi"
    }
]
*/

// configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true, // Boolean = true, false [noCache - Não  use Cache]
})

// criei uma rota /
// e capturo o pedido do cliente para responder
/*
server.get("/", function(req, res) {
    return res.sendFile(__dirname + "/index.html") // Envie o Index.html para localhost:3000
})

server.get("/ideias", function(req, res) {
    return res.sendFile(__dirname + "/ideias.html")
})
*/
server.get("/", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for (let idea of reversedIdeas) { // ele busca até acabar as ideias
            if(lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
    }

    return res.render("index.html", { ideas: lastIdeas })
    }) 

    
})

server.get("/ideias", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse()

        return res.render("ideias.html", { ideas: reversedIdeas})
    })
})

server.post("/", function(req, res) {
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?,?,?,?,?);
`

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

 
    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        return res.redirect("/ideias")
    })
})

// liguei meu servidor na porta 3000
server.listen(3000)
