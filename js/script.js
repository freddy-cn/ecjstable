let tableId = undefined;
let pages = [];
let timeout = undefined
let columnsOrdering = {};
let initialData = undefined;
let arrowUp = '^';
let arrowDown = 'v';

// Stores the initial array of data and triggers the table processing
const setTable = (data, options) => {
    tableId = options.tableId;
    initialData = data;
    arrowUp = options.arrowUp;
    arrowDown = options.arrowDown;
    loadTable(data,options);
    if(options.useHeaders && data.length > 0){
        addHeaders(data[0]);
    }
    addColumnSorting();
}

// Calls required methods
const loadTable = (data,options) => {
    paginate(data,options);
    createLinks(options);
    populateTable(options.currentPage-1);
}

// Generates a set of arrays representing the organized data
const paginate = (data,options) => {
    pages = [];
    let pageNumber = 0;

    data.forEach((row, index) => {
        if(!pages[pageNumber]){
            pages[pageNumber] = [];
        }

        if(pages[pageNumber].length < options.perPage){
            pages[pageNumber].push(row);
            if(pages[pageNumber].length == options.perPage){
                pageNumber++
            }
        }
    });
}
const addHeaders = (data) => {
    const thead = document.querySelector(`#${tableId} thead`);
    thead.innerHTML = '';
    let tr = document.createElement('tr');
    for(column in data){
        const th = document.createElement('th');
        th.innerHTML = `<label>${column}</label> <span></span>`;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
}

// Generates the buttons for switching between pages
const createLinks = (options) =>{
    const linksContainer = document.querySelector('#pager');
    linksContainer.innerHTML = "";
    for(let i = 0; i < pages.length; i++){
        const linkButton = `<button onclick="populateTable(${i})" class="table-link">${i+1}</button>`;
        linksContainer.innerHTML += linkButton;
    }
}

// Populates the table with the visible rows
const populateTable = (page) => {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = '';
    if(pages.length < 1 || page >= pages.length) return;
    pages[page].forEach(record => {
        const tr = document.createElement('tr');
        Object.values(record).forEach(field => {
            const td = document.createElement('td');
            if(typeof field == 'object'){
                let content = '<ul>'
                for(subfield in field){
                    content +=  '<li>' + field[subfield] + '</li>' ;
                }
                field = content + '</ul>';
            }
            td.innerHTML = field;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

const filter = (evt) =>{
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        let searchWord = evt.target.value;
        let filteredData = initialData.filter(row => {
            let wordCount = 0;
            Object.values(row).forEach(field => {
                let fieldText = String(field).toLowerCase();
                if(fieldText.includes(String(searchWord).toLowerCase())){
                    wordCount++;
                }
            });
            if(wordCount > 0) return true;
        });
        data = filteredData; 
        loadTable(filteredData,options)
    }, 300); 
}

const sort = (columnNumber) =>{
    if(pages.length < 1) return;
    let arrow = '';

    let field = Object.keys(data[0])[columnNumber]; 
    columnsOrdering[field] = !columnsOrdering[field];

    let sortedData = data.sort(function(a,b){
        let fieldA = typeof a[field] == "number" ? Number(a[field]) : String(a[field]).toLowerCase();
        let fieldB = typeof b[field] == "number" ? Number(b[field]) : String(b[field]).toLowerCase();

        if(columnsOrdering[field]){
            arrow =  arrowUp;
            if (fieldA < fieldB) { 
                return -1; }
            if (fieldA > fieldB) {
                return 1; }
        }else{
            arrow =  arrowDown;
            if (fieldA > fieldB) { return -1; }
            if (fieldA < fieldB) { return 1; }
        }

        return 0;
    });

    const thead = document.querySelectorAll(`#${tableId} thead tr th`);
    Array.from(thead).forEach((col, index) => {

        if(index == columnNumber){
            thead[index].classList.add('active-sort')
            document.querySelectorAll(`#${tableId} thead th span`)[index].innerHTML = arrow 
        }else{
            document.querySelectorAll(`#${tableId} thead th span`)[index].innerHTML = ""
            thead[index].classList.remove('active-sort')
        }

    });
    
    data = sortedData;
    loadTable(data, options);
}

const addColumnSorting = () => {
    const columns = Array.from(document.querySelectorAll('thead tr th'));
    columns.forEach((col, i) => {
        col.addEventListener('click',()=>{sort(i)});
    })
}
