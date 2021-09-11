## ECJSTable
### An easy to use JS table pager 

## Introduction
EasyTable aims to be a small and easy to use Javascript plugin to populate basic tables with dynamic data.

It works out-of-the-box, you just need to import the script.js file into your assets folder and call it from your html.
The required HTML is this:
~~~html
    <!-- an input element to filter the table results -->
    <label>Buscar:</label><input type="text" onkeyup="filter(event)">

    <!-- the minimum table structure -->
    <table id="simple-table">
        <!-- you can set the <thead> tag with your own column names or you can tell the plugin to get the column names -->
        <thead>
            <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column n</th>
            </tr>
        </thead>

        <!-- the tbody is mandatory -->
        <tbody></tbody>
    </table>

    <!-- the pager buttons container -->
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
