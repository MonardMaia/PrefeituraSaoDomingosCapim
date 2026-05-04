function avancar() {
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const contato = document.getElementById("contato").value.trim();
    const regiao = document.getElementById("regiao")?.value || "";
    const nascimento = document.getElementById("nascimento").value;
    const atendimento = document.getElementById("atendimento").value;
    const assunto = document.getElementById("assunto").value.trim();
    const departamento = document.getElementById("departamento").value.trim();

    //  VALIDA CAMPOS OBRIGATÓRIOS
    if (!nome || !cpf || !contato || !regiao || !nascimento || !atendimento || !assunto || !departamento) {
        mostrarErro("⚠️ Preencha todos os campos obrigatórios!");
        return;
    }

     //  VALIDA CPF
    if (!validarCPF(cpf)) {
        mostrarErro("❌ CPF inválido!");
        document.getElementById("cpf").style.border = "2px solid red";
        return;
    }

    //  VALIDA TELEFONE
    if (!validarTelefone(contato)) {
        mostrarErro("❌ Telefone inválido!");
        document.getElementById("contato").style.border = "2px solid red";
        return;
    }

    // Limpa erro visual se estiver ok
    document.getElementById("cpf").style.border = "none";
    document.getElementById("contato").style.border = "none";

    const dados = { nome, cpf, contato, regiao, nascimento, atendimento, assunto, departamento };
    localStorage.setItem("cadastro", JSON.stringify(dados));
    
    //  vai para tela de confirmação
    window.location.href = "/Tela_Salvar_Edicao_Atendimento/Tela_Salvar_Edicao_Atendimento.html";

}
// FUNÇÃO PARA MOSTRAR MENSAGEM DE ERRO
function mostrarErro(msg) {
    document.getElementById("erro").innerText = msg;
}
// Auto preencher data de atendimento com a data atual
document.addEventListener("DOMContentLoaded", function () {
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("atendimento").value = hoje;
});

// Máscara para campo de contato (telefone)
document.getElementById("contato").addEventListener("input", function(e) {
    let v = e.target.value.replace(/\D/g, "");

    // Limita a 11 dígitos
    v = v.substring(0, 11);

    // Aplica máscara
    if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    if (v.length > 7) v = v.replace(/(\d{5})(\d)/, "$1-$2");

    e.target.value = v;
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

function voltar() {
    window.location.href = "/Tela_Menu/Tela_Menu.html";
}