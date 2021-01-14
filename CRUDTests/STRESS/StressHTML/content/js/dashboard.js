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

    var data = {"OkPercent": 99.77549966225612, "KoPercent": 0.22450033774387093};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9724043390153773, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9758891380967638, 500, 1500, "Read List"], "isController": true}, {"data": [0.9755524212505877, 500, 1500, "HTTP Request - Item Create"], "isController": false}, {"data": [0.9755524212505877, 500, 1500, "Create Item"], "isController": true}, {"data": [0.9742990654205608, 500, 1500, "Update List"], "isController": true}, {"data": [0.9743139757498405, 500, 1500, "Delete Item"], "isController": true}, {"data": [0.9634166125892277, 500, 1500, "Delete List"], "isController": true}, {"data": [0.9711104189378601, 500, 1500, "HTTP Request - List Create"], "isController": false}, {"data": [0.9708477781279546, 500, 1500, "Read Item"], "isController": true}, {"data": [0.9711104189378601, 500, 1500, "Create List"], "isController": true}, {"data": [0.9743139757498405, 500, 1500, "HTTP Request - Item Delete"], "isController": false}, {"data": [0.9708477781279546, 500, 1500, "HTTP Request - ItemRead"], "isController": false}, {"data": [0.9736758642562638, 500, 1500, "Update Item"], "isController": true}, {"data": [0.9736758642562638, 500, 1500, "HTTP Request - Item Update"], "isController": false}, {"data": [0.9696920844752539, 500, 1500, "HTTP Request - List Read"], "isController": false}, {"data": [0.9742990654205608, 500, 1500, "HTTP Request - List Update"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50334, 113, 0.22450033774387093, 89.4929471132836, 0, 8648, 22.0, 190.0, 815.9000000000015, 2829.980000000003, 1653.6566134437217, 509.1584416991097, 378.38995971318747], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Read List", 6242, 7, 0.11214354373598205, 85.3093559756488, 0, 8291, 2.0, 118.0, 352.0, 1727.2599999999948, 206.49045618445862, 105.9018696347051, 38.11087733426511], "isController": true}, {"data": ["HTTP Request - Item Create", 6381, 11, 0.17238677323303558, 84.75097947030245, 0, 6848, 2.0, 155.80000000000018, 396.0, 1507.1800000000003, 214.79785909045006, 69.23209123691386, 67.33409450003366], "isController": false}, {"data": ["Create Item", 6381, 11, 0.17238677323303558, 84.75097947030244, 0, 6848, 2.0, 155.80000000000018, 396.0, 1507.1800000000003, 214.79062878685875, 69.22976081779319, 67.33182796931803], "isController": true}, {"data": ["Update List", 6206, 5, 0.08056719303899453, 89.26796648404756, 0, 6997, 2.0, 148.30000000000018, 378.64999999999964, 1769.7600000000093, 209.29448266558748, 62.70241309608121, 49.05257102176919], "isController": true}, {"data": ["Delete Item", 6268, 7, 0.11167836630504148, 86.91336949585195, 0, 5791, 5.0, 143.10000000000036, 389.5499999999993, 1636.1599999999817, 211.2358035924915, 39.44304770961817, 45.17525533523742], "isController": true}, {"data": ["Delete List", 6164, 67, 1.0869565217391304, 88.96787800129782, 0, 8648, 3.0, 137.0, 414.0, 1497.6000000000058, 207.98326416303945, 39.17766300359348, 44.47997198392213], "isController": true}, {"data": ["HTTP Request - List Create", 6421, 0, 0.0, 97.12490266313654, 0, 7331, 4.0, 211.0, 490.7999999999993, 1362.5599999999995, 215.0152362455212, 64.25259989368115, 48.92436527852192], "isController": false}, {"data": ["Read Item", 6346, 9, 0.1418216199180586, 92.64150646076249, 0, 7568, 3.0, 138.0, 440.64999999999964, 1667.9499999999962, 210.81655703939938, 74.39984002308816, 38.90901793277855], "isController": true}, {"data": ["Create List", 6421, 0, 0.0, 97.12490266313651, 0, 7331, 4.0, 211.0, 490.7999999999993, 1362.5599999999995, 214.0119321401193, 63.95278440905909, 48.69607440297637], "isController": true}, {"data": ["HTTP Request - Item Delete", 6268, 7, 0.11167836630504148, 86.91336949585191, 0, 5791, 5.0, 143.10000000000036, 389.5499999999993, 1636.1599999999817, 211.24292262065248, 39.44437701157657, 45.17677782294756], "isController": false}, {"data": ["HTTP Request - ItemRead", 6346, 9, 0.1418216199180586, 92.64150646076253, 0, 7568, 3.0, 138.0, 440.64999999999964, 1667.9499999999962, 210.81655703939938, 74.39984002308816, 38.90901793277855], "isController": false}, {"data": ["Update Item", 6306, 7, 0.11100539169045354, 90.7917856010149, 0, 6702, 3.0, 144.0, 399.64999999999964, 1705.1600000000035, 212.47346608713232, 63.70383151807676, 54.56967021083932], "isController": true}, {"data": ["HTTP Request - Item Update", 6306, 7, 0.11100539169045354, 90.79178560101488, 0, 6702, 3.0, 144.0, 399.64999999999964, 1705.1600000000035, 212.47346608713232, 63.70383151807676, 54.56967021083932], "isController": false}, {"data": ["HTTP Request - List Read", 12406, 74, 0.5964855714976625, 87.12695469933928, 0, 8648, 2.0, 125.0, 387.0, 1613.510000000002, 410.4006086870224, 144.3122834240299, 81.71976051556453], "isController": false}, {"data": ["HTTP Request - List Update", 6206, 5, 0.08056719303899453, 89.26796648404758, 0, 6997, 2.0, 148.30000000000018, 378.64999999999964, 1769.7600000000093, 209.29448266558748, 62.70241309608121, 49.05257102176919], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 79, 69.91150442477876, 0.1569515635554496], "isController": false}, {"data": ["404", 24, 21.238938053097346, 0.04768148766241507], "isController": false}, {"data": ["Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 10, 8.849557522123893, 0.019867286526006278], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50334, 113, "500", 79, "404", 24, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 10, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["HTTP Request - Item Create", 6381, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request - Item Delete", 6268, 7, "404", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Request - ItemRead", 6346, 9, "500", 6, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request - Item Update", 6306, 7, "404", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Request - List Read", 12406, 74, "500", 62, "Expected to find an object with property ['id'] in path $ but found 'net.minidev.json.JSONArray'. This is not a json object according to the JsonProvider: 'com.jayway.jsonpath.spi.json.JsonSmartJsonProvider'.", 7, "404", 5, null, null, null, null], "isController": false}, {"data": ["HTTP Request - List Update", 6206, 5, "404", 5, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
