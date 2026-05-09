let lista = [];
let selecionadoId = null;

// CARREGAR DADOS
window.onload = async function () {
    try {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

        const resposta = await fetch("http://192.168.1.108:3000/visitantes");
        let dados = await resposta.json();

        // 🔐 FILTRO POR DEPARTAMENTO
        if (usuario) {

            const depUsuario = (usuario.departamento || "").toLowerCase();
            const isTI = depUsuario === "ti";

            if (!isTI) {
                dados = dados.filter(d =>
                    (d.departamento || "").toLowerCase() === depUsuario
                );
            }
        }

        lista = dados;
        renderizar(lista);

    } catch (erro) {
        alert("Erro ao carregar histórico");
    }
};
// MOSTRAR TABELA
function renderizar(dados) {
    const tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado")) || {};

    dados.forEach(d => {

        const bloqueado = d.status === "Concluido" && usuario.perfil !== "admin";

        tabela.innerHTML += `
            <tr onclick="selecionar(${d.id}, this)" style="cursor:pointer">
                <td>${d.nome}</td>
                <td>${formatarCPF(d.cpf)}</td>
                <td>${d.contato}</td>
                <td>${d.regiao}</td>
                <td>${d.departamento}</td>
                <td>${d.assunto}</td>
                <td>${formatarData(d.atendimento)}</td>

                <td>
                    ${
                        bloqueado
                        ? `<span style="color: green; font-weight: bold;">${d.status}</span>`
                        : `
                        <select onchange="atualizarStatus(${d.id}, this.value)">
                            <option value="Iniciado" ${d.status == 'Iniciado' ? 'selected' : ''}>Iniciado</option>
                            <option value="Parado" ${d.status == 'Parado' ? 'selected' : ''}>Parado</option>
                            <option value="Concluido" ${d.status == 'Concluido' ? 'selected' : ''}>Concluido</option>
                        </select>
                        `
                    }
                </td>
            </tr>
        `;
    });
}
// SELECIONAR LINHA
function selecionar(id, linha) {
    selecionadoId = id;

    // remover destaque anterior
    document.querySelectorAll("tr").forEach(tr => {
        tr.style.background = "";
    });

    // destacar linha atual
    linha.style.background = "#cff3a4";
}

async function atualizarSelecionado() {

    if (!selecionadoId) {
        alert("Selecione um registro primeiro!");
        return;
    }

    try {
        const resposta = await fetch("http://192.168.1.108:3000/visitantes");
        lista = await resposta.json();

        renderizar(lista);

        alert("Dados atualizados!");

    } catch (erro) {
        alert("Erro ao atualizar");
    }
}

// ATUALIZAR STATUS
async function atualizarStatus(id, novoStatus) {
    try {
        const resposta = await fetch(`http://192.168.1.108:3000/visitantes/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: novoStatus })
        });

        const data = await resposta.json();

        if (!resposta.ok) {
            alert(data.erro || "Erro ao atualizar status");
            return;
        }

        console.log("Status atualizado com sucesso!");

    } catch (erro) {
        alert("Erro ao conectar com servidor");
    }
}

// FILTRAR (mantido + status incluso)
function filtrar() {
    const termo = document.getElementById("buscar").value.toLowerCase();

    const filtrados = lista.filter(d => {

        let dataFormatada = "";

        if (d.atendimento) {
            const partes = d.atendimento.split("T")[0].split("-");
            dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        return (
            d.nome.toLowerCase().includes(termo) ||
            d.cpf.includes(termo) ||
            d.assunto.toLowerCase().includes(termo) ||
            (d.status || "").toLowerCase().includes(termo) ||
            dataFormatada.includes(termo) ||
            d.atendimento.includes(termo)
        );
    });

    renderizar(filtrados);
}

// FORMATAR CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// FORMATAR DATA
function formatarData(data) {
    if (!data) return "";

    const partes = data.split("T")[0].split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// VOLTAR
function voltar() {
    window.location.href = "../Tela_Menu/Tela_Menu.html";
}