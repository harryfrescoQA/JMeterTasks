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

    var data = {"OkPercent": 99.66171461014383, "KoPercent": 0.33828538985616957};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9785969436033308, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9831235697940504, 500, 1500, "Read List"], "isController": true}, {"data": [0.982665171479301, 500, 1500, "HTTP Request - Item Create"], "isController": false}, {"data": [0.982665171479301, 500, 1500, "Create Item"], "isController": true}, {"data": [0.9813625910310464, 500, 1500, "Update List"], "isController": true}, {"data": [0.9809808385505596, 500, 1500, "Delete Item"], "isController": true}, {"data": [0.9637415621986499, 500, 1500, "Delete List"], "isController": true}, {"data": [0.9757038000557465, 500, 1500, "HTTP Request - List Create"], "isController": false}, {"data": [0.9802835414515069, 500, 1500, "Read Item"], "isController": true}, {"data": [0.9757038000557465, 500, 1500, "Create List"], "isController": true}, {"data": [0.9809808385505596, 500, 1500, "HTTP Request - Item Delete"], "isController": false}, {"data": [0.9802835414515069, 500, 1500, "HTTP Request - ItemRead"], "isController": false}, {"data": [0.9806947984518078, 500, 1500, "Update Item"], "isController": true}, {"data": [0.9806947984518078, 500, 1500, "HTTP Request - Item Update"], "isController": false}, {"data": [0.9734873909291399, 500, 1500, "HTTP Request - List Read"], "isController": false}, {"data": [0.9813625910310464, 500, 1500, "HTTP Request - List Update"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 84544, 286, 0.33828538985616957, 76.72536194171036, 0, 11946, 1.0, 9.0, 17.0, 38.0, 1820.734806391868, 557.7588325970733, 416.58723184385366], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Read List", 10488, 13, 0.12395118230358505, 74.58914950419529, 0, 8772, 1.0, 191.0, 367.0, 1278.4200000000128, 227.3623967569208, 115.00929289329923, 41.96297255387067], "isController": true}, {"data": ["HTTP Request - Item Create", 10701, 14, 0.1308288944958415, 74.12867956265771, 0, 7726, 1.0, 195.0, 376.0, 1156.3199999999852, 231.48809137517034, 74.60893559229456, 72.5660911439743], "isController": false}, {"data": ["Create Item", 10701, 14, 0.1308288944958415, 74.12895991028867, 0, 7726, 1.0, 195.0, 376.0, 1156.3199999999852, 231.48308384528858, 74.60732165841048, 72.56452140072034], "isController": true}, {"data": ["Update List", 10436, 7, 0.06707550785741663, 71.42286316596372, 0, 11946, 1.0, 190.3000000000011, 370.14999999999964, 1399.599999999984, 226.24983740189913, 67.93979568193645, 53.026564634100076], "isController": true}, {"data": ["Delete Item", 10542, 13, 0.1233162587744261, 77.3970783532539, 0, 10790, 2.0, 196.0, 376.0, 1237.3999999999942, 228.35481425322212, 42.644399673724685, 48.83622688319073], "isController": true}, {"data": ["Delete List", 10370, 212, 2.0443587270973964, 67.3048216007717, 0, 7802, 1.0, 183.89999999999964, 368.0, 1006.9299999999839, 224.84334684850717, 42.71690736052991, 48.085873131274255], "isController": true}, {"data": ["HTTP Request - List Create", 10763, 0, 0.0, 93.22131376010367, 0, 9513, 2.0, 274.60000000000036, 442.0, 1493.8800000000047, 231.80633628394824, 69.27025283485172, 52.74499643960932], "isController": false}, {"data": ["Read Item", 10651, 14, 0.13144305698995398, 77.23772415735712, 0, 8912, 1.0, 194.0, 382.0, 1327.4799999999996, 230.65595426294473, 79.53347310349308, 42.570761181161615], "isController": true}, {"data": ["Create List", 10763, 0, 0.0, 93.22140667100271, 0, 9513, 2.0, 274.60000000000036, 442.0, 1493.8800000000047, 229.58128026279303, 68.60534351602995, 52.23870927854568], "isController": true}, {"data": ["HTTP Request - Item Delete", 10542, 13, 0.1233162587744261, 77.3970783532539, 0, 10790, 2.0, 196.0, 376.0, 1237.3999999999942, 228.35976085261242, 42.645323432490684, 48.83728476870505], "isController": false}, {"data": ["HTTP Request - ItemRead", 10651, 14, 0.13144305698995398, 77.23763026945862, 0, 8912, 1.0, 194.0, 382.0, 1327.4799999999996, 230.65595426294473, 79.53347310349308, 42.570761181161615], "isController": false}, {"data": ["Update Item", 10593, 13, 0.12272255262909469, 77.96573208722762, 0, 8797, 1.0, 194.0, 375.59999999999854, 1362.119999999999, 229.4346978557505, 68.94611625514403, 58.92570087448559], "isController": true}, {"data": ["HTTP Request - Item Update", 10593, 13, 0.12272255262909469, 77.96554328329968, 0, 8797, 1.0, 194.0, 375.59999999999854, 1362.119999999999, 229.4346978557505, 68.94611625514403, 58.92570087448559], "isController": false}, {"data": ["HTTP Request - List Read", 20858, 225, 1.0787227922140186, 70.96754242976313, 0, 8772, 1.0, 195.0, 376.0, 1185.9700000000048, 452.1569477563408, 157.7153729947973, 90.03855442499457], "isController": false}, {"data": ["HTTP Request - List Update", 10436, 7, 0.06707550785741663, 71.42286316596369, 0, 11946, 1.0, 190.3000000000011, 370.14999999999964, 1399.599999999984, 226.25474254742548, 67.94126863143632, 53.027714261517616], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 229, 80.06993006993007, 0.27086487509462526], "isController": false}, {"data": ["404", 40, 13.986013986013987, 0.047312641937925816], "isController": false}, {"data": ["Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 17, 5.944055944055944, 0.02010787282361847], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 84544, 286, "500", 229, "404", 40, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 17, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["HTTP Request - Item Create", 10701, 14, "500", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request - Item Delete", 10542, 13, "404", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Request - ItemRead", 10651, 14, "500", 10, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 4, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request - Item Update", 10593, 13, "404", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Request - List Read", 20858, 225, "500", 205, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 13, "404", 7, null, null, null, null], "isController": false}, {"data": ["HTTP Request - List Update", 10436, 7, "404", 7, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
