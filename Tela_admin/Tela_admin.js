let listaUsuarios = [];

//  PROTEÇÃO
window.onload = async function () {

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario || usuario.perfil !== "admin") {
        alert("Acesso negado!");
        window.location.href = "../Tela_Menu/Tela_Menu.html";
        return;
    }

    carregarUsuarios();
};

// CARREGAR USUÁRIOS
async function carregarUsuarios() {
    const resposta = await fetch("http://localhost:3000/usuarios");
    listaUsuarios = await resposta.json();

    renderizarTabela(listaUsuarios);
}

//  RENDERIZAR TABELA
function renderizarTabela(usuarios) {
    const tabela = document.getElementById("tabelaUsuarios");
    tabela.innerHTML = "";

    usuarios.forEach(u => {
        tabela.innerHTML += `
            <tr>
                <td>${u.nome}</td>
                <td>${formatarCPF(u.cpf)}</td>
                <td>${u.contato}</td>
                <td>${u.departamento}</td>
                <td>${u.email}</td>
                <td>${u.perfil}</td>
                <td>
                    <button onclick="editar(${u.id})">✏️</button>
                    <button onclick="excluir(${u.id})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// FILTRO POR NOME
function filtrarUsuarios() {
    const termo = document.getElementById("buscar").value.toLowerCase();

    const filtrados = listaUsuarios.filter(u =>
        u.nome.toLowerCase().includes(termo)
    );

    renderizarTabela(filtrados);
}

// EXCLUIR
async function excluir(id) {

    if (!confirm("Deseja excluir este usuário?")) return;

    await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE"
    });

    alert("Usuário excluído!");
    carregarUsuarios();
}

//  EDITAR
function editar(id) {

    const usuario = listaUsuarios.find(u => u.id === id);

    const novoNome = prompt("Nome:", usuario.nome);
    if (!novoNome) return;

    const novodepartamento = prompt("departamento:", usuario.departamento);

    atualizarUsuario(id, {
        ...usuario,
        nome: novoNome,
        departamento: novodepartamento
    });
}

//  ATUALIZAR
async function atualizarUsuario(id, dados) {

    await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    alert("Usuário atualizado!");
    carregarUsuarios();
}

//  FORMATAR CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}