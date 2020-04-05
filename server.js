const express = require('express')
const server = express()

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

const Pool = require('pg').Pool
const dataBase = new Pool({
    user: 'postgres',
    password: '5964',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

const nunjucks = require('nunjucks')

nunjucks.configure('./', {
    express: server,
    noCache: true
})

server.get('/', (req, res) => {
    dataBase.query('SELECT * FROM donors', (error, result) => {
        if(error) return res.send('Erro no banco de dados.')
        const donors = result.rows
        res.render('index.html', {donors}) 
    })
})

server.post('/', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == '' || email == '' || blood == '') 
        return res.send('Erro')

    const query = `INSERT INTO donors ("name", "email", "blood")
                   VALUES($1, $2, $3)`
    const values = [name, email, blood]

    dataBase.query(query, values, (error) => {
        if(error) return res.send('Ocorreu um erro')
        return res.redirect('/')
    })

})

server.listen(3000, () => console.log('Servidor iniciado'))