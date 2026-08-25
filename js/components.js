const raizDoProjeto = new URL("..", document.currentScript.src).href;

// carrega o CSS e o bundle JS do Bootstrap uma unica vez (evita duplicar nos index.html)
function carregarBootstrap() {
    if (!document.querySelector("link[href*='bootstrap.min.css']")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
        link.integrity = "sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
    }

    if (!document.querySelector("script[src*='bootstrap.bundle.min.js']")) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
        script.integrity = "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
    }
}

carregarBootstrap();

// troca os caminhos que comecam com / pelos caminhos a partir da raiz do projeto
function ajustarCaminhos(html) {
    return html.replace(/(src|href)="\/([^"]*)"/g, `$1="${raizDoProjeto}$2"`);
}

async function loadComponents() {
    const components = {
        header: "header",
        navbar: "navbar",
        leftSidebar: "sidebar",
        footer: "footer",
        //id : filename
    };

    for (const [id, filename] of Object.entries(components)) {
        const element = document.getElementById(id);

        if (!element)
            continue;

        const response = await fetch(`${raizDoProjeto}components/${filename}.html`);

        if (!response.ok) {
            console.error(`Deu ruim em ${filename}.html`);
            continue;
        }

        element.outerHTML = ajustarCaminhos(await response.text());
    }
}

// o navegador pula para a ancora antes de os componentes serem injetados,
// e a altura do header injetado depois joga o alvo para fora da tela.
// por isso o pulo e refeito quando o carregamento termina.
function irParaAncora() {
    if (!location.hash) return;

    const alvo = document.getElementById(location.hash.slice(1));

    if (!alvo) return;

    // posicao calculada na mao para o alvo parar no topo da janela
    const topo = alvo.getBoundingClientRect().top + window.scrollY;

    window.scrollTo(0, topo);

    // o tabindex="-1" no alvo faz o leitor de tela acompanhar o pulo.
    // preventScroll para o foco nao desfazer o scrollTo acima
    if (alvo.hasAttribute("tabindex")) alvo.focus({ preventScroll: true });
}

// espera o resto da pagina (css do bootstrap, imagens ja no html)
function paginaCarregada() {
    if (document.readyState === "complete") return Promise.resolve();

    return new Promise(function (resolve) {
        window.addEventListener("load", resolve, { once: true });
    });
}

// espera as imagens que vieram junto com os componentes injetados
function imagensCarregadas() {
    const pendentes = Array.from(document.images).filter(function (img) {
        return !img.complete;
    });

    return Promise.all(pendentes.map(function (img) {
        return new Promise(function (resolve) {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
        });
    }));
}

// o pulo so vale depois que tudo que muda altura ja assentou, senao o
// alvo escorrega para fora da tela
loadComponents()
    .then(paginaCarregada)
    .then(imagensCarregadas)
    .then(irParaAncora);
