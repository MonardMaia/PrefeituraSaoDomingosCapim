async function salvar() {

    mostrarErro("");

    document.getElementById("senha").style.border = "none";
    document.getElementById("confirmacaoSenha").style.border = "none";

    const dados = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.replace(/\D/g, ""),
        contato: document.getElementById("contato").value.replace(/\D/g, ""),
        departamento: document.getElementById("departamento").value,
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value,
        confirmacaoSenha: document.getElementById("confirmacaoSenha").value,
        perfil: document.getElementById("perfil").value
    };

    if (!dados.nome || !dados.cpf || !dados.contato || !dados.departamento || !dados.email || !dados.senha || !dados.confirmacaoSenha) {
        mostrarErro("⚠️ Preencha todos os campos obrigatórios!");
        return;
    }

    if (!validarCPF(dados.cpf)) {
        mostrarErro("❌ CPF inválido!");
        return;
    }

    if (!validarTelefone(dados.contato)) {
        mostrarErro("❌ Telefone inválido!");
        return;
    }

    if (!validarEmail(dados.email)) {
        mostrarErro("❌ Email inválido!");
        return;
    }

    if (dados.senha !== dados.confirmacaoSenha) {
        mostrarErro("❌ As senhas não coincidem!");
        return;
    }

    try {
        const resposta = await fetch("http://192.168.1.108:3000/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const data = await resposta.json();

        if (!resposta.ok) {
            mostrarErro(data.erro || "Erro ao cadastrar usuário");
            return;
        }

        alert("✅ Usuário cadastrado com sucesso!");
        window.location.href = "../Tela_Login/Tela_Login.html";

    } catch (erro) {
        console.error(erro);
        mostrarErro("❌ Erro ao conectar com o servidor!");
    }
}
function mostrarErro(msg) {
    document.getElementById("erro").innerText = msg;
}
/// Máscara para campo de contato (telefone)
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contato").addEventListener("input", function(e) {
        let v = e.target.value.replace(/\D/g, "");
        v = v.substring(0, 11);

        if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
        if (v.length > 7) v = v.replace(/(\d{5})(\d)/, "$1-$2");

        e.target.value = v;
    });
});
// Função de VALIDAÇÃO DE TELEFONE
function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, "");

    // Deve ter exatamente 11 dígitos
    if (numeros.length !== 11) return false;

    // Celular no Brasil começa com 9 após DDD
    if (numeros[2] !== "9") return false;

    return true;
}
// Função de VALIDAÇÃO DE CPF 
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) return false;

    // Elimina CPFs inválidos conhecidos
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Validação do 1º dígito
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    // Validação do 2º dígito
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}
// Função de VALIDAÇÃO DE EMAIL
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
// Verificação de acesso à página (somente admin)
window.onload = function () {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario || usuario.perfil !== "admin") {
        alert("Acesso negado!");
        window.location.href = "../Tela_Menu/Tela_Menu.html";
    }
};

// Função de VOLTAR
function voltar() {
    window.location.href = "../Tela_Menu/Tela_Menu.html";
}