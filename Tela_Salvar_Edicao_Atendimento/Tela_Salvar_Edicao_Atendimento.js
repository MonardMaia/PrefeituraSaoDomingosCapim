function formatarData(data) {
    if (!data) return "";

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}


// CARREGAR DADOS NA TELA DE CONFIRMAÇÃO
window.onload = function () {
    const dados = JSON.parse(localStorage.getItem("cadastro"));

    if (!dados) return;

    document.getElementById("nome").innerText = dados.nome;
    document.getElementById("cpf").innerText = dados.cpf;
    document.getElementById("contato").innerText = dados.contato;
    document.getElementById("regiao").innerText = dados.regiao;
    document.getElementById("nascimento").innerText = formatarData(dados.nascimento);
    document.getElementById("atendimento").innerText = formatarData(dados.atendimento);
    document.getElementById("assunto").innerText = dados.assunto;
    document.getElementById("departamento").innerText = dados.departamento;
};

function editar() {
    window.location.href = "../Tela_Atendimento_Visitantes/Tela_Atendimento_Visitantes.html";
}

async function salvar() {

    const dados = JSON.parse(localStorage.getItem("cadastro"));

    if (!dados) {
        alert("Nenhum dado encontrado!");
        return;
    }

    try {

        const resposta = await fetch("http://localhost:3000/visitantes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert("❌ Erro: " + erro);
            return;
        }

        const resultado = await resposta.text();

        alert("✅ " + resultado);

        // Limpa dados
        localStorage.removeItem("cadastro");

        // Redireciona
        window.location.href = "/Tela_Atendimento_Visitantes/Tela_Atendimento_Visitantes.html";

    } catch (error) {
        console.error(error);
        alert("❌ Erro ao conectar com o servidor!");
    }
}


