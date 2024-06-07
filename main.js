// ###################
// Main
// ###################
function main(scope_days){
  // TODO Add a lock?

  // Prepare date range
  var currentDate = newDate();
  var scope_coefficient = scope_days * 24 * 60 * 60 * 1000
  var endDate = new Date(currentDate.getTime() + scope_coefficient);

  // Get Events
  var calendarEvents = get_calendar_events(currentDate, endDate)
  var sheetEvents = get_sheet_events();


  process_unpaired_events();
  process_paired_events();
};



// ###################
// Supporting Functions
// ###################
// Consider storing the date script last ran?
// Use this date to limit which gCal events are pulled
// As for spreadsheet, can gather events that are new or blank

function gather_calendar_events(scope){
  // Gather events from calendar within given scope (30 days default)
};

function gather_spreadsheet_events(scope){
  // Gather events from spreadsheet within given scope (30 days default)
};

// Checks the last edited times of spreadsheet and calendar events
// Updates information to match the most  recently updated version
function process_paired_events(){

};


function process_unpaired_events(scope){
  // Default scope should be 30 days
  // Event name is a unique key
  // Creates a list of all event names in calendars
  // Creates a list of all event names in spreadsheet
  // If event exists in one but not the other, adds a copy where it is missing
  gather_event_gcal(calendar);
  gather_event_spreadsheet();
  unpaired_events = compare_events();
  add_event_gcal();
  add_event_spreadsheet();
  // make sure to update edit times to match cal edit time
};

// Deleted calendar event caught by spreadsheet having an invalid link to event (as opposed to none)
// Deleted spreadsheet event caught by edit detection.


// TODO - What do we do if event paired and both changed?
// TODO - What if its unpaired but it gets filtered by the date?

/* NOTES - Include in documentation
On edit functtion required to keep last edited values up-to-date
This script does not edit events that are over.

*/