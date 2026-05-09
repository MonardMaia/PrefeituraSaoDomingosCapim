document.addEventListener("DOMContentLoaded", function () {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario && usuario.perfil == "admin") {
        document.getElementById("btnCadastro").style.display = "block";
        document.getElementById("btnUsuarios").style.display = "block";
    }
});
function Atendimento() {
    window.location.href = "/Tela_Atendimento_Visitantes/Tela_Atendimento_Visitantes.html";
}

function CadastroUsuario() {
    window.location.href = "/Tela_Cadastro_Usuario/Tela_Cadastro_Usuario.html";
}

function HistoricoAtendimento() {
    window.location.href = "/Tela_Historico_Atendimento/Tela_Historico_Atendimento.html";
}

function UsuariosExistentes() {
    window.location.href = "/Tela_Usuarios/Tela_Usuarios.html";
}
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/Tela_Login/Tela_Login.html";
}