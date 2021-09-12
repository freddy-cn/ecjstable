let tableId = undefined;
let currentPage = 0;
let pages = [];
let timeout = undefined
let columnSortingState = {};
let initialData = undefined;
let arrowUp = '⇑';
let arrowDown = '⇓';

// Stores the initial array of data and triggers the table processing
const setTable = (data, options) => {
    tableId = options.tableId;
    initialData = data;
    arrowUp = options.arrowUp;
    arrowDown = options.arrowDown;
    loadTable(data,options);

    if(data.length > 0){
        addHeaders(data[0],options.autoHeaders);
    }
    addColumnSorting();
}

// Calls required methods
const loadTable = (data,options) => {
    paginate(data,options.perPage);
    addPaginator(options);
    showPage(options.currentPage-1);
}

// Generates a set of arrays representing the organized data
const paginate = (data,perPage) => {
    pages = [];
    let pageNumber = 0;

    data.forEach((row, index) => {
        if(!pages[pageNumber]){
            pages[pageNumber] = [];
        }

        if(pages[pageNumber].length < perPage){
            pages[pageNumber].push(row);
            if(pages[pageNumber].length == perPage){
                pageNumber++
            }
        }
    });
}

const addHeaders = (columnNames,autoHeaders) => {
    const thead = document.querySelector(`#${tableId} thead`);

    if(autoHeaders){
        thead.innerHTML = '';
        let tr = document.createElement('tr');
        for(column in columnNames){
            const th = document.createElement('th');
            th.innerHTML = `<label>${column}</label> <span></span>`;
            tr.appendChild(th);
        }
        thead.appendChild(tr);
    }else{
        const columnHeaders = document.querySelectorAll(`#${tableId} thead tr th`)
        Array.from(columnHeaders).forEach(header => {
            let span = document.createElement('span');
            header.appendChild(span);
        })

    }
    
}

// Generates the buttons for switching between pages
const addPaginator = (options) =>{
    const paginatorContainer = document.querySelector('#paginator');
    paginatorContainer.innerHTML = pages.length > 1 ? `<button onclick="previousPage()" class="paginator-button">${options.previousText}</button>` : '';
    for(let i = 0; i < pages.length; i++){
        const paginatorButton = `<button onclick="showPage(${i})" class="paginator-button">${i+1}</button>`;
        paginatorContainer.innerHTML += paginatorButton;
    }
    paginatorContainer.innerHTML = pages.length > 1 ? `${paginatorContainer.innerHTML}<button onclick="nextPage()" class="paginator-button">${options.nextText}</button>` : '';
}

const nextPage = () => {
    if(currentPage < pages.length-1){
        showPage(currentPage+1)
    }
}
const previousPage = () => {
    if(currentPage > 0){showPage(currentPage-1)}; 
}

// Populates the table with the visible rows
const showPage = (page) => {
    // clears the records of the tbody and iterates the records of the selected page to add new rows
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = '';

    // do nothing if no records
    if(pages.length < 1 || page >= pages.length) return;

    // adds a CSS class to the clicked page button
    const paginatorButtons = document.querySelectorAll('#paginator button');
    Array.from(paginatorButtons).forEach((button, index) => {
        if(index-1 == page){
            button.classList.add('active-paginator-button');
        }else{
            button.classList.remove('active-paginator-button');
        }
    });

    pages[page].forEach(record => {
        const tr = document.createElement('tr');
        Object.values(record).forEach(field => {
            const td = document.createElement('td');
            // if the current element is an iterable, content is added as a list of items
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

    if(pages.length > 1){
        paginatorButtons[pages.length+1].disabled = (page+1) == pages.length ? true : false;
        paginatorButtons[0].disabled = page == 0 ? true : false;
    }
    currentPage = page;
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

const sort = (clickedColumnIndex) =>{
    if(pages.length < 1) return;
    let arrow = '';

    const columnName = Object.keys(data[0])[clickedColumnIndex]; 
    columnSortingState[columnName] = !columnSortingState[columnName];

    let sortedData = data.sort(function(a,b){
        let fieldA = typeof a[columnName] == "number" ? Number(a[columnName]) : String(a[columnName]).toLowerCase();
        let fieldB = typeof b[columnName] == "number" ? Number(b[columnName]) : String(b[columnName]).toLowerCase();

        if(columnSortingState[columnName]){
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

    const tableHeaders = document.querySelectorAll(`#${tableId} thead tr th`);

    Array.from(tableHeaders).forEach((header, index) => {

        if(index == clickedColumnIndex){
            header.classList.add('active-sort')
            document.querySelectorAll(`#${tableId} thead th span`)[index].innerHTML = arrow 
        }else{
            document.querySelectorAll(`#${tableId} thead th span`)[index].innerHTML = ""
            header.classList.remove('active-sort')
        }

    });
    
    data = sortedData;
    loadTable(data, options);
}

const addColumnSorting = () => {
    const tableHeaders = Array.from(document.querySelectorAll('thead tr th'));
    tableHeaders.forEach((header, i) => {
        header.addEventListener('click',()=>{sort(i)});
    })
}
