let pages = [];
let timeout = undefined

const loadTable = (data,options) => {
    paginate(data,options);
    createLinks(options);
    populateTable(options.currentPage-1);
}

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

const createLinks = (options) =>{
    const linksContainer = document.querySelector('#links-container');
    linksContainer.innerHTML = "";
    for(let i = 0; i < pages.length; i++){
        const linkButton = `<button onclick="populateTable(${i})" class="table-link">${i+1}</button>`;
        linksContainer.innerHTML += linkButton;
    }
}

const populateTable = (page) => {
    const tableBody = document.querySelector('#table-body');
    tableBody.innerHTML = '';
    if(pages.length < 1) return;
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

const filter = (evt) =>{
    
    if (timeout) clearTimeout(timeout);
     
    timeout = setTimeout(() => {
        let searchWord = evt.target.value;
        let filteredData = DATA.filter(row => {
            let wordCount = 0;
            Object.values(row).forEach(field => {
                let fieldText = String(field).toLowerCase();
                if(fieldText.includes(String(searchWord).toLowerCase())){
                    wordCount++;
                }
            });
            if(wordCount > 0) return true;
        });
        
        loadTable(filteredData,options)
    }, 300); 
}

