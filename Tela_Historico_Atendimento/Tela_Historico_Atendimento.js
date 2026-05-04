let lista = [];

// 🚀 CARREGAR DADOS
window.onload = async function () {
    try {
        const resposta = await fetch("http://localhost:3000/visitantes");
        lista = await resposta.json();

        renderizar(lista);

    } catch (erro) {
        alert("Erro ao carregar histórico");
    }
};

//📊 MOSTRAR TABELA
function renderizar(dados) {
    const tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    dados.forEach(d => {
        tabela.innerHTML += `
            <tr>
                <td>${d.nome}</td>
                <td>${formatarCPF(d.cpf)}</td>
                <td>${d.contato}</td>
                <td>${d.regiao}</td>
                <td>${d.departamento}</td>
                <td>${d.assunto}</td>
                <td>${formatarData(d.atendimento)}</td>
            </tr>
        `;
    });
}
// 🔍 FILTRO
function filtrar() {
    const termo = document.getElementById("buscar").value.toLowerCase();

    const filtrados = lista.filter(d =>
        d.nome.toLowerCase().includes(termo) ||
        d.cpf.includes(termo) ||
        d.assunto.toLowerCase().includes(termo)
    );

    renderizar(filtrados);
}

// 🧠 FORMATAR CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// FORMATAR DATA
function formatarData(data) {
    if (!data) return "";

    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
}

// VOLTAR
function voltar() {
    window.location.href = "../Tela_Menu/Tela_Menu.html";
}