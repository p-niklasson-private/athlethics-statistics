// Some old javascript functions that are no longer used in athletics-stats
// Kept for future use if needed somewhere else

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
