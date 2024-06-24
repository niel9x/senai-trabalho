const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'senai'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para autenticação de usuário
app.post('/submit-form', (req, res) => {
    const { email, senha } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro ao executar consulta SQL:', err);
            res.status(500).send('Erro interno ao tentar fazer login');
            return;
        }

        if (results.length > 0) {
            const user = results[0];
            if (user.isAdmin) {
                res.redirect('/administrador/index.html');
            } else {
                res.redirect('/usuario/index.html');
            }
        } else {
            res.status(401).send('Email ou senha incorretos');
        }
    });
});

// Rota para salvar ou atualizar notas
app.post('/saveGrade', (req, res) => {
    const { name, programming, networks, databases_grade } = req.body;

    const sql = 'INSERT INTO grades (name, programming, networks, banco) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE programming = VALUES(programming), networks = VALUES(networks), banco = VALUES(databases_grade)';
    db.query(sql, [name, programming, networks, databases_grade], (err, results) => {
        if (err) {
            console.error('Erro ao salvar as notas:', err);
            res.status(500).send('Erro ao salvar as notas');
            return;
        }
        res.send('Notas salvas com sucesso');
    });
});

// Rota para inserir novas notas
app.post('/insertGrade', (req, res) => {
    const { name, programming, networks, databases_grade } = req.body;

    const sql = 'INSERT INTO grades (name, programming, networks, banco) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, programming, networks, databases_grade], (err, results) => {
        if (err) {
            console.error('Erro ao inserir as notas:', err);
            res.status(500).send('Erro ao inserir as notas');
            return;
        }
        res.send('Notas inseridas com sucesso');
    });
});

app.get('/getGrades', (req, res) => {
    const sql = 'SELECT * FROM grades';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar as notas:', err);
            res.status(500).send('Erro ao buscar as notas');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});