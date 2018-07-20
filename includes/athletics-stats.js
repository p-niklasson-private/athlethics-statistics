function initiateData() {
    dbGetJsonData();
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
                "1M3IgsiTy-VEP_2HwcIUzssSEkV4h6NmJJ3ajMqBgLa0", // Utomhus 2018
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
                "1Igyp5Zfi3FTmzbZ8UHPBrA1N-H5cyZfrmBzLrwZ-JzU", // Inomhus 2008-2009
                "1IvNDBkQc9Jl6MS8ZkCKtrKPk_klO_IbioTfKf_miJfI", // Utomhus 2008
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
            docList = seasons.concat(["1CwBhPL13W4nqSMIZx_ZFhPcQXQm5LzpBQ6fTtj4po5Q"]); // Friidrottsmärken
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

function fileGetJsonData(file_name) {
    // Get the generated json data file from disc. easiest to do in PHP...
    var jsonData, result;
    $.ajax({
       url: "readDataFile.php",
       dataType: "json",
       data: {file_name: file_name},
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

function handleRelayTeam() {
    // Handle relay team members
    for (var i = 0; i < data.getNumberOfRows(); i++) {
        if (data.getValue(i,14)) {
            var team_name = data.getValue(i,1);
            var team_members = data.getValue(i,14);
            team_members = team_members.replace(/(\d+)/g, "$1<br>");
            data.setFormattedValue(i,1,"<b>" + team_name + "</b><br>" + team_members);
        }
    }
}

function filterOne(container, column, name) {
    var filter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': container,
        'options': {
            'filterColumnIndex': column,
            'ui': {
                'sortValues': true,
                'allowNone': false,
                'allowMultiple': false,
                'allowTyping': false,
                'label': ''
            }
        }
     });

    var urlValue = findGetParameter(name);
    if (urlValue) {
        filter.setState({'selectedValues': urlValue.split(",")});
    }
    else if (localStorage) {
        var value = localStorage.getItem(name);
        if (value) {
            filter.setState({'selectedValues': value.split(",")});
        }
    }
    return filter;
}

function filter(container, column, name) {
    var filter = new google.visualization.ControlWrapper({
          'controlType': 'CategoryFilter',
          'containerId': container,
          'options': {
            'filterColumnIndex': column,
            'ui': {
                'sortValues': true,
                'allowNone': true,
                'allowMultiple': true,
                'allowTyping': true,
                'selectedValuesLayout': 'belowStacked', 
                'label': ''
            }
          }
        });
    var urlValue = findGetParameter(name);
    if (urlValue) {
        filter.setState({'selectedValues': urlValue.split(",")});
    }
    else if (localStorage) {
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
        bookmarkUrl = updateUrl(bookmarkUrl,name,values);
        console.log("bookmarkUrl: " + bookmarkUrl);
        $("#permaLink").attr("href", bookmarkUrl);
    }
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

function option(item, active) {
    console.log('Active: ' + active);
    if (active.indexOf(item) >= 0) {
        return 'class="w3-red"';
    }
    else {
        return '';
    }
}

function menu(active) {
    var menuString = 
        '<ul class="w3-navbar w3-round-large w3-light-grey w3-medium w3-margin">' +
        '<li></li>' +
        '<li class="w3-dropdown-hover">' +
          '<a ' + option('1',active) + ' href="#"><i class="fa fa-bar-chart"></i> Resultat <i class="fa fa-caret-down"></i></a>' +
          '<div class="w3-dropdown-content w3-white w3-card-4">' +
            '<a ' + option('11',active) + 'href="index.html"><i class="fa fa-list"></i> Alla resultat</a>' +
            '<a ' + option('12',active) + 'href="pb.html?badges=true"><i class="fa fa-trophy"></i> Personbästa</a>' +
            '<a ' + option('13',active) + 'href="records.html"><i class="fa fa-trophy"></i> Klubbrekord</a>' +
            '<a ' + option('14',active) + 'href="year-best.html"><i class="fa fa-trophy"></i> Årsbästa Sverige</a>' +
            '<a ' + option('15',active) + 'href="trends.html"><i class="fa fa-line-chart"></i> Trender</a>' +
        '<li class="w3-dropdown-hover">' +
          '<a ' + option('3',active) + ' href="#"><i class="fa fa-bar-chart"></i> Statistik <i class="fa fa-caret-down"></i></a>' +
          '<div class="w3-dropdown-content w3-white w3-card-4">' +
            '<a ' + option('31',active) + 'href="stats.html?graph=1"><i class="fa fa-pie-chart"></i> Födelseår</a>' +
            '<a ' + option('32',active) + 'href="stats.html?graph=2"><i class="fa fa-pie-chart"></i> Populära grenar</a>' +
            '<a ' + option('33',active) + 'href="stats.html?graph=3"><i class="fa fa-pie-chart"></i> Populära tävlingar</a>' +
            '<a ' + option('34',active) + 'href="stats.html?graph=4"><i class="fa fa-pie-chart"></i> Könsfördelning</a>' +
            '<a ' + option('35',active) + 'href="names.html"><i class="fa fa-user"></i> Namnlista</a>' +
          '</div>' +
        '</li>' +    
        '<li class="w3-dropdown-hover">' +
          '<a ' + option('4',active) + 'href="#"><i class="fa fa-map-o"></i> Kartor <i class="fa fa-caret-down"></i></a>' +
          '<div class="w3-dropdown-content w3-white w3-card-4">' +
            '<a ' + option('48',active) + 'href="map.html?map=8"><i class="fa fa-map-marker"></i> Utomhustävlingar 2018</a>' +
            '<a ' + option('47',active) + 'href="map.html?map=7"><i class="fa fa-map-marker"></i> Inomhustävlingar 2017-2018</a>' +
            '<a ' + option('46',active) + 'href="map.html?map=6"><i class="fa fa-map-marker"></i> Utomhustävlingar 2017</a>' +
            '<a ' + option('45',active) + 'href="map.html?map=5"><i class="fa fa-map-marker"></i> Inomhustävlingar 2016-2017</a>' +
            '<a ' + option('44',active) + 'href="map.html?map=4"><i class="fa fa-map-marker"></i> Utomhustävlingar 2016</a>' +
            '<a ' + option('43',active) + 'href="map.html?map=3"><i class="fa fa-map-marker"></i> Inomhustävlingar 2015-2016</a>' +
            '<a ' + option('42',active) + 'href="map.html?map=2"><i class="fa fa-map-marker"></i> Utomhustävlingar 2015</a>' +
            '<a ' + option('41',active) + 'href="map.html?map=1"><i class="fa fa-map-marker"></i> Inomhustävlingar 2014-2015</a>' +
          '</div>' +
        '</li>' +
        '<li><a ' + option('5',active) + 'href="gear.html"><i class="fa fa-circle"></i> Utrustning</a></li>' +
        '<li class="w3-dropdown-hover">' +
          '<a href="#"><i class="fa fa-file-o"></i> Dokument <i class="fa fa-caret-down"></i></a>' +
          '<div class="w3-dropdown-content w3-white w3-card-4">' +
            '<a href="https://drive.google.com/open?id=1MWBaZGkyPhO0DcDmrkFnxKC_nO3iuM9j"><i class="fa fa-file-pdf-o"></i> Klubbrekord Utomhus - Män</a>' +
            '<a href="https://drive.google.com/open?id=1MR5QNo9taPOshZy6HJx7HhlbBqi78Ds9"><i class="fa fa-file-pdf-o"></i> Klubbrekord Utomhus - Kvinnor</a>' +
            '<a href="https://drive.google.com/open?id=1_SQdho_BI-JwasNdAjByslbseKsNkoLT"><i class="fa fa-file-pdf-o"></i> Klubbrekord Inomhus - Män</a>' +
            '<a href="https://drive.google.com/open?id=19gaGWcOxacUfchOpRRBgbwLHIH4tzZRK"><i class="fa fa-file-pdf-o"></i> Klubbrekord Inomhus - Kvinnor</a>' +
            '<hr style="width:100%; height:1px; background-color:rgb(0, 0, 0)">' +
            '<a href="https://drive.google.com/open?id=1Z0I1PplvPX4wOTFHwuvI1BI3GX2uDVpp"><i class="fa fa-file-pdf-o"></i> Årsbästa Inomhus - Män 2017-2018</a>' +
            '<a href="https://drive.google.com/open?id=1ydP1lt473q4WjdmTAQo_jvD9SH9eKqy6"><i class="fa fa-file-pdf-o"></i> Årsbästa Inomhus - Kvinnor 2017-2018</a>' +
            '<a href="https://drive.google.com/open?id=0B2Tl1l1iIuPWUjh0eXV2NmhubGM"><i class="fa fa-file-pdf-o"></i> Årsbästa Utomhus - Män 2017</a>' +
            '<a href="https://drive.google.com/open?id=0B2Tl1l1iIuPWNHViUlVCX3didHM"><i class="fa fa-file-pdf-o"></i> Årsbästa Utomhus - Kvinnor 2017</a>' +
          '</div>' +
        '</li>' +
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
