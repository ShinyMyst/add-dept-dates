/* Gather events
Scope determines the number of days in future script will search for events to limit size. (scope)
*/

//TODO - Note which globals are needed here

function get_calendar_events(startDate, endDate){
    // Gather events from all calendar within given scope
    // Returns a single list regardless of source calendar

    var allEvents = [];

    for (const calendar of Object.values(CALENDARS)){
        const calEvents = _pull_from_calendar(calendar, startDate, endDate)
        allEvents = events.concat(calendarEvents)
    }

    return allEvents
};


function _pull_from_calendar(calendar, startDate, endDate){
    // Pulls events from an individual calendar
    var events = calendar.getEvents(startDate, endDate);
    return events;
};


function get_sheet_events(){
    // Gather all events from sheet sans header
    const activeSheet = spreadsheetApp.openbyUrl(SHEET_URL);
    const activePage = activeSheet.getSheetByName(PAGE_NAME);
    const rawData = activePage.getDataRange().getValues();

    return rawData.slice(1);
  };
