const raizDoProjeto = new URL("..", document.currentScript.src).href;

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
