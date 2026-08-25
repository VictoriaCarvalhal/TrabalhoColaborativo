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

loadComponents();
