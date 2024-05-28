/* Gather events
Scope determines the number of days in future script will search for events to limit size. (scope)
*/

function get_calendar_events(scope){
    // Gather events from calendar within given scope

    var allEvents = [];

    var scope_coefficient = scope * 24 * 60 * 60 * 1000
    var currentDate = newDate();
    var endDate = new Date(currentDate.getTime() + scope_coefficient);

    for (const calendar of Object.values(CALENDARS)){
        const calEvents = _pull_from_calendar(calendar, currentDate, endDate)
        allEvents = events.concat(calendarEvents)
    }
    
    return allEvents
  };
  

function _pull_from_calendar(calendar, startDate, endDate){
    // Pulls events from an individual calendar
    var events = calendar.getEvents(startDate, endDate);
    return events;
}


function get_sheet_events(scope, last_run){
    // Gather events from spreadsheet within given scope.
  };


/*
Actually omit these functions?  We do want to filter BUT
We will need to loop later to check for paired and unpaired too.
It's better to handle everything in this single loopl
*/

function filter_calendar_events(events, last_run){
    // Filter out events unchanged since script last_run.

}

function filter_sheet_events(events, last_run){
    // Filter out events uncahnged since script last_run

}

// TODO - What do we do if event paired and both changed?
// TODO - What if its unpaired but it gets filtered by the date?
