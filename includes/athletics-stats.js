function initiateData() {
    docList = [
//               "1uAU9FptFO_GopSXXvJ9XZZyDps5rKnlYyKHdNeE6s8Y", // Development data
               "1WbKxsWGzVrk48C5YrZ_KS-Aw9To4RZA42c0mJy4sALk", // Inomhus 2016-2017
               "1kgJxJ8skKZ5bGXEiIht3FTnTVRjAFPvlitZEFEK-Eto", // Utomhus 2016
               "1TB8Bwit9Qxdvl1QnaRyMX5fhKaZaQtrltjfubab4tN8", // Inomhus 2015-2016
               "13qz03TyakxsCM4Bsr_HDjePukusZ_TV7d_aKwGO2l9M", // Utomhus 2015
               "1lUsY9HwXjM3mxrQ_YVfhSw1JvJJdaU8Jmj53xUn9U_M", // Inomhus 2014-2015
              ];
    var queryString = encodeURIComponent('SELECT *');
    for (i = 0; i < docList.length; i++) { 
        var queryUrl = "https://docs.google.com/spreadsheets/d/" + docList[i] + "/gviz/tq?headers=1&tq=" + queryString;
        var query = new google.visualization.Query(queryUrl);
        query.send(handleQueryResponse);
        console.log(docList[i]);
    }
}

function handleQueryResponse(response) {
    if (response.isError()) {
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
    }
    dataList.push(response.getDataTable());
    collectData();
}

function collectData() {
    if (dataList.length != docList.length) {
        //do nothing if data tables are not fully ready
        return;
    }
    var json = JSON.parse(dataList[0].toJSON());
    for (i = 1; i < dataList.length; i++) { 
        var json2 = JSON.parse(dataList[i].toJSON());
        var mergedRows = json.rows.concat(json2.rows);
        json.rows = mergedRows;
    }
    data = new google.visualization.DataTable(json);
    console.log(json);
    finished();
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}
