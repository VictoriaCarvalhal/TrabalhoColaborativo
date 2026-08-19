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

        const response = await fetch(`/components/${filename}.html`);

        if (!response.ok) {
            console.error(`Deu ruim em ${filename}.html`);
            continue;
        }

        element.outerHTML = await response.text();
    }
}

loadComponents();