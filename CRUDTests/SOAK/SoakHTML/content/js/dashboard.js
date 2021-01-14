/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 83.78839883793556, "KoPercent": 16.21160116206444};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.834072835738863, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8348383704448813, 500, 1500, "Read"], "isController": true}, {"data": [0.8343617387315059, 500, 1500, "Delete"], "isController": true}, {"data": [0.8329523112797769, 500, 1500, "HTTP Request - List Create"], "isController": false}, {"data": [0.833234434909622, 500, 1500, "Create"], "isController": true}, {"data": [0.8344288200806156, 500, 1500, "Update"], "isController": true}, {"data": [0.8343025923376921, 500, 1500, "HTTP Request - List Read"], "isController": false}, {"data": [0.8341667622433765, 500, 1500, "HTTP Request - List Update"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 174517, 28292, 16.21160116206444, 18.866832457583225, 0, 4537, 1.0, 5.0, 86.0, 374.9800000000032, 564.7781075142152, 303.1838956932987, 108.78058191963781], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Read", 43742, 7073, 16.169813908829042, 21.776576288235532, 0, 3643, 1.0, 18.0, 63.95000000000073, 299.0, 142.179663452006, 101.47613862553753, 23.685321942456273], "isController": true}, {"data": ["Delete", 43595, 7073, 16.22433765340062, 14.417433191879757, 0, 3587, 1.0, 4.0, 21.0, 92.9900000000016, 142.80707041589142, 49.82544575513804, 28.247020408234295], "isController": true}, {"data": ["HTTP Request - List Create", 43742, 7073, 16.169813908829042, 21.18840016460152, 0, 3391, 1.0, 10.0, 35.0, 185.0, 141.559412429086, 87.4207261364041, 27.001951070748962], "isController": false}, {"data": ["Create", 43816, 7073, 16.142505020996897, 21.152729596494613, 0, 3391, 1.0, 10.0, 35.0, 185.0, 141.5007815224833, 87.23693629259621, 26.945183247040227], "isController": true}, {"data": ["Update", 43664, 7073, 16.19869915720044, 17.97123488457309, 0, 4537, 1.0, 12.0, 43.0, 188.9900000000016, 142.41403266155467, 66.01875153906242, 30.527803239125046], "isController": true}, {"data": ["HTTP Request - List Read", 87180, 14146, 16.226198669419592, 18.135661849048418, 0, 3643, 1.0, 36.0, 92.0, 321.0, 283.8518942995194, 151.17197801963, 51.80145593954717], "isController": false}, {"data": ["HTTP Request - List Update", 43595, 7073, 16.22433765340062, 17.99961004702365, 0, 4537, 1.0, 12.0, 43.0, 188.9900000000016, 142.44683770961038, 66.13847421653423, 30.583164333600728], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404", 7552, 26.693058108299166, 4.327372118475564], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 17712, 62.604269758235546, 10.14915452362807], "isController": false}, {"data": ["Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 3028, 10.70267213346529, 1.7350745199608062], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 174517, 28292, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 17712, "404", 7552, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 3028, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request - List Create", 43742, 7073, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7073, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request - List Read", 87180, 14146, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7099, "404", 4019, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 3028, null, null, null, null], "isController": false}, {"data": ["HTTP Request - List Update", 43595, 7073, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3540, "404", 3533, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
