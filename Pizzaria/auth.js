// ============================================================
// FUNÇÕES DE AUTENTICAÇÃO (Supabase Auth)
// Depende de: supabase-js (CDN) + supabase-config.js carregados antes
// ============================================================

// ---------- Cadastro ----------
async function cadastrarUsuario(nome, email, senha) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: senha,
        options: {
            data: { nome: nome }, // vai para user_metadata e é usado pelo trigger que cria o perfil
        },
    });
    return { data, error };
}

// ---------- Login ----------
async function entrarUsuario(email, senha) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha,
    });
    return { data, error };
}

// ---------- Logout ----------
async function sairUsuario() {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
}

// ---------- Sessão atual ----------
async function obterSessaoAtual() {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
}

// ---------- Perfil do usuário logado (tabela "perfis") ----------
async function obterPerfil(idUsuario) {
    const { data, error } = await supabaseClient
        .from("perfis")
        .select("*")
        .eq("id", idUsuario)
        .single();
    return { data, error };
}

// ---------- Protege páginas que exigem login ----------
// Chame no topo de páginas como dashboard.html
async function protegerRota() {
    const sessao = await obterSessaoAtual();
    if (!sessao) {
        window.location.href = "login.html";
        return null;
    }
    return sessao;
}

// ---------- Atualiza o botão "Entrar / Minha Conta" no cabeçalho ----------
// Espera um link/botão com id="btnConta" no HTML
async function atualizarBotaoConta() {
    const botao = document.getElementById("btnConta");
    if (!botao) return;

    const sessao = await obterSessaoAtual();
    if (sessao) {
        botao.textContent = "Minha Conta";
        botao.href = "dashboard.html";
    } else {
        botao.textContent = "Entrar";
        botao.href = "login.html";
    }
}

// Roda automaticamente em toda página que carregar este arquivo
document.addEventListener("DOMContentLoaded", atualizarBotaoConta);
