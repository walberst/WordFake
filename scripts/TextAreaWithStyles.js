class TextAreaWithStyles {
    constructor(styles) {
        this.styles = styles;
        this.textArea = document.createElement("textarea");
        this.textArea.hidden = true;
        this.textArea.id = "WordFake";
        this.notepad = document.createElement("div");
        this.overlayDiv = document.createElement("div");
        this.overlayDiv.id = "overlayDiv";
        this.overlayDiv.contentEditable = true;
    }

    applyStyles() {
        const { paper, border, measurement, notepad } = this.styles;

        this.notepad.style.background = `${notepad.color}`;
        this.notepad.style.width = `100%`;
        this.notepad.style.height = `100%`;
        this.notepad.style.margin = `0 auto`;
        this.notepad.style.display = `flex`;
        this.notepad.style.alignItems = `center`;
        this.notepad.style.justifyContent = `center`;

        //Layout do papel
        this.overlayDiv.style.backgroundColor = `#fff`;
        this.overlayDiv.style.width = `${paper.A4.width}${measurement}`;
        this.overlayDiv.style.height = `${paper.A4.height}${measurement}`;
        this.overlayDiv.style.border = `${notepad.pageBorderWidth}${measurement} ${notepad.pageBorderStyle} ${notepad.pageBorderColor}`;
        this.overlayDiv.style.paddingTop = `${border.top}${measurement}`;
        this.overlayDiv.style.paddingBottom = `${border.bottom}${measurement}`;
        this.overlayDiv.style.paddingLeft = `${border.left}${measurement}`;
        this.overlayDiv.style.paddingRight = `${border.right}${measurement}`;
        this.overlayDiv.style.position = "relative";
        this.overlayDiv.style.margin = "10px";
    }

    updateOverlayDiv() {

        //calcula o tamanho da fonte em pixels
        const fontSize = window.getComputedStyle(this.overlayDiv).fontSize;
        const fontSizeInPx = parseInt(fontSize.slice(0, -2));

        //calcula a largura máxima em pixels
        const maxWidth = this.overlayDiv.offsetWidth - this.overlayDiv.offsetLeft - parseInt(this.overlayDiv.style.paddingRight.slice(0, -2));
        const maxCharsPerLine = parseInt(maxWidth / fontSizeInPx);

        //quebra as linhas
        // this.overlayDiv.innerHTML = this.overlayDiv.innerHTML.replace(
        //     new RegExp(`(.{${maxCharsPerLine}})( +|$\n?)`, "g"),
        //     "$1<br>"
        // );
    }




    render() {
        this.applyStyles();
        this.overlayDiv.addEventListener("input", () => {
            this.textArea.value = this.overlayDiv.innerHTML;
            this.updateOverlayDiv();
        });
        this.notepad.appendChild(this.textArea);
        this.notepad.appendChild(this.overlayDiv);
        document.body.appendChild(this.notepad);
    }
}