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

    var data = {"OkPercent": 99.98297367510477, "KoPercent": 0.017026324895233178};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9998298764409054, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9986385595081247, 500, 1500, "Delete"], "isController": true}, {"data": [1.0, 500, 1500, "HTTP Request - Item Create"], "isController": false}, {"data": [1.0, 500, 1500, "Create Item"], "isController": true}, {"data": [1.0, 500, 1500, "Delete Item"], "isController": true}, {"data": [1.0, 500, 1500, "Update"], "isController": true}, {"data": [1.0, 500, 1500, "Read"], "isController": true}, {"data": [1.0, 500, 1500, "HTTP Request - List Create"], "isController": false}, {"data": [1.0, 500, 1500, "Read Item"], "isController": true}, {"data": [1.0, 500, 1500, "Create"], "isController": true}, {"data": [1.0, 500, 1500, "HTTP Request - Item Delete"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request - ItemRead"], "isController": false}, {"data": [1.0, 500, 1500, "Update Item"], "isController": true}, {"data": [1.0, 500, 1500, "HTTP Request - Item Update"], "isController": false}, {"data": [0.9993156732891832, 500, 1500, "HTTP Request - List Read"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request - List Update"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 182071, 31, 0.017026324895233178, 0.9553470898715288, 0, 136, 1.0, 1.0, 2.0, 2.0, 589.3581414620093, 163.07271144790423, 134.67859669210117], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete", 22770, 31, 0.13614404918752745, 0.9263065436978442, 0, 18, 1.0, 1.0, 2.0, 2.0, 74.47553133728879, 13.743742599873094, 15.726556903909557], "isController": true}, {"data": ["HTTP Request - Item Create", 22800, 0, 0.0, 0.8122807017543877, 0, 90, 1.0, 1.0, 1.0, 2.0, 74.57145940925012, 24.019370871791054, 23.365509948789356], "isController": false}, {"data": ["Create Item", 22800, 0, 0.0, 0.812324561403511, 0, 90, 1.0, 1.0, 1.0, 2.0, 74.57194721091105, 24.019527992076732, 23.365662791909923], "isController": true}, {"data": ["Delete Item", 22800, 0, 0.0, 1.0088157894736831, 0, 16, 1.0, 1.0, 2.0, 3.0, 74.57243501895383, 13.909506922480645, 15.936149677793114], "isController": true}, {"data": ["Update", 22800, 0, 0.0, 0.8641228070175397, 0, 24, 1.0, 1.0, 1.0, 2.0, 74.57341065418544, 22.250474720676788, 17.4434647229745], "isController": true}, {"data": ["Read", 22800, 0, 0.0, 0.7419298245614075, 0, 19, 1.0, 1.0, 1.0, 2.0, 74.57267892536845, 22.27860060524887, 13.751455347768706], "isController": true}, {"data": ["HTTP Request - List Create", 22800, 0, 0.0, 1.4391228070175428, 0, 136, 1.0, 2.0, 2.0, 3.0, 74.53001958047444, 22.26077725432879, 16.9584907834478], "isController": false}, {"data": ["Read Item", 22800, 0, 0.0, 0.834517543859645, 0, 29, 1.0, 1.0, 1.0, 2.0, 74.57194721091105, 24.019527992076732, 13.75132041713683], "isController": true}, {"data": ["Create", 22800, 0, 0.0, 1.4391666666666634, 0, 136, 1.0, 2.0, 2.0, 3.0, 74.49349325474488, 22.24986749735352, 16.950179617534722], "isController": true}, {"data": ["HTTP Request - Item Delete", 22800, 0, 0.0, 1.0085526315789495, 0, 16, 1.0, 1.0, 2.0, 3.0, 74.57243501895383, 13.909506922480645, 15.936149677793114], "isController": false}, {"data": ["HTTP Request - ItemRead", 22800, 0, 0.0, 0.8344736842105297, 0, 29, 1.0, 1.0, 1.0, 2.0, 74.57170330928287, 24.01944943167695, 13.75127544084796], "isController": false}, {"data": ["Update Item", 22800, 0, 0.0, 1.0037280701754367, 0, 61, 1.0, 1.0, 2.0, 3.0, 74.57194721091105, 22.27838200542936, 19.140308789800322], "isController": true}, {"data": ["HTTP Request - Item Update", 22800, 0, 0.0, 1.0035526315789494, 0, 61, 1.0, 1.0, 2.0, 3.0, 74.57194721091105, 22.27838200542936, 19.140308789800322], "isController": false}, {"data": ["HTTP Request - List Read", 45300, 31, 0.0684326710816777, 0.8389624724061715, 0, 19, 1.0, 1.0, 1.0, 2.0, 148.1651076077713, 36.022399035945575, 29.47799933153987], "isController": false}, {"data": ["HTTP Request - List Update", 22771, 0, 0.0, 0.8652233103508796, 0, 24, 1.0, 1.0, 1.0, 2.0, 74.4785585090551, 22.250474720676788, 17.4434647229745], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 31, 100.0, 0.017026324895233178], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 182071, 31, "500", 31, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request - List Read", 45300, 31, "500", 31, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
