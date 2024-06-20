//Dimentions
const COLS = 26;
const ROWS = 100;

//constants
const transparentBlue = '#ddddff'
const transparent = 'transparent'
const arrMatrix = 'arrMatrix';


//table componenets
const tHeadRow = document.getElementById("table-heading-row")
const tBody = document.getElementById("table-body")
const currentCellHeading = document.getElementById("current-cell")
const sheetNo = document.getElementById("sheet-no")
const buttonContainer = document.getElementById("button-container");
const saveSheetButton = document.getElementById("save-sheet-btn");
const addSheetButton = document.getElementById("add-sheet-btn");

//excel buttons
const boldButton = document.getElementById("bold-btn");
const italicButton = document.getElementById("italic-btn");
const underlineButton = document.getElementById("underline-btn");
const leftButton = document.getElementById("left-btn");
const centerButton = document.getElementById("center-btn");
const rightButton = document.getElementById("right-btn");
const cutButton = document.getElementById("cut-btn");
const copyButton = document.getElementById("copy-btn");
const pasteButton = document.getElementById("paste-btn");
const uploadInput = document.getElementById("upload-input")

//color inputs
const bgColor = document.getElementById("bgColor")
const fontColor = document.getElementById("fontColor")

//dropdown
const fontStyleDropdown = document.getElementById("font-style-dropdown")
const fontSizeDropdown = document.getElementById("font-size-dropdown")

//cache
let currentCell;
let previousCell;
let cutCell; 
let lastPressedBtn;
let matrix = new Array(ROWS); 
let numSheets = 1;
let currentSheet = 1;
let previousSheet;



function createNewMatrix() {
    for (let row = 0; row < ROWS; row++) {
        matrix[row] = new Array(COLS);
        for (let col = 0; col < COLS; col++) {
            matrix[row][col] = {};
        }
    }
}
createNewMatrix();



function colGen(typeOfCell, tableRow, isInnertext, rowNumber) {
    for (let col = 0; col < COLS; col++) {
        const cell = document.createElement(typeOfCell)
        if (isInnertext) {
            cell.innerText = String.fromCharCode(col + 65);
            cell.setAttribute("id", String.fromCharCode(col + 65));
        }
        else {
            cell.setAttribute("id", `${String.fromCharCode(col + 65)}${rowNumber}`);
            cell.setAttribute("contenteditable", true);
            cell.addEventListener("input", updateObjectInMatrix);
            cell.addEventListener("focus", (event) => focusHandler(event.target));
        }
        tableRow.append(cell)
    }
}
colGen("th", tHeadRow, true)

function tableBodyGen(){
    tBody.innerHTML = ''; //?
    for (let row = 1; row < ROWS; row++) {
        const tr = document.createElement("tr")
        const th = document.createElement("th")
        th.innerText = row;
        th.setAttribute("id", row)
        tr.append(th);
        colGen("td", tr, false, row)
        tBody.append(tr)
    } 
}
tableBodyGen()


//?
if (localStorage.getItem(arrMatrix)) {
    matrix = JSON.parse(localStorage.getItem(arrMatrix))[0];
    renderMatrix();
}
//what if i want to render all the sheets



function setHeadersColor(colId, rowId, color) {
    const colHead = document.getElementById(colId);
    const rowHead = document.getElementById(rowId);
    colHead.style.backgroundColor = color
    rowHead.style.backgroundColor = color
}

function buttonHighliter(button, styleProperty, style) {
    if (currentCell.style[styleProperty] === style) {
        button.style.backgroundColor = transparentBlue;
    } else {
        button.style.backgroundColor = transparent;
    }
}

function focusHandler(cell) {
    currentCell = cell;
    if (previousCell) {
        setHeadersColor(previousCell.id[0], previousCell.id.substring(1), 'transparent');
    }
    buttonHighliter(boldButton, 'fontWeight', 'bold')
    buttonHighliter(italicButton, 'fontStyle', 'italic')
    buttonHighliter(underlineButton, 'textDecoration', 'underline')

    setHeadersColor(cell.id[0], cell.id.substring(1), '#ddddff');
    currentCellHeading.innerText = cell.id
    previousCell = currentCell;
}

function buttonEventHandler(currenCell, button, style, toggleStyle, styleProperty) {
    if (currentCell.style[styleProperty] === style) {
        currenCell.style[styleProperty] = toggleStyle;
        button.style.backgroundColor = transparent;
    } else {
        currenCell.style[styleProperty] = style;
        button.style.backgroundColor = transparentBlue;
    }
    updateObjectInMatrix();
}
boldButton.addEventListener("click", () => buttonEventHandler(currentCell, boldButton, 'bold', 'normal', 'fontWeight'));
italicButton.addEventListener('click', () => buttonEventHandler(currentCell, italicButton, 'italic', 'normal', 'fontStyle'));
underlineButton.addEventListener('click', () => buttonEventHandler(currentCell, underlineButton, 'underline', 'none', 'textDecoration'));



