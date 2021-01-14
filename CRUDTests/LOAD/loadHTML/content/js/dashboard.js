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

    var data = {"OkPercent": 98.95093727735056, "KoPercent": 1.0490627226494362};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9327199469326585, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9452041220768926, 500, 1500, "Read List"], "isController": true}, {"data": [0.9418672360248447, 500, 1500, "HTTP Request - Item Create"], "isController": false}, {"data": [0.9418672360248447, 500, 1500, "Create Item"], "isController": true}, {"data": [0.9461232604373757, 500, 1500, "Update List"], "isController": true}, {"data": [0.9388560157790927, 500, 1500, "Delete Item"], "isController": true}, {"data": [0.8870806709265175, 500, 1500, "Delete List"], "isController": true}, {"data": [0.9185013518733102, 500, 1500, "HTTP Request - List Create"], "isController": false}, {"data": [0.9419512195121951, 500, 1500, "Read Item"], "isController": true}, {"data": [0.9185013518733102, 500, 1500, "Create List"], "isController": true}, {"data": [0.9388560157790927, 500, 1500, "HTTP Request - Item Delete"], "isController": false}, {"data": [0.9419512195121951, 500, 1500, "HTTP Request - ItemRead"], "isController": false}, {"data": [0.9417942677659992, 500, 1500, "Update Item"], "isController": true}, {"data": [0.9417942677659992, 500, 1500, "HTTP Request - Item Update"], "isController": false}, {"data": [0.9162522379152576, 500, 1500, "HTTP Request - List Read"], "isController": false}, {"data": [0.9461232604373757, 500, 1500, "HTTP Request - List Update"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40703, 427, 1.0490627226494362, 172.23504409994243, 0, 13634, 2.0, 303.8000000000029, 776.0, 2037.950000000008, 1027.4124744427897, 364.01895315615775, 234.18258142022367], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Read List", 5046, 21, 0.4161712247324614, 153.0671819262783, 0, 8471, 1.0, 263.3000000000002, 969.2999999999993, 3000.069999999995, 127.94766468887875, 100.5460707312744, 23.487098222209543], "isController": true}, {"data": ["HTTP Request - Item Create", 5152, 22, 0.42701863354037267, 166.29231366459612, 0, 9586, 2.0, 386.6999999999998, 1036.7499999999864, 3246.8200000000015, 130.53943801150328, 41.955467740454054, 40.793574378594776], "isController": false}, {"data": ["Create Item", 5152, 22, 0.42701863354037267, 166.292507763975, 0, 9586, 2.0, 386.6999999999998, 1036.7499999999864, 3246.8200000000015, 130.53613053613054, 41.95440471552903, 40.79254079254079], "isController": true}, {"data": ["Update List", 5030, 20, 0.3976143141153082, 154.30616302186877, 0, 12342, 2.0, 274.90000000000055, 900.3499999999995, 3404.029999999965, 127.5872564935065, 38.51050835151177, 29.775470882267147], "isController": true}, {"data": ["Delete Item", 5070, 21, 0.41420118343195267, 167.4506903353055, 0, 10782, 3.0, 372.90000000000055, 944.0, 2990.58, 128.51385262730983, 24.067014104522066, 27.35610215045246], "isController": true}, {"data": ["Delete List", 5008, 301, 6.01038338658147, 163.51138178913732, 0, 11405, 2.0, 338.2000000000007, 884.5500000000002, 3257.819999999985, 127.0807957775071, 24.99234768321153, 27.05111331296945], "isController": true}, {"data": ["HTTP Request - List Create", 5178, 0, 0.0, 252.40266512166923, 1, 13634, 3.0, 629.0, 1400.250000000001, 5193.52, 130.7212642952715, 38.93553282232209, 29.744193926560808], "isController": false}, {"data": ["Read Item", 5125, 21, 0.4097560975609756, 161.05424390243917, 0, 10890, 2.0, 336.8000000000011, 951.6999999999998, 3459.439999999988, 129.86519359416175, 57.42105344427833, 23.839146714410603], "isController": true}, {"data": ["Create List", 5178, 0, 0.0, 252.40266512166917, 1, 13634, 3.0, 629.0, 1400.250000000001, 5193.52, 130.2281129750258, 38.78864693103795, 29.63198273748145], "isController": true}, {"data": ["HTTP Request - Item Delete", 5070, 21, 0.41420118343195267, 167.45069033530567, 0, 10782, 3.0, 372.90000000000055, 944.0, 2990.58, 128.51385262730983, 24.067014104522066, 27.35610215045246], "isController": false}, {"data": ["HTTP Request - ItemRead", 5125, 21, 0.4097560975609756, 161.05424390243917, 0, 10890, 2.0, 336.8000000000011, 951.6999999999998, 3459.439999999988, 129.86519359416175, 57.42105344427833, 23.839146714410603], "isController": false}, {"data": ["Update Item", 5094, 21, 0.4122497055359246, 158.03435414212868, 0, 13006, 2.0, 314.5, 887.5, 3247.8500000000104, 129.08948075314868, 39.00565491086136, 33.02546244234814], "isController": true}, {"data": ["HTTP Request - Item Update", 5094, 21, 0.4122497055359246, 158.03435414212868, 0, 13006, 2.0, 314.5, 887.5, 3247.8500000000104, 129.08948075314868, 39.00565491086136, 33.02546244234814], "isController": false}, {"data": ["HTTP Request - List Read", 10054, 322, 3.2027053908891983, 158.26924607121512, 0, 11405, 2.0, 304.5, 927.5, 3111.100000000013, 254.93179167300573, 125.51940704396775, 50.51763408704802], "isController": false}, {"data": ["HTTP Request - List Update", 5030, 20, 0.3976143141153082, 154.3061630218688, 0, 12342, 2.0, 274.90000000000055, 900.3499999999995, 3404.029999999965, 127.59049285949826, 38.51148520533698, 29.776226163977878], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 311, 72.83372365339578, 0.7640714443652802], "isController": false}, {"data": ["404", 82, 19.20374707259953, 0.20145935189052405], "isController": false}, {"data": ["Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 34, 7.962529274004684, 0.08353192639363193], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40703, 427, "500", 311, "404", 82, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 34, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["HTTP Request - Item Create", 5152, 22, "500", 22, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request - Item Delete", 5070, 21, "404", 21, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Request - ItemRead", 5125, 21, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 13, "500", 8, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request - Item Update", 5094, 21, "404", 21, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Request - List Read", 10054, 322, "500", 281, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 21, "404", 20, null, null, null, null], "isController": false}, {"data": ["HTTP Request - List Update", 5030, 20, "404", 20, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
