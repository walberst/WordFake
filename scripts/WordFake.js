class WordFake {
    constructor(styles, container = null) {
        this.styles = styles;
        this.textArea = document.createElement("textarea");
        this.textArea.hidden = true;
        this.textArea.id = "WordFake";
        this.notepad = document.createElement("div");
        this.overlayDivs = [document.createElement("div")];
        this.overlayDivs[0].className = "overlayDiv";
        this.overlayDivs[0].contentEditable = true;
        this.currentDiv = 0;
        if (!container) {
            container = document.querySelector("body");
        }
        this.container = container;
    }

    render() {
        this.applyStyles();
        for (let i = 0; i < this.overlayDivs.length; i++) {
            this.createNewOverlayDiv(i)
            this.notepad.appendChild(this.overlayDivs[i]);
        }
        this.notepad.appendChild(this.textArea);
        this.container.appendChild(this.notepad);
    }

    updateOverlayDiv() {
        this.textArea.value = this.overlayDivs[this.currentDiv].innerHTML;
        const { paper, notepad } = this.styles;
        if (this.getHeightString(this.overlayDivs[this.currentDiv].innerHTML) > ((paper.A4.height * notepad.scale) / 100 - (paper.margin.bottom * notepad.scale) / 100) + 10) {
            if (this.currentDiv == this.overlayDivs.length - 1) {
                this.addPage()
            }
        }
    }

    reorganizePage(index) {
        const { paper, notepad } = this.styles;
        let maxHeight = ((paper.A4.height * notepad.scale) / 100 - (paper.margin.bottom * notepad.scale) / 100) + 10;
        for (let i = index; i < (this.overlayDivs.length - index); i++) {
            let currrentText = this.overlayDivs[i].innerHTML.replaceAll("</div>", " </div>");
            let currentTextHeight = this.getHeightString(currrentText);
            while (currentTextHeight > maxHeight) {
                let arrayText = currrentText.split(' ');
                let next = arrayText.pop();
                currrentText = arrayText.join(' ');
                if (i == this.overlayDivs.length - 1) {
                    this.addPage(false);
                }
                this.overlayDivs[i + 1].innerHTML = next + ' ' + this.overlayDivs[i + 1].innerHTML;
                currentTextHeight = this.getHeightString(currrentText);
            }
            this.overlayDivs[i].innerHTML = currrentText;
        }
    }

    createNewOverlayDiv(index) {
        this.overlayDivs[index] = document.createElement("div");
        this.overlayDivs[index].className = `overlayDiv`;
        this.overlayDivs[index].contentEditable = true;
        this.notepad.appendChild(this.overlayDivs[index]);
        this.applyStyles();

        this.overlayDivs[index].addEventListener("blur", () => {
            this.reorganizePage(index);
        });

        let timer;
        this.overlayDivs[index].addEventListener("keyup", () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.overlayDivs[index].blur();
            }, 3000);
        });

        this.overlayDivs[index].addEventListener("click", () => {
            this.changePage(index);
        });

        this.overlayDivs[index].addEventListener("input", () => {
            this.textArea.value = this.overlayDivs[this.currentDiv].innerHTML;
            this.updateOverlayDiv();
        });
    }

    getWidthString(text) {
        const tempSpan = document.createElement('span');
        tempSpan.style.display = 'inline-block';
        tempSpan.style.wordWrap = 'break-word';
        tempSpan.innerHTML = text;
        this.container.appendChild(tempSpan);
        const testWidth = tempSpan.offsetWidth;
        tempSpan.remove();
        return testWidth;
    }

    getHeightString(text) {
        const { paper, notepad } = this.styles;
        let width = ((paper.A4.width * notepad.scale) / 100) - ((paper.margin.left * notepad.scale) / 100) - ((paper.margin.right * notepad.scale) / 100);
        const tempSpan = document.createElement('span');
        tempSpan.style.width = `${width}${notepad.measurement}`;
        tempSpan.style.display = 'inline-block';
        tempSpan.style.wordWrap = 'break-word';
        tempSpan.innerHTML = text;
        this.container.appendChild(tempSpan);
        const testWidth = tempSpan.offsetHeight;
        tempSpan.remove();
        return testWidth;
    }

    addPage(focus = true) {
        this.currentDiv = this.overlayDivs.length;
        this.createNewOverlayDiv(this.currentDiv);
        if (focus) {
            this.overlayDivs[this.currentDiv].focus();
        }
    }

    removePage() {
        if (this.overlayDivs.length > 1) {
            this.notepad.removeChild(this.overlayDivs[this.currentDiv]);
            this.overlayDivs.splice(this.currentDiv, 1);
            this.currentDiv = Math.max(0, this.currentDiv - 1);
            this.updateOverlayDiv();
        }
    }

    save() {
        localStorage.setItem("WordFake", JSON.stringify({
            styles: this.styles,
            text: this.getText(),
            currentDiv: this.currentDiv
        }));
    }

    load() {
        const data = JSON.parse(localStorage.getItem("WordFake"));
        if (data) {
            this.styles = data.styles;
            this.currentDiv = data.currentDiv;
            this.setText(data.text);
        }
    }

    print() {
        window.print();
    }

    getCurrentPage() {
        return this.currentDiv + 1;
    }

    getText() {
        return this.textArea.value;
    }

    setText(text) {
        this.textArea.value = text;
        this.overlayDivs[this.currentDiv].innerHTML = text;
        this.updateOverlayDiv();
    }

    changePage(index) {
        this.currentDiv = index;
    }

    getNumPages() {
        return this.overlayDivs.length;
    }

    switchPaper(paper) {
        this.styles.paper = paper;
        this.applyStyles();
    }

    switchScale(scale) {
        this.styles.notepad.scale = scale;
        this.applyStyles();
    }

    changeBackgroundColor(color) {
        this.notepad.style.backgroundColor = color;
    }

    changeFontColor(color) {
        this.textArea.style.color = color;
        this.overlayDivs.forEach(div => {
            div.style.color = color;
        });
    }

    changeFontSize(size) {
        this.textArea.style.fontSize = size;
        this.overlayDivs.forEach(div => {
            div.style.fontSize = size;
        });
    }

    changeFontFamily(fontFamily) {
        this.textArea.style.fontFamily = fontFamily;
        this.overlayDivs.forEach(div => {
            div.style.fontFamily = fontFamily;
        });
    }

    changeTextAlignment(align) {
        this.textArea.style.textAlign = align;
        this.overlayDivs.forEach(div => {
            div.style.textAlign = align;
        });
    }

    applyStyles() {
        const { paper, notepad } = this.styles;
        this.notepad.style.background = `${notepad.color}`;
        this.notepad.style.width = `100%`;
        this.notepad.style.height = `100%`;
        this.notepad.style.margin = `0 auto`;
        this.notepad.style.display = `flex`;
        this.notepad.style.flexDirection = "column";
        this.notepad.style.alignItems = `center`;
        this.notepad.style.justifyContent = `center`;

        for (let i = 0; i < this.overlayDivs.length; i++) {
            this.overlayDivs[i].style.backgroundColor = `#fff`;
            this.overlayDivs[i].style.width = `${(paper.A4.width*notepad.scale)/100}${notepad.measurement}`;
            this.overlayDivs[i].style.height = `${(paper.A4.height*notepad.scale)/100}${notepad.measurement}`;
            this.overlayDivs[i].style.border = `${notepad.pageBorderWidth}${notepad.measurement} ${notepad.pageBorderStyle} ${notepad.pageBorderColor}`;
            this.overlayDivs[i].style.paddingTop = `${(paper.margin.top*notepad.scale)/100}${notepad.measurement}`;
            this.overlayDivs[i].style.paddingBottom = `${(paper.margin.bottom*notepad.scale)/100}${notepad.measurement}`;
            this.overlayDivs[i].style.paddingLeft = `${(paper.margin.left*notepad.scale)/100}${notepad.measurement}`;
            this.overlayDivs[i].style.paddingRight = `${(paper.margin.right*notepad.scale)/100}${notepad.measurement}`;
            this.overlayDivs[i].style.margin = "10px";
            this.overlayDivs[i].style.display = 'inline-block';
            this.overlayDivs[i].style.wordWrap = 'break-word';
        }
    }
}