function textDirection(currentCell, style, styleProperty, toggleStyle) {
    if (currentCell.style[styleProperty] === style) {
        currentCell.style[styleProperty] = toggleStyle
    } else {
        currentCell.style[styleProperty] = style
    }
    updateObjectInMatrix();
}
leftButton.addEventListener("click", () => textDirection(currentCell, 'left', 'textAlign', 'none'))
centerButton.addEventListener("click", () => textDirection(currentCell, 'center', 'textAlign', ''))
rightButton.addEventListener("click", () => textDirection(currentCell, 'right', 'textAlign', 'normal'))



fontStyleDropdown.addEventListener("change", () => {
    currentCell.style.fontFamily = fontStyleDropdown.value;
    updateObjectInMatrix();
})
fontSizeDropdown.addEventListener("change", () => {
    currentCell.style.fontSize = fontSizeDropdown.value;
    updateObjectInMatrix();
})
bgColor.addEventListener("input", () => {
    currentCell.style.backgroundColor = bgColor.value;
    updateObjectInMatrix();
})
fontColor.addEventListener("input", () => {
    currentCell.style.color = fontColor.value;
    updateObjectInMatrix();
})



cutButton.addEventListener("click", () => {
    lastPressedBtn = 'cut'
    cutCell = {
        text: currentCell.innerText,
        style: currentCell.style.cssText,
    }
    currentCell.innerText = '';
    currentCell.style.cssText = '';
    // currentCell = undefined;
    updateObjectInMatrix();
})
pasteButton.addEventListener("click", () => {
    currentCell.innerText = cutCell.text
    currentCell.style = cutCell.style
    if (lastPressedBtn === 'cut') {
        cutCell = undefined
    }
    updateObjectInMatrix();
    // else {
    //     lastPressedBtn = 'copy'
    //     currentCell.innerText = cutCell.text
    //     currentCell.style = cutCell.style
    // }
})
copyButton.addEventListener("click", () => {
    lastPressedBtn = 'copy'
    cutCell = {
        text: currentCell.innerText,
        style: currentCell.style.cssText,
    }
})



function updateObjectInMatrix(){
    console.log(matrix[0][0]);
    let id = currentCell.id;
    // let tempObj ={
    //     text: currentCell.innerText,
    //     style: currentCell.cssText,
    //     id: id,
    // }
    let col = id[0].charCodeAt(0)-65;
    let row = id.substring(1)-1
    matrix[row][col]= {
        text: currentCell.innerText,
        style: currentCell.cssText,
        id: id,
    }
}

function downloadMatrix(){
    const matrixString = JSON.stringify(matrix);
    const blob = new Blob([matrixString], {type: 'application/json'});
    console.log(blob);
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'table.json';
    link.click();
}

uploadInput.addEventListener('input', uploadmatrix)

function uploadmatrix(event){
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event){
            const fileContent = JSON.parse(event.target.result);
            matrix = fileContent 
            renderMatrix();
        }
    } 
}

function genNextSheetButton(){
    const btn = document.createElement('button');
    numSheets++;
    currentSheet = numSheets;
    // currentSheet++;
    btn.innerHTML = `Sheet ${currentSheet}`;
    btn.setAttribute('id', `sheet-${currentSheet}`);
    btn.setAttribute('onclick', 'viewSheet(event)')
    buttonContainer.append(btn)
}

addSheetButton.addEventListener('click', () =>{
    genNextSheetButton();
    sheetNo.innerText = `Sheet No - ${currentSheet}`;
    saveMatrix();
    createNewMatrix();
//2d iteration and clean every object or make 2d matrix
    // tBody.innerHTML = ''
    tableBodyGen();
//clean whole table or recrating whole table

})

//if arrmatrix is created in global it will be lost isf some 
//one is refreshing the page.
function saveMatrix(){
    if (localStorage.getItem(arrMatrix)) {
        let tempMatrixArr = JSON.parse(localStorage.getItem(arrMatrix));
        tempMatrixArr.push(matrix);
        localStorage.setItem(arrMatrix, JSON.stringify(tempMatrixArr));
    }else{
        let tempMatrixArr = [matrix]
        localStorage.setItem(arrMatrix, JSON.stringify(tempMatrixArr));
    }
}

//?
function viewSheet(event){
    previousSheet = currentSheet;
    // console.log(event.target.id); //sheet-1
    // let id = event.target.id;
    currentSheet = event.target.id.split('-')[1]; 
    let matrixArr = JSON.parse(localStorage.getItem(arrMatrix));
    matrixArr[previousSheet-1] = matrix; //?
    matrix = matrixArr[currentSheet-1];
    localStorage.setItem(arrMatrix, JSON.stringify(matrixArr));
    //-1 to allocate sheet-1/matrix-1 in place of index 0 
    tableBodyGen(); //?
    renderMatrix();
}

//?
function renderMatrix(){
    matrix.forEach(row=>{
        row.forEach(cellObj=>{
            if (cellObj.id) {
                let currenCell = document.getElementById(cellObj.id);
                currenCell.innerText = cellObj.text;
                currenCell.style = cellObj.style; //?
            }
        })
    })
}


// viewSheet- it should save current matrix before changing 
// the matrix