## ECJSTable
### An easy to use JS table pager 

## Introduction
EasyTable aims to be a small and easy to use Javascript plugin to populate basic tables with dynamic data.

It works out-of-the-box, you just need to import the script.js file into your assets folder and call it from your html.
The required HTML is this:
~~~html
    <!-- an input element to filter the table results -->
    <label>Buscar:</label><input type="text" onkeyup="filter(event)">

    <!-- the table -->
    <table id="simple-table">
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Gere</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <div id="pager"></div>
~~~

The required Javascript code is:
~~~js
// the required options
const options = {
    tableId:'easy-table',
    currentPage:1,
    perPage:10,
    useHeaders:true,
}
// the data to feed the table with
let data = DATA; 

// create or update the table
setTable(data, options);

~~~
