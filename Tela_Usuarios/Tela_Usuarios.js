let lista = [];

// PROTEÇÃO
window.onload = async function () {

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario || usuario.perfil !== "admin") {
        alert("Acesso negado!");
        window.location.href = "../Tela_Menu/Tela_Menu.html";
        return;
    }

    carregarUsuarios();
};

// CARREGAR
async function carregarUsuarios() {
    const res = await fetch("http://localhost:3000/usuarios");
    lista = await res.json();
    renderizar(lista);
}

// RENDERIZAR
function renderizar(usuarios) {
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
                <td>${u.senha}</td>
                <td>${u.perfil}</td>
                <td>
                    <button onclick="editar(${u.id})">✏️</button>
                    <button onclick="excluir(${u.id})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

//  BUSCAR
function filtrar() {
    const termo = document.getElementById("buscar").value.toLowerCase();

    const filtrado = lista.filter(u =>
        u.nome.toLowerCase().includes(termo)
    );

    renderizar(filtrado);
}

// EXCLUIR
async function excluir(id) {
    if (!confirm("Deseja excluir?")) return;

    await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE"
    });

    alert("Excluído!");
    carregarUsuarios();
}

// EDITAR (simples)
function editar(id) {
    const u = lista.find(x => x.id === id);

    const nome = prompt("Nome:", u.nome);
    if (!nome) return;

    const cpf = prompt("CPF:", u.cpf);
    if (!cpf) return;

    const contato = prompt("Contato:", u.contato);
    if (!contato) return;

    const departamento = prompt("Departamento:", u.departamento);
    if (!departamento) return;

    const email = prompt("Email:", u.email);
    if (!email) return;

    const senha = prompt("Senha:", u.senha);
    if (!senha) return;

    const perfil = prompt("Perfil (admin/user):", u.perfil);
    if (!perfil) return;

    atualizar(id, {
        nome,
        cpf,
        contato,
        departamento,
        email,
        senha,
        perfil
    });
}

// ATUALIZAR
async function atualizar(id, dados) {
    await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    alert("Atualizado!");
    carregarUsuarios();
}

// FORMATAR CPF
function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// VOLTAR
function voltar() {
    window.location.href = "../Tela_Menu/Tela_Menu.html";
}

// CADASTRAR
function cadastrar() {
    window.location.href = "../Tela_Cadastro_Usuario/Tela_Cadastro_Usuario.html";
}