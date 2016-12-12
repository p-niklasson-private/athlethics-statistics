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
    addTimeColumn();
    addGenderColumn();
    finished();
}

function addTimeColumn() {
    data.insertColumn(4, 'number', 'Tid [s,h]');
      
    var formatter = new google.visualization.NumberFormat({pattern:'###,##'});  
    formatter.format(data, 2);
      
    var rows = data.getNumberOfRows();
    var time;
    for(var i = 0; i < rows; i++) {
        if (data.getValue(i,3)) {
            var time_string = data.getValue(i,3);
            var time_array = time_string.split(/[,.]/);
            if (time_array.length == 3) {
                time = Number(time_array[0])*60 + Number(time_array[1]) + Number(time_array[2])/100;
            }
            else {
                time = Number(time_array[0]) + Number(time_array[1])/100;
            }
            data.setValue(i,4,time);
        }
    }
}

function addGenderColumn() {
    data.insertColumn(9, 'string', 'Kön');
    var rows = data.getNumberOfRows();
    var gender;
    for(var i = 0; i < rows; i++) {
        if (data.getValue(i,8)) {
            if (data.getValue(i,8).match(/P\/F/)) {
                gender = 'Mixed';
            }
            else if (data.getValue(i,8).match(/P|M/)) {
                gender = 'Män';
            }
            else if (data.getValue(i,8).match(/F|K/)) {
                gender = 'Kvinnor';
            }
            data.setValue(i,9,gender);
        }
    }    
}
  
function clearFilter() {
    view = new google.visualization.DataView(data);
    table = new google.visualization.Table(document.getElementById('table_div'));

    bookmarkUrl = window.location.href.split("?")[0];
    document.getElementById('bookmarkUrl').innerHTML = '<a href="' + bookmarkUrl + '">' + bookmarkUrl + '</a>';
    populateSelections();
    if (arguments[0] == 'clear') {
        view.setRows([]);   
    }
    table.draw(view, {showRowNumber: true, width: '1800', height: '100%'});
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

function menu () {
    var option_1 = '';  // Resultat
    var option_2 = '';  // Personbästa
    var option_3 = '';  // Statistik
    var option_31 = ''; // Trender
    var option_32 = ''; // Födelseår
    var option_33 = ''; // Grenar
    var option_34 = ''; // Tävlingar
    var option_35 = ''; // Könsfördelning
    var option_4 = '';  // Kartor
    var option_41 = ''; // Inomhus 2016-2017
    var option_42 = ''; // Utomhus 2016
    var active = 'class="w3-green"';
    
    for (i = 0; i < arguments.length; i++) {
        if (arguments[i] == '1') { option_1 = active; }
        if (arguments[i] == '2') { option_2 = active; }
        if (arguments[i] == '3') { option_3 = active; }
        if (arguments[i] == '31') { option_31 = active; }
        if (arguments[i] == '32') { option_32 = active; }
        if (arguments[i] == '33') { option_33 = active; }
        if (arguments[i] == '34') { option_34 = active; }
        if (arguments[i] == '35') { option_35 = active; }
        if (arguments[i] == '4') { option_4 = active; }
        if (arguments[i] == '41') { option_41 = active; }
        if (arguments[i] == '42') { option_42 = active; }
    }  
      
    var menuString = 
        '<ul class="w3-navbar w3-round-large w3-light-grey w3-medium w3-margin">' +
        '<li><a ' + option_1 + 'href="index.html"><i class="fa fa-table"></i> Resultat</a></li>' +
        '<li><a ' + option_2 + 'href="pb.html"><i class="fa fa-table"></i> Personbästa</a></li>' +
        '<li class="w3-dropdown-hover">' +
          '<a ' + option_3 + ' href="#"><i class="fa fa-bar-chart"></i> Statistik <i class="fa fa-caret-down"></i></a>' +
          '<div class="w3-dropdown-content w3-white w3-card-4">' +
            '<a ' + option_31 + 'href="trends.html"><i class="fa fa-line-chart"></i> Resultat, trender per tävlande och gren</a>' +
            '<a ' + option_32 + 'href="stats.html?graph=1"><i class="fa fa-pie-chart"></i> Födelseår</a>' +
            '<a ' + option_33 + 'href="stats.html?graph=2"><i class="fa fa-pie-chart"></i> Populära grenar</a>' +
            '<a ' + option_34 + 'href="stats.html?graph=3"><i class="fa fa-pie-chart"></i> Populära tävlingar</a>' +
            '<a ' + option_35 + 'href="stats.html?graph=4"><i class="fa fa-pie-chart"></i> Könsfördelning</a>' +
          '</div>' +
        '</li>' +    
        '<li class="w3-dropdown-hover">' +
          '<a ' + option_4 + 'href="#"><i class="fa fa-map"></i> Kartor <i class="fa fa-caret-down"></i></a>' +
          '<div class="w3-dropdown-content w3-white w3-card-4">' +
            '<a ' + option_41 + 'href="map.html?map=1"><i class="fa fa-map-marker"></i> Inomhustävlingar 2016-2017</a>' +
            '<a ' + option_42 + 'href="map.html?map=2"><i class="fa fa-map-marker"></i> Utomhustävlingar 2016</a>' +
          '</div>' +
        '</li>' +
        '<li class="w3-dropdown-hover">' +
          '<a href="#"><i class="fa fa-link"></i> Länkar <i class="fa fa-caret-down"></i></a>' +
          '<div class="w3-dropdown-content w3-white w3-card-4">' +
            '<a href="https://hanvikenssk.myclub.se/friidrott" target="_blank">Hanviken SK friidrott</a>' +
            '<a href="http://friidrott.se" target="_blank">Friidrott.se</a>' +
          '</div>' +
        '</li>' +
      '</ul>';
    document.getElementById('menu').innerHTML = menuString;
}

function updateUrl(url,key,value){
      if(value!=undefined){
        value = encodeURI(value);
      }
      var urls = url.split('?');
      var baseUrl = urls[0];
      var parameters = '';
      var outPara = {};
      if(urls.length>1){
          parameters = urls[1];
      }
      if(parameters!=''){
        parameters = parameters.split('&');
        for(k in parameters){
          var keyVal = parameters[k];
          keyVal = keyVal.split('=');
          var ekey = keyVal[0];
          var eval = '';
          if(keyVal.length>1){
              eval = keyVal[1];
          }
          outPara[ekey] = eval;
        }
      }
      if(value!=undefined){
        outPara[key] = value;
      }else{
        delete outPara[key];
      }
      parameters = [];
      for(var k in outPara){
        parameters.push(k + '=' + outPara[k]);
      }
      var finalUrl = baseUrl;
      if(parameters.length>0){
        finalUrl += '?' + parameters.join('&'); 
      }
      return finalUrl; 
  }
