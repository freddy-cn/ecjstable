let pages = [];

const loadTable = (data,options) => {
    paginate(data,options);
    createLinks(options);
    populateTable(options.currentPage-1);
}

const paginate = (data,options) => {
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

const createLinks = (options) =>{
    const linksContainer = document.querySelector('#links-container');
    for(let i = 0; i < pages.length; i++){
        const linkButton = `<button onclick="populateTable(${i})" class="table-link">${i+1}</button>`;
        linksContainer.innerHTML += linkButton;
    }
}

function populateTable(page){
    const tableBody = document.querySelector('#table-body');
    tableBody.innerHTML = '';
    pages[page].forEach(user => {
        const tr = document.createElement('tr');
        Object.values(user).forEach(field => {
            const td = document.createElement('td');
            td.innerHTML = field;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}
