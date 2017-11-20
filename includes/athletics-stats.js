function initiateData() {
    dbGetJsonData();
    //sessionGetJsonData();
}

function getData(record){
    var today = new Date().toJSON().slice(0,10);
    if (record && record.date == today) {
        console.log("Cached data for '" + docs + "' is up-to-date: " + record.date);
        data = new google.visualization.DataTable(record.data);
        finished();
    }
    else {
        var seasons = [
                "1MY3ND5wMBZkyTDm46-BKAfqFbf1252afn7zUTai5m2g", // Inomhus 2017-2018
                "1pW3Ca1YEfCC6Wa2Ugho_a2GOGlQGo4WalLwRyPyHFB8", // Utomhus 2017
                "1WbKxsWGzVrk48C5YrZ_KS-Aw9To4RZA42c0mJy4sALk", // Inomhus 2016-2017
                "1kgJxJ8skKZ5bGXEiIht3FTnTVRjAFPvlitZEFEK-Eto", // Utomhus 2016
                "1TB8Bwit9Qxdvl1QnaRyMX5fhKaZaQtrltjfubab4tN8", // Inomhus 2015-2016
                "13qz03TyakxsCM4Bsr_HDjePukusZ_TV7d_aKwGO2l9M", // Utomhus 2015
                "1lUsY9HwXjM3mxrQ_YVfhSw1JvJJdaU8Jmj53xUn9U_M", // Inomhus 2014-2015
                "1iVA7smot7jP2jgXbQws5n6gMpWPtuHV7IDyegFCqVsM", // Utomhus 2014
                "1bVC4QJOLuRW5hk5lFeHO8UkqfL22kWwHX5MK2gAqBiI", // Inomhus 2013-2014
                "1ivuZjjD3o21ejcoRtov7VIcoaZdm_fpwoqDCxk7Wk-E", // Utomhus 2013
                "1CyqLx3YNUci24r-McL4l4-YCYeXjGpGqN0b_Hk1d5bc", // Inomhus 2012-2013
                "1D2awcgNWKyWT8ioCQxl-jIPW96pb5Tw--u1Mju0LKeg", // Utomhus 2012
                "1BqJOFrOltG0OQSIAjwlXBvVwPDUTcyjVP_QpFryGHW0", // Inomhus 2011-2012
                "1LQ84N0jwCASOfKPNCtWpiOYHT0lk1AVmQzfqWPOcfes", // Utomhus 2011
                "10v4m2zphT8L8JhNyzWdperRUZh6qcnpbJA1EYaeR23M", // Inomhus 2010-2011
                "1bH8aLZv1CIPyLyKpXnolFlMVDvjeHixNFpMJWAKlU7U", // Utomhus 2010
                "1n9bIvkTSy-I0k_8fDGxDVIlAhIqOQAQALceeKvbMuxI", // Inomhus 2009-2010
                "1pk1TyA5ZyOkaqYd1SKwT9umd-ICwd_lYEs6-nzNv06w", // Utomhus 2009
            ];
        if (docs == 'records') {
            docList = ["1QhmK7Lw-RpYGoiOQq1bh7Yl_75Vm2YWVDCM6AtitE3M"]; // Klubbrekord nya och gamla
        }
        else if (docs == 'gear') {
            docList = ["1KZcvNjq7CPFxQuTS0lcHmFt1VmwQCYwo8Thk5Cvtiu0"]; // Redskap
        }
        else if (docs == 'seasons') {
            docList = seasons;
        }   
        else if (docs == 'badges') {
            docList = seasons.concat(["1CwBhPL13W4nqSMIZx_ZFhPcQXQm5LzpBQ6fTtj4po5Q",   // Friidrottsmärken
                                      "1QhmK7Lw-RpYGoiOQq1bh7Yl_75Vm2YWVDCM6AtitE3M"]); // Klubbrekord
        }
        else {
            docList = seasons.concat(["1QhmK7Lw-RpYGoiOQq1bh7Yl_75Vm2YWVDCM6AtitE3M"]); // Klubbrekord
        }

        var queryString = encodeURIComponent('SELECT *');
        for (i = 0; i < docList.length; i++) { 
            var queryUrl = "https://docs.google.com/spreadsheets/d/" + docList[i] + "/gviz/tq?headers=1&tq=" + queryString;
            var query = new google.visualization.Query(queryUrl);
            query.send(handleQueryResponse);
            console.log(docList[i]);
        }
    }
}

function sessionStoreJsonData() {
    // Store the json data in local sessionStorage
    var today = new Date().toJSON().slice(0,10);
    if (sessionStorage) {
        console.log("Storing new data for '" + docs + "' in sessionStorage: " + today)
        sessionStorage.setItem(docs, data.toJSON());
        sessionStorage.setItem("date_" + docs, today);
    }
}

function sessionGetJsonData(){
    // Get json data from local sessionStorage
    record = {data: sessionStorage.getItem(docs), date: sessionStorage.getItem("date_" + docs)};
    getData(record);
}

function dbStoreJsonData() {
    // Store the json data in indexexedDB
    var today = new Date().toJSON().slice(0,10);
    console.log("Storing new data for '" + docs + "' in indexedDB Storage: " + today)
    var db = new ydn.db.Storage('athletics-stats');
    db.put('athletics-stats', {date: today, data: data.toJSON()}, docs);
}

function dbGetJsonData(){
    // Get json data from indexedDB
    var db = new ydn.db.Storage('athletics-stats');
    var req = db.get('athletics-stats', docs);
    req.done(function(record) {
        getData(record);
    });
    req.fail(function(e) {
        console.log(e.message);
    });
}

function fileStoreJsonData() {
    // Store the json data in an external file
    var jsonData = new FormData();
    jsonData.append("data" , data.toJSON());
    var xhr = new XMLHttpRequest();
    xhr.open( 'post', 'writeDataFile.php', true );
    xhr.send(jsonData);
}

function fileGetJsonData() {
    // Get the generated json data file from disc. easiest to do in PHP...
    var jsonData, result;
    $.ajax({
       url: "readDataFile.php",
       dataType: "json",
       async: true,
       success: function(result) {
           jsonData = result;
           data = new google.visualization.DataTable(jsonData);
           finished();
       }
    });
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

    addTimeColumn();
    addGenderColumn();

    //sessionStoreJsonData();
    dbStoreJsonData();
    
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

function filter(container, column, name) {
    var filter = new google.visualization.ControlWrapper({
          'controlType': 'CategoryFilter',
          'containerId': container,
          'options': {
            'filterColumnIndex': column,
            'ui': {'selectedValuesLayout': 'belowStacked', 'label': ''}
          }
        });
    if (localStorage) {
        var value = localStorage.getItem(name);
        if (value) {
            filter.setState({'selectedValues': value.split(",")});
        }
    }
    return filter;
}

function storeFilter(filter, name) {
    if (localStorage) {
        var values = filter.getState()['selectedValues'];
        localStorage.setItem(name, values);
        console.log("Stored values: " + name + ":" + values);
    }
}

function populateEventSelections() {
    var eventNo = eventForm.eventList.selectedIndex;
    var eventSelectionList=document.getElementById('eventList');
    eventSelectionList.innerHTML = '';
    var events = view.getDistinctValues(0); // Column 0 = events
    eventSelectionList.add(new Option("- Alla grenar -", 'all'));
    for(var i = 0; i < events.length; i++) {
        eventSelectionList.add(new Option(events[i], events[i]));
    }
    if (eventSelectionList.length == 2){
        if (eventNo) eventSelectionList.options.selectedIndex = 1;
        else eventSelectionList.options.selectedIndex = 0;
    }
}

function populateNameSelections() {
    var nameNo = nameForm.nameList.selectedIndex;
    var nameSelectionList=document.getElementById('nameList');
    nameSelectionList.innerHTML = '';
    var names = view.getDistinctValues(1); // Column 1 = names
    nameSelectionList.add(new Option("- Alla namn -", 'all'));
    for(var i = 0; i < names.length; i++) {
        nameSelectionList.add(new Option(names[i], names[i]));
    }
    if (nameSelectionList.length == 2){
        if (nameNo) nameSelectionList.options.selectedIndex = 1;
        else nameSelectionList.options.selectedIndex = 0;
    }
}

function populateYearSelections() {
    var yearNo = yearForm.yearList.selectedIndex;
    var yearSelectionList=document.getElementById('yearList');
    yearSelectionList.innerHTML = '';
    var years = view.getDistinctValues(2).reverse();
    
    yearSelectionList.add(new Option("- Alla födelseår -", 'all'));
    for(var i = 0; i < years.length; i++) {
        yearSelectionList.add(new Option(years[i], years[i]));
    }
    if (yearSelectionList.length == 2){
        if (yearNo) yearSelectionList.options.selectedIndex = 1;
        else yearSelectionList.options.selectedIndex = 0;
    }
}

function populateClassSelections(column) {
    if (! column) { 
        column = 8;
    }
    var classNo = classForm.classList.selectedIndex;
    var classSelectionList=document.getElementById('classList');
    classSelectionList.innerHTML = '';
    var classes = view.getDistinctValues(column);
    classSelectionList.add(new Option("- Alla klasser -", 'all'));
    for(var i = 0; i < classes.length; i++) {
        classSelectionList.add(new Option(classes[i], classes[i]));
    }
    if (classSelectionList.length == 2){
        if (classNo) classSelectionList.options.selectedIndex = 1;
        else classSelectionList.options.selectedIndex = 0;
    }
}

function populateGenderSelections() {
    var genderNo = genderForm.genderList.selectedIndex;
    var genderSelectionList=document.getElementById('genderList');
    genderSelectionList.innerHTML = '';
    var genders = view.getDistinctValues(9);
    genderSelectionList.add(new Option("- Alla kön -", 'all'));
    for(var i = 0; i < genders.length; i++) {
        genderSelectionList.add(new Option(genders[i], genders[i]));
    }
    if (genderSelectionList.length == 2){
        if (genderNo) genderSelectionList.options.selectedIndex = 1;
        else genderSelectionList.options.selectedIndex = 0;
    }
}

function populateCompetitionSelections() {  
    // Populating Competitions
    var competitionNo = competitionForm.competitionList.selectedIndex;
    var competitionSelectionList=document.getElementById('competitionList');
    competitionSelectionList.innerHTML = '';
    var competitions = view.getDistinctValues(10);
    competitionSelectionList.add(new Option("- Alla tävlingar -", 'all'));
    for(var i = 0; i < competitions.length; i++) {
        competitionSelectionList.add(new Option(competitions[i], competitions[i]));
    }
    if (competitionSelectionList.length == 2){
        if (competitionNo) competitionSelectionList.options.selectedIndex = 1;
        else competitionSelectionList.options.selectedIndex = 0;
    }
}

function populateSeasonSelections(column) {
    if (! column) { 
        column = 12;
    }
    var seasonNo = seasonForm.seasonList.selectedIndex;
    var seasonSelectionList=document.getElementById('seasonList');
    seasonSelectionList.innerHTML = '';
    var seasons = view.getDistinctValues(column);
    seasonSelectionList.add(new Option("- Alla säsonger -", 'all'));
    for(var i = 0; i < seasons.length; i++) {
        seasonSelectionList.add(new Option(seasons[i], seasons[i]));
    }
    if (seasonSelectionList.length == 2){
        if (seasonNo) seasonSelectionList.options.selectedIndex = 1;
        else seasonSelectionList.options.selectedIndex = 0;
    }
}

function clearFilter() {
    view = new google.visualization.DataView(data);

    bookmarkUrl = window.location.href.split("?")[0];
    document.getElementById('bookmarkUrl').innerHTML = '<a href="' + bookmarkUrl + '">' + bookmarkUrl + '</a>';
    populateSelections();
    if (arguments[0] == 'clear') {
        view.setRows([]);   
    }
    table = new google.visualization.Table(document.getElementById('table_div'));
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
    var option_43 = ''; // Utomhus 2017
    var option_44 = ''; // Inomhus 2017-2018
    var option_5 = ''; // Namnlista
    var option_6 = ''; // Klubbrekord
    var option_7 = ''; // Utrustning
    var option_8 = ''; // Årsbästa Sverige
    var active = 'class="w3-red"';
    
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
        if (arguments[i] == '43') { option_43 = active; }
        if (arguments[i] == '44') { option_44 = active; }
        if (arguments[i] == '5') { option_5 = active; }
        if (arguments[i] == '6') { option_6 = active; }
        if (arguments[i] == '7') { option_7 = active; }
        if (arguments[i] == '8') { option_8 = active; }
    }  
      
    var menuString = 
        '<ul class="w3-navbar w3-round-large w3-light-grey w3-medium w3-margin">' +
        '<li></li>' +
        '<li><a ' + option_1 + 'href="index.html"><i class="fa fa-list"></i> Alla resultat</a></li>' +
        '<li><a ' + option_2 + 'href="pb.html?badges=true"><i class="fa fa-trophy"></i> Personbästa</a></li>' +
        '<li><a ' + option_6 + 'href="records.html"><i class="fa fa-trophy"></i> Klubbrekord</a></li>' +
        '<li><a ' + option_8 + 'href="year-best.html"><i class="fa fa-trophy"></i> Årsbästa Sverige</a></li>' +
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
          '<a ' + option_4 + 'href="#"><i class="fa fa-map-o"></i> Kartor <i class="fa fa-caret-down"></i></a>' +
          '<div class="w3-dropdown-content w3-white w3-card-4">' +
            '<a ' + option_44 + 'href="map.html?map=4"><i class="fa fa-map-marker"></i> Inomhustävlingar 2017-2018</a>' +
            '<a ' + option_43 + 'href="map.html?map=3"><i class="fa fa-map-marker"></i> Utomhustävlingar 2017</a>' +
            '<a ' + option_41 + 'href="map.html?map=1"><i class="fa fa-map-marker"></i> Inomhustävlingar 2016-2017</a>' +
            '<a ' + option_42 + 'href="map.html?map=2"><i class="fa fa-map-marker"></i> Utomhustävlingar 2016</a>' +
          '</div>' +
        '</li>' +
        '<li><a ' + option_5 + 'href="names.html"><i class="fa fa-user"></i> Namnlista</a></li>' +
        '<li><a ' + option_7 + 'href="gear.html"><i class="fa fa-circle"></i> Utrustning</a></li>' +
        '<li class="w3-dropdown-hover">' +
          '<a href="#"><i class="fa fa-link"></i> Länkar <i class="fa fa-caret-down"></i></a>' +
          '<div class="w3-dropdown-content w3-white w3-card-4">' +
            '<a href="m"><i class="fa fa-link"></i> Mobilversion</a>' +
            '<a href="https://hanvikenssk.myclub.se/friidrott" target="_blank"><i class="fa fa-link"></i> Hanviken SK friidrott</a>' +
            '<a href="http://friidrott.se" target="_blank"><i class="fa fa-link"></i> Friidrott.se</a>' +
            '<a href="http://www.friidrott.se/getattachment/Regler/nytt14/nyaregler2014.pdf.aspx" target="_blank"><i class="fa fa-link"></i> Friidrottsregler, redskap och grenprogram</a>' +
            '<a href="http://www.friidrott.se/Regler/umangkpoang.aspx" target="_blank"><i class="fa fa-link"></i> Poängtabeller mångkamp</a>' +
          '</div>' +
        '</li>' +
      '</ul>';
    document.getElementById('menu').innerHTML = menuString;
}

function w3_open() {
    document.getElementById("sidenav").style.display = "block";
}

function w3_close() {
    document.getElementById("sidenav").style.display = "none";
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
