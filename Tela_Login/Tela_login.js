async function acessar() { 
    const cpf = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    if (!cpf || !senha) {
        alert("⚠️ Preencha Login e senha!");
        return;
    }

    try {
        const resposta = await fetch("http://192.168.1.108:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cpf, senha })
        });

        if (!resposta.ok) {
            alert("❌ Login ou senha inválidos!");
            return;
        }

        const usuario = await resposta.json();

        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        alert("Login realizado com sucesso!");

        window.location.href = "../Tela_Menu/Tela_Menu.html";

    } catch (erro) {
        console.error(erro);
        alert("❌ Erro ao conectar com o servidor!");
    }
    
}
// Função para mostrar mensagens de alerta
function mostrarMensagem(event, tipo) {
    // Evita que o link '#' recarregue a página ou suba o scroll
    event.preventDefault();
    const alerta = document.getElementById("alerta");
    if (tipo == "senha") {
        alerta.innerHTML = "🔑 <strong>Recuperação de senha:</strong><br>Entre em contato com TI:<br>suporteticapim2026@gmail.com";
    } else if (tipo == "cadastro") {
        alerta.innerHTML = "📧 <strong>Solicitação de cadastro:</strong><br>Enviar e-mail para TI:<br>suporteticapim2026@gmail.com";
    }
    alerta.classList.add("show");
    setTimeout(() => {
        alerta.classList.remove("show");
    }, 5000);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Tela_Login/Tela_Login.html"));
});