const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));

// ==============================
// CONFIG SQL
// ==============================
const config = {
    user: "PREFEITURA",
    password: process.env.DB_PASS || "Brendo27@",
    server: "localhost",
    database: "PREFEITURA",
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// ==============================
// CONEXÃO
// ==============================
sql.connect(config)
    .then(() => console.log("✅ SQL Server conectado"))
    .catch(err => console.error("❌ Erro SQL:", err));

// ==============================
// TESTE
// ==============================
app.get("/teste-banco", async (req, res) => {
    const result = await sql.query("SELECT 1 AS teste");
    res.json(result.recordset);
});
//
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../Tela_Login/Tela_Login.html"));
});
// ==============================
// USUÁRIOS
// ==============================

// CREATE
app.post("/usuarios", async (req, res) => {
    try {
        const { nome, cpf, contato, departamento, email, senha, perfil } = req.body;

        // 🔍 verificar duplicidade
        const existe = await sql.query`
            SELECT * FROM dbo.CADASTROUSUARIO 
            WHERE cpf = ${cpf} OR email = ${email}
        `;

        if (existe.recordset.length > 0) {
            return res.status(400).json({
                erro: "Já existe um usuário com esse CPF ou Email!"
            });
        }

        await sql.query`
            INSERT INTO dbo.CADASTROUSUARIO 
            (nome, cpf, contato, departamento, email, senha, perfil)
            VALUES (${nome}, ${cpf}, ${contato}, ${departamento}, ${email}, ${senha}, ${perfil})
        `;

        res.json({ mensagem: "Usuário cadastrado com sucesso!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
});

// READ
app.get("/usuarios", async (req, res) => {
    const result = await sql.query(`
        SELECT id, nome, cpf, contato, departamento, email, perfil
        FROM dbo.CADASTROUSUARIO
    `);
    res.json(result.recordset);
});

// UPDATE
app.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, cpf, contato, departamento, email, perfil } = req.body;

    await sql.query`
        UPDATE dbo.CADASTROUSUARIO SET
            nome = ${nome},
            cpf = ${cpf},
            contato = ${contato},
            departamento = ${departamento},
            email = ${email},
            perfil = ${perfil}
        WHERE id = ${id}
    `;

    res.send("Usuário atualizado!");
});

// DELETE
app.delete("/usuarios/:id", async (req, res) => {
    const { id } = req.params;

    await sql.query`
        DELETE FROM dbo.CADASTROUSUARIO WHERE id = ${id}
    `;

    res.send("Usuário excluído!");
});

// ==============================
// LOGIN
// ==============================
app.post("/login", async (req, res) => {
    const { cpf, senha } = req.body;

    const result = await sql.query`
        SELECT * FROM dbo.CADASTROUSUARIO 
        WHERE cpf = ${cpf} AND senha = ${senha}
    `;

    if (result.recordset.length > 0) {
        res.json(result.recordset[0]);
    } else {
        res.status(401).json({ erro: "CPF ou senha inválidos" });
    }
});

// ==============================
// ATENDIMENTOS
// ==============================

// CREATE (AGORA EXISTE!)
app.post("/visitantes", async (req, res) => {
    try {
        let { nome, cpf, contato, regiao, nascimento, atendimento, assunto, departamento,status} = req.body;

        // 🔧 PADRONIZAÇÃO (evita erro de comparação)
        const cpfLimpo = cpf.replace(/\D/g, "");
        const departamentoLimpo = departamento.trim().toLowerCase();
        const dataFormatada = atendimento.split("T")[0]; // yyyy-mm-dd

        // 🔍 VALIDAÇÃO (CPF + DATA + DEPARTAMENTO)
        const existe = await sql.query`
            SELECT 1 FROM dbo.ATENDIMENTOVISITANTES
            WHERE REPLACE(cpf, '.', '') = ${cpfLimpo}
            AND LTRIM(RTRIM(LOWER(departamento))) = ${departamentoLimpo}
            AND CONVERT(date, atendimento) = ${dataFormatada}
        `;

        if (existe.recordset.length > 0) {
            return res.status(400).json({
                erro: "Já existe atendimento para esse CPF neste departamento nesta data!"
            });
        }

        // ✅ SALVAR
        await sql.query`
            INSERT INTO dbo.ATENDIMENTOVISITANTES
            (nome, cpf, contato, regiao, nascimento, atendimento, assunto, departamento, status)
            VALUES
            (${nome}, ${cpfLimpo}, ${contato}, ${regiao}, ${nascimento}, ${atendimento}, ${assunto}, ${departamentoLimpo}, ${status || "iniciado"})
        `;

        res.json({ mensagem: "Atendimento cadastrado com sucesso!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao salvar atendimento" });
    }
});

// READ
app.get("/visitantes", async (req, res) => {
    const result = await sql.query(`
        SELECT * FROM dbo.ATENDIMENTOVISITANTES
        ORDER BY atendimento DESC
    `);
    res.json(result.recordset);
});

// UPDATE
app.put("/visitantes/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, contato, regiao, assunto, departamento, status } = req.body;

    await sql.query`
        UPDATE dbo.ATENDIMENTOVISITANTES SET
            nome = ${nome},
            contato = ${contato},
            regiao = ${regiao},
            assunto = ${assunto},
            departamento = ${departamento}
        WHERE id = ${id}
    `;

    res.send("Atendimento atualizado!");
});

app.put("/visitantes/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, perfil } = req.body;

        // 🔎 BUSCAR STATUS ATUAL NO BANCO
        const result = await sql.query`
            SELECT status FROM dbo.ATENDIMENTOVISITANTES WHERE id = ${id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }

        const statusAtual = result.recordset[0].status;

        // 🔐 👉 COLOQUE AQUI
        if (statusAtual === "Concluido" && perfil !== "admin") {
            return res.status(403).json({
                erro: "Sem permissão para alterar atendimento concluído"
            });
        }

        // ✅ ATUALIZA NORMAL
        await sql.query`
            UPDATE dbo.ATENDIMENTOVISITANTES
            SET status = ${status}
            WHERE id = ${id}
        `;

        res.json({ mensagem: "Status atualizado!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao atualizar status" });
    }
});

// DELETE
app.delete("/visitantes/:id", async (req, res) => {
    const { id } = req.params;

    await sql.query`
        DELETE FROM dbo.ATENDIMENTOVISITANTES WHERE id = ${id}
    `;

    res.send("Atendimento excluído!");
});

// ==============================
// SERVIDOR
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 Servidor rodando na porta " + PORT);
});