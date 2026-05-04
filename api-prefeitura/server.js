const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ==============================
   CONFIGURAÇÃO DO SQL SERVER
============================== */
const config = {
    user: "PREFEITURA",
    password: process.env.DB_PASSWORD || "Brendo27@",
    server: "localhost",
    database: "PREFEITURA",
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

/* ==============================
   CONEXÃO GLOBAL (1x só)
============================== */
sql.connect(config)
    .then(() => {
        console.log("✅ Conectado ao SQL Server!");
    })
    .catch(err => {
        console.error("❌ Erro na conexão:", err);
    });

/* ==============================
   ROTA TESTE
============================== */
app.get("/teste-banco", async (req, res) => {
    try {
        const result = await sql.query("SELECT 1 AS teste");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ROTA PARA CADASTRAR USUÁRIO
app.post("/usuarios", async (req, res) => {
    try {
        const { nome, cpf, contato, departamento, email, senha, perfil } = req.body;

        await sql.query`
            INSERT INTO dbo.CADASTROUSUARIO (nome, cpf, contato, departamento, email, senha, perfil)
            VALUES (${nome}, ${cpf}, ${contato}, ${departamento}, ${email}, ${senha}, ${perfil})
        `;

        res.send("Usuário cadastrado com sucesso!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao salvar usuário");
    }
});

// ROTA DE LOGIN
app.post("/login", async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        const result = await sql.query`
            SELECT * FROM dbo.CADASTROUSUARIO WHERE cpf = ${cpf} AND senha = ${senha}
        `;

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(401).send("CPF ou senha inválidos");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro no login");
    }
});

/* ==============================
   LISTAR USUÁRIOS
============================== */
app.get("/usuarios", async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT id, nome, cpf, contato, departamento, email, perfil 
            FROM dbo.CADASTROUSUARIO
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error("ERRO REAL:", err); 
        res.status(500).send("Erro ao buscar usuários");
    }
});

/* ==============================
   EXCLUIR USUÁRIO
============================== */
app.delete("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await sql.query`DELETE FROM dbo.CADASTROUSUARIO WHERE id = ${id}`;

        res.send("Usuário excluído com sucesso!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao excluir usuário");
    }
});

/* ==============================
   EDITAR USUÁRIO
============================== */
app.put("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cpf, contato, departamento, email, perfil } = req.body;

        await sql.query`
            UPDATE Usuarios SET
                nome = ${nome},
                cpf = ${cpf},
                contato = ${contato},
                departamento = ${departamento},
                email = ${email},
                perfil = ${perfil}
            WHERE id = ${id}
        `;

        res.send("Usuário atualizado com sucesso!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar usuário");
    }
});
// ROTA PARA CADASTRAR ATENDIMENTO
app.post("/visitantes", async (req, res) => {
    try {
        await sql.connect(config);

        const { nome, cpf, contato, regiao, nascimento, atendimento, assunto, departamento } = req.body;

        await sql.query`
            INSERT INTO dbo.ATENDIMENTOVISITANTES
            (nome, cpf, contato, regiao, nascimento, atendimento, assunto, departamento)
            VALUES
            (${nome}, ${cpf}, ${contato}, ${regiao}, ${nascimento}, ${atendimento}, ${assunto}, ${departamento})
        `;

        res.send("Atendimento salvo com sucesso!");

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao salvar atendimento");
    }
});
// ROTA PARA LISTAR ATENDIMENTOS
// ✅ ROTA PARA LISTAR ATENDIMENTOS (HISTÓRICO)
app.get("/visitantes", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT 
                id,
                nome,
                cpf,
                contato,
                regiao,
                assunto,
                departamento,
                atendimento
            FROM dbo.ATENDIMENTOVISITANTES
            ORDER BY atendimento DESC
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar histórico");
    }
});
// ROTA PARA EDITAR ATENDIMENTO
app.put("/visitantes/:id", async (req, res) => {
    try {
        await sql.connect(config);

        const { id } = req.params;
        const { nome, contato, regiao, assunto, departamento } = req.body;

        await sql.query`
            UPDATE VISITANTES SET
                nome = ${nome},
                contato = ${contato},
                regiao = ${regiao},
                assunto = ${assunto},
                departamento = ${departamento}
            WHERE id = ${id}
        `;

        res.send("Atendimento atualizado!");

    } catch (err) {
        res.status(500).send("Erro ao atualizar");
    }
});

// ROTA PARA EXCLUIR ATENDIMENTO
app.delete("/visitantes/:id", async (req, res) => {
    try {
        await sql.connect(config);

        const { id } = req.params;

        await sql.query`DELETE FROM VISITANTES WHERE id = ${id}`;

        res.send("Atendimento excluído!");

    } catch (err) {
        res.status(500).send("Erro ao excluir");
    }
});

/* ==============================
   SERVIDOR API
============================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 API rodando  com sucesso na porta ${PORT}`);
});