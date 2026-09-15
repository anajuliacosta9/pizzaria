// ---------- Dados das pizzas ----------
const PIZZAS = [
    {
        id: "calabresa-especial",
        nome: "Calabresa Especial",
        descricao: "Molho de tomate artesanal, muçarela, calabresa defumada e cebola roxa.",
        preco: 42.90,
        imagem: "/img/pizza1.jpeg",
    },
    {
        id: "margherita-gourmet",
        nome: "Margherita Gourmet",
        descricao: "Molho artesanal, muçarela de búfala, fatias de tomate fresco e manjericão.",
        preco: 45.90,
        imagem: "/img/pizza2.jpeg",
    },
    {
        id: "quatro-queijos",
        nome: "Quatro Queijos",
        descricao: "Muçarela, catupiry original, provolone e um toque marcante de gorgonzola.",
        preco: 48.90,
        imagem: "/img/pizza3.jpg",
    },
];

// ---------- Chaves do localStorage ----------
const CHAVE_CARRINHO = "pizzaecia_carrinho";
const CHAVE_FAVORITOS = "pizzaecia_favoritos";

// ---------- Leitura e escrita no localStorage ----------
function lerCarrinho() {
    return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function lerFavoritos() {
    return JSON.parse(localStorage.getItem(CHAVE_FAVORITOS)) || [];
}

function salvarFavoritos(favoritos) {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
}

// ---------- Ações do carrinho ----------
function adicionarAoCarrinho(id) {
    const carrinho = lerCarrinho();
    const item = carrinho.find((i) => i.id === id);
    if (item) {
        item.qtd += 1;
    } else {
        carrinho.push({ id, qtd: 1 });
    }
    salvarCarrinho(carrinho);
    atualizarInterface();
}

function alterarQuantidade(id, delta) {
    let carrinho = lerCarrinho();
    const item = carrinho.find((i) => i.id === id);
    if (!item) return;
    item.qtd += delta;
    if (item.qtd <= 0) {
        carrinho = carrinho.filter((i) => i.id !== id);
    }
    salvarCarrinho(carrinho);
    atualizarInterface();
}

function removerDoCarrinho(id) {
    const carrinho = lerCarrinho().filter((i) => i.id !== id);
    salvarCarrinho(carrinho);
    atualizarInterface();
}

// ---------- Ações de favoritos ----------
function alternarFavorito(id) {
    let favoritos = lerFavoritos();
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter((f) => f !== id);
    } else {
        favoritos.push(id);
    }
    salvarFavoritos(favoritos);
    atualizarInterface();
}

// ---------- Renderização ----------
function formatarPreco(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function renderizarPizzas() {
    const secao = document.getElementById("secaoPizzas");
    if (!secao) return;
    const favoritos = lerFavoritos();

    secao.innerHTML = PIZZAS.map((pizza) => {
        const favoritado = favoritos.includes(pizza.id);
        return `
            <div class="pizza-card">
                <img src="${pizza.imagem}" alt="Pizza ${pizza.nome}" class="pizza-img">
                <button class="favorito-btn ${favoritado ? "ativo" : ""}" data-favoritar="${pizza.id}" aria-label="Favoritar ${pizza.nome}">♥</button>
                <div class="pizza-info">
                    <h3>${pizza.nome}</h3>
                    <p>${pizza.descricao}</p>
                    <span class="preco">${formatarPreco(pizza.preco)}</span>
                    <button class="adicionar-btn" data-adicionar="${pizza.id}">Adicionar ao carrinho</button>
                </div>
            </div>
        `;
    }).join("");
}

function renderizarFavoritos() {
    const favoritos = lerFavoritos();
    const lista = document.getElementById("listaFavoritos");
    const contador = document.getElementById("contadorFavoritos");
    if (contador) contador.textContent = favoritos.length;
    if (!lista) return;

    if (favoritos.length === 0) {
        lista.innerHTML = `<p class="vazio">Nenhuma pizza favoritada ainda.</p>`;
        return;
    }

    lista.innerHTML = favoritos
        .map((id) => PIZZAS.find((p) => p.id === id))
        .filter(Boolean)
        .map((pizza) => `
            <div class="linha-favorito">
                <span>${pizza.nome}</span>
                <button class="adicionar-btn" data-adicionar="${pizza.id}" style="width:auto;padding:6px 16px;">Adicionar</button>
            </div>
        `).join("");
}

function renderizarCarrinho() {
    const carrinho = lerCarrinho();
    const lista = document.getElementById("listaCarrinho");
    const totalEl = document.getElementById("totalCarrinho");
    const contador = document.getElementById("contadorCarrinho");
    const totalItens = carrinho.reduce((soma, i) => soma + i.qtd, 0);
    if (contador) contador.textContent = totalItens;
    if (!lista || !totalEl) return;

    if (carrinho.length === 0) {
        lista.innerHTML = `<p class="vazio">Seu carrinho está vazio.</p>`;
        totalEl.textContent = formatarPreco(0);
        return;
    }

    let total = 0;
    lista.innerHTML = carrinho.map((item) => {
        const pizza = PIZZAS.find((p) => p.id === item.id);
        if (!pizza) return "";
        const subtotal = pizza.preco * item.qtd;
        total += subtotal;
        return `
            <div class="linha-carrinho">
                <div>
                    <strong>${pizza.nome}</strong>
                    <span class="subtotal">${formatarPreco(subtotal)}</span>
                </div>
                <div class="controles-qtd">
                    <button data-diminuir="${pizza.id}">−</button>
                    <span>${item.qtd}</span>
                    <button data-aumentar="${pizza.id}">+</button>
                    <button class="remover-btn" data-remover="${pizza.id}">remover</button>
                </div>
            </div>
        `;
    }).join("");

    totalEl.textContent = formatarPreco(total);
}

function atualizarInterface() {
    renderizarPizzas();
    renderizarFavoritos();
    renderizarCarrinho();
}

// ---------- Painéis (abrir/fechar) ----------
function abrirPainel(idPainel) {
    document.getElementById(idPainel).classList.add("aberto");
    document.getElementById("overlay").classList.add("visivel");
}

function fecharTodosPaineis() {
    document.querySelectorAll(".painel").forEach((p) => p.classList.remove("aberto"));
    document.getElementById("overlay").classList.remove("visivel");
}

// ---------- Delegação de eventos ----------
document.addEventListener("click", (evento) => {
    const alvo = evento.target.closest("[data-favoritar], [data-adicionar], [data-aumentar], [data-diminuir], [data-remover], [data-fechar]") || evento.target;

    if (alvo.id === "btnFavoritos") abrirPainel("painelFavoritos");
    if (alvo.id === "btnCarrinho") abrirPainel("painelCarrinho");
    if (evento.target.id === "overlay") fecharTodosPaineis();
    if (alvo.dataset && alvo.dataset.fechar) fecharTodosPaineis();

    if (alvo.dataset && alvo.dataset.adicionar) adicionarAoCarrinho(alvo.dataset.adicionar);
    if (alvo.dataset && alvo.dataset.favoritar) alternarFavorito(alvo.dataset.favoritar);
    if (alvo.dataset && alvo.dataset.aumentar) alterarQuantidade(alvo.dataset.aumentar, 1);
    if (alvo.dataset && alvo.dataset.diminuir) alterarQuantidade(alvo.dataset.diminuir, -1);
    if (alvo.dataset && alvo.dataset.remover) removerDoCarrinho(alvo.dataset.remover);

    if (alvo.id === "btnFinalizar") {
        if (lerCarrinho().length === 0) return;
        window.location.href = "finalizar-pedido.html";
    }
});

atualizarInterface();
