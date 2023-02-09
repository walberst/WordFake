class WordFake {
    constructor(styles) {
        this.styles = styles;
        this.textArea = document.createElement("textarea");
        this.textArea.hidden = true;
        this.textArea.id = "WordFake";
        this.notepad = document.createElement("div");
        this.overlayDivs = [document.createElement("div")];
        this.overlayDivs[0].className = "overlayDiv";
        this.overlayDivs[0].contentEditable = true;
        this.currentDiv = 0;
    }

    render() {
        this.applyStyles();
        for (let i = 0; i < this.overlayDivs.length; i++) {
            this.overlayDivs[i].addEventListener("click", () => {
                this.changePage(i);
            });
            this.overlayDivs[i].addEventListener("input", () => {
                this.textArea.value = this.overlayDivs[this.currentDiv].innerHTML;
                this.updateOverlayDiv();
            });
            this.notepad.appendChild(this.overlayDivs[i]);
        }
        this.notepad.appendChild(this.textArea);
        document.body.appendChild(this.notepad);
    }

    updateOverlayDiv() {
        this.textArea.value = this.overlayDivs[this.currentDiv].innerHTML;
        const { paper, notepad } = this.styles;
        if (this.getHeightString(this.overlayDivs[this.currentDiv].innerHTML) > ((paper.A4.height * notepad.scale) / 100 - (paper.margin.bottom * notepad.scale) / 100) + 10) {
            this.splitText();
        }
    }

    createNewOverlayDiv(index) {
        this.overlayDivs[this.currentDiv] = document.createElement("div");
        this.overlayDivs[this.currentDiv].className = `overlayDiv`;
        this.overlayDivs[this.currentDiv].contentEditable = true;
        this.notepad.appendChild(this.overlayDivs[this.currentDiv]);
        this.applyStyles();
    }

    splitText() {
        const { paper, notepad } = this.styles;
        let currentText = this.overlayDivs[this.currentDiv].innerHTML;
        let currentHeight = this.getHeightString(currentText);
        let limitHeight = ((paper.A4.height * notepad.scale) / 100 - (paper.margin.bottom * notepad.scale) / 100) + 10;
        let splitIndex = 0;

        while (currentHeight > limitHeight) {
            splitIndex = currentText.lastIndexOf(" ", splitIndex - 1);
            currentText = currentText.slice(0, splitIndex);
            currentHeight = this.getHeightString(currentText);
        }

        this.overlayDivs[this.currentDiv].innerHTML = currentText;
        this.currentDiv++;
        this.createNewOverlayDiv(this.currentDiv);
        if (this.currentDiv == this.currentDiv.length - 1) {
            this.overlayDivs[this.currentDiv].innerHTML = this.textArea.value.slice(splitIndex);
            this.overlayDivs[this.currentDiv].focus();
        }
    }

    getWidthString(text) {
        const tempSpan = document.createElement('span');
        tempSpan.style.display = 'inline-block';
        tempSpan.style.wordWrap = 'break-word';
        tempSpan.innerHTML = text;
        document.body.appendChild(tempSpan);
        const testWidth = tempSpan.offsetWidth;
        tempSpan.remove();
        return testWidth;
    }

    getHeightString(text) {
        const tempSpan = document.createElement('span');
        tempSpan.style.display = 'inline-block';
        tempSpan.style.wordWrap = 'break-word';
        tempSpan.innerHTML = text;
        document.body.appendChild(tempSpan);
        const testWidth = tempSpan.offsetHeight;
        tempSpan.remove();
        return testWidth;
    }

    changePage(index) {
        this.currentDiv = index;
    }

    getNumPages() {
        return this.overlayDivs.length;
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