// ###################
// Main
// ###################
function main(daysInScope){
  // Debug
  daysInScope = 30
  // ### Set Dates ###
  var currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0) // Set time to midnight to include all events
  var endDate = new Date(currentDate.getTime());
  endDate.setDate(endDate.getDate() + daysInScope)
  console.log(currentDate, endDate)

  // ### Get Data ###
  // Calendar
  var calendarEvents = get_calendar_events(currentDate, endDate)

  // Spreadsheet Info
  let activeSheet = SpreadsheetApp.openByUrl(SHEET_URL);
  PAGE = activeSheet.getSheetByName(PAGE_NAME);
  SHEET_DATA = PAGE.getDataRange().getValues();
  HEADERS = SHEET_DATA[0];
  SHEET_DATA.slice(1);

  // ### Iterate through Sheet Events ###
  iterateThroughSheet(currentDate, endDate)

  // ### Iterate through Calendar Events ###
  iterateThroughCalendarEvents(calendarEvents);

  // ### Finishing Touches ###


};

function iterateThroughSheet(currentDate, endDate){
  // TODO - Better to use endDate or start Date index?
  const endDateIndex = HEADERS.indexOf("Ends")
  var calendarEvent = null
  let currentRow = _getStartRow(endDateIndex, currentDate);
  let currentEventDate = new Date(SHEET_DATA[currentRow][endDateIndex])

  while (currentRow < SHEET_DATA.length && endDate >= currentEventDate && currentEventDate >= currentDate) {
    // If event lacks calendar link, make calendar event
    if (!SHEET_DATA[currentRow][HEADERS.indexOf("Calendar Link")]) {
      console.log("IF")
      calendarEvent = _createCalendarEvent(SHEET_DATA[currentRow])
    }

    // Else, determine if sheet or calendar more up-to-date
    else {
      console.log("ELSE")
      let sheetLastUpdated = SHEET_DATA[currentRow][HEADERS.indexOf("Last Edited")]
      let calendarLastUpdated = getCalendarLastModified(eventUrl);
      calendarEvent = _getEventObject() // TODO this function isn't real

      if (sheetLastUpdated > calendarLastUpdated) {
        _updateCalendarEvent(calendarEvent);
      }
      else if (sheetLastUpdated < calendarLastUpdated) {
        _writeEventRow(eventObject, targetRow) // TODO - where is target row
      }
    }

    _writeLastUpdated(calendarEvent.getLastUpdated());
    currentRow++;
    currentEventDate = new Date(SHEET_DATA[currentRow][endDateIndex])
  };

};


function _getEventObject(targetCalendar, eventLink){
  var eventId = eventLink.split('eid=')[1];
  eventId = decodeURIComponent(eventId);
  return targetCalendar.getEventById(eventId)
};


function _writeEventRow(calendarEvent, targetRow){
  /* Given a calendar event object, writes details to given row. */

  // Get Event Link
  eventLink = "https://www.google.com/calendar/event?eid=" + encodeURIComponent(calendarEvent.getId());

  // Get Cells
  let monthCell = PAGE.getRange(targetRow, HEADERS.indexOf("Month"));
  let startsCell = PAGE.getRange(targetRow, HEADERS.indexOf("Starts"));
  let endsCell = PAGE.getRange(targetRow, HEADERS.indexOf("Ends"));
  let calendarCell = PAGE.getRange(targetRow, HEADERS.indexOf("Calendar"));
  let eventIdCell = PAGE.getRange(targetRow, HEADERS.indexOf("Event ID"));
  let descriptionCell = PAGE.getRange(targetRow, HEADERS.indexOf("Description"));
  let lastModifiedCell = PAGE.getRange(targetRow, HEADERS.indexOf("Last Modified"));
  let eventLinkCell = PAGE.getRange(targetRow, HEADERS.indexOf("Event Link"));

  // Set Values
  console.log("SET VALUES")
  monthCell.setvalue(calendarEvent.getStartTime().getMonth()+1);
  startsCell.setvalue(calendarEvent.getStartTime());
  endsCell.setvalue(calendarEvent.getEndTime());
  calendarCell.setvalue(calendarEvent.getOriginalCalendarId()); // TODO - probably need to convert to str
  eventIdCell.setvalue(calendarEvent.getId());
  descriptionCell.setvalue(calendarEvent.getDescription());
  lastModifiedCell.setvalue(calendarEvent.getLastUpdated());
  eventLinkCell.setvalue(eventLink);
};


function _updateCalendarEvent(calendarEvent){
    // TODO - Function not done
    calendarEvent.setTitle = eventData[HEADERS.indexOf("Event")];
    // TODO - How cna we update time while not overwriting an actual event with times with default time values
};


function _createCalendarEvent(eventData){
  let title = eventData[HEADERS.indexOf("Event")];
  let calendarName = eventData[HEADERS.indexOf("Calendar")];
  let start = new Date(eventData[HEADERS.indexOf("Starts")]);
  let end = new Date(eventData[HEADERS.indexOf("Ends")]);
  let description = eventData[HEADERS.indexOf("Description")];
  let targetCalendar = CALENDARS[calendarName];

  let event = targetCalendar.createEvent(title, start, end, {description: description});
  event.setTag("pairedEvent", "true")

  return event
};


function _writeLastUpdated(eventRowInt, updateDate) {
  // Changes the last updated column for given event
  console.log("COORDS", eventRowInt, HEADERS.indexOf("Last Modified"))
  let cell = PAGE.getRange(eventRowInt, HEADERS.indexOf("Last Modified"))
  console.log("CELL")
  console.log(cell)
  cell.setvalue(updateDate)
};


function _getStartRow(eventIndex, currentDate) {
  // Determines the row of first event that hasn't ended.
  // Keep in mind startRow is an estimate based on previous status of sheet.

  startRow = 1                              // TODO - make this get a cell from sheet instead

  // Move forward until we find first event that has not occured yet.
  if (new Date(SHEET_DATA[startRow][eventIndex] <= currentDate)) {
    while (new Date(SHEET_DATA[startRow][eventIndex]) <= currentDate && startRow < SHEET_DATA.length) {
        startRow += 1;
    };
  }

  // Move backwards until we find first event that has not occured yet
  else if (new Date(SHEET_DATA[startRow][eventIndex]) >= currentDate && startRow > 1) {
      while (new Date(SHEET_DATA[startRow][eventIndex]) >= currentDate) {
          startRow -= 1;
      };
  }
  else {
    console.error("ERROR: Could not find start row.");
  };

  // TODO - write this value to sheet for future reference
  return startRow
}


function iterateThroughCalendarEvents(calendarEvents){
  for (const event of calendarEvents) {
    // No Paired Event Exists
    if (!event.extendedProperties || event.extendedProperties.private['pairedRow'] !== 'true'){
      _writeEventRow(event, targetRow);
      setExtendedProperty(event);
    }
    // Paired Events were checked during sheet iteration
    else {
      console.log("No action needed: Paired event", event.getTitle());
    }
  };
}


// ### TODO ###
// TODO - Test current script is functional
// TODO - Test current script runs as intended
// TODO - Make sure data on spreadsheet usable
// TODO - Keep hidden cell for the startRow
// TODO - Ensure correct columns in use

// TODO - Work on the edit function
// TODO - On edit function needs to update last edited column

// TODO - Only use date as needed (don't return as date)
// TODO - Correct variable names to use JavaScript style
// TODO - Reorganize code
// TODO - Deleting events?


// ### Documentation & Comments
// TODO - Sync flow names and main titles
// TODO - Combine README and FLOW
// TODO - Include Instructions in README for new calendar



/* README -
This script does not edit events that are over.
*/
