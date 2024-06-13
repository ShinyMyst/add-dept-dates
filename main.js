// ###################
// Main
// ###################
function main(scope_days){
  // ### Prepare Dates ###
  var currentDate = new Date();
  var scope = scope_days * 24 * 60 * 60 * 1000
  var endDate = new Date(currentDate.getTime() + scope);

  // ### Get Events ###
  var calendarEvents = get_calendar_events(currentDate, endDate)
  var sheetData = get_sheet_events();
  var headers = sheetData[0]; // TODO make this globally referencable?
  var sheetData = sheetData.slice(1);

  // ### Iterate through Sheet Events ###
  // TODO make sheet data update global values instead?
  // Define it in constants but set the data here in main (or a sub function)
  const endDateIndex = headers.indexOf("Ends")
  let startRow = getStartRow(sheetData, endDateIndex);
  let currentRow = startRow;
  while (currentRow < sheetData.length && new Date(sheetData[currentRow][endDateIndex]) >= currentDate) {
    console.log(sheetData[currentRow]);
    // If event lacks calendar link, make it
    if (!sheetData[currentRow][headers.indexOf("Calendar Link")]) {
      let updateDate = createCalendarEvent(sheetData[currentRow])
      writeLastUpdate(updateDate)
    }
    else {
      // TODO get event URL data at start of this instead?
      sheetLastUpdated = sheetData[currentRow][headers.indexOf("Last Edited")] 
      calendarLastUpdated = getCalendarLastModified(eventURL);
      if (sheetLastUpdated > calendarLastUpdated) {
        let updateDate = updateCalendarEvent(eventURL);
        writeLastUpdate(updateDate);
      }
      else if (sheetLastUpdated < calendarLastUpdated) {
        writeUpdateSheetData(eventURL)
        writeLastUpdate(sheetLastUpdated);
      }
    }
    // If event has calendar link, compare them
    currentRow++; 
  }

  // ### Iterate through Calendar Events ###

  // ### Finishing Touches ###


};

function writeSheetData(activeSheet, eventObject){
  // Month
  let cell = activeSheet.getRange(eventRowInt, headers.indexOf("Month"));
  cell.setvalue(eventObject.getStartTime().getMonth()+1);
  // Starts
  cell = activeSheet.getRange(eventRowInt, headers.indexOf("Starts"));
  cell.setvalue(eventObject.getStartTime());
  // Ends
  cell = activeSheet.getRange(eventRowInt, headers.indexOf("Ends"));
  cell.setvalue(eventObject.getEndTime());
  // Calendar
  cell = activeSheet.getRange(eventRowInt, headers.indexOf("Calendar"));
  cell.setvalue(eventObject.getOriginalCalendarId()); // TODO - probably need to convert to str
  // EventID
  cell = activeSheet.getRange(eventRowInt, headers.indexOf("Event ID"));
  cell.setvalue(eventObject.getId());
  // Description
  cell = activeSheet.getRange(eventRowInt, headers.indexOf("Description"));
  cell.setvalue(eventObject.getDescription());
  // Last Modified
  cell = activeSheet.getRange(eventRowInt, headers.indexOf("Last Modified"));
  cell.setvalue(eventObject.getLastUpdated());
  // Event Link
  let eventLink = "https://www.google.com/calendar/event?eid=" + encodeURIComponent(eventId);
  cell = activeSheet.getRange(eventRowInt, headers.indexOf("Event Link"));
  cell.setvalue(eventLink); 
}

function updateCalendarEvent(calendar, eventId){
  let event = calendar.getEventById(eventId);
  if (!event) {
    console.error("ERROR: Could not find modified date.")
    return null
  }
    event.setTitle = eventData[headers.indexOf("Event")];
    // TODO - How cna we update time while not overwriting an actual event with times with default time values

    return event.getLastUpdated()
}



function getCalendarLastUpdated(calendar, eventId){
  let event = calendar.getEventById(eventId);
  if (!event) {
    console.error("ERROR: Could not find modified date.")
    return null
  }
  return event.getLastUpdated()
}

function createCalendarEvent(headers, eventData){
  let title = eventData[headers.indexOf("Event")];
  let calendar = eventData[headers.indexOf("Calendar")];
  let start = new Date(eventData[headers.indexOf("Starts")]);
  let end = new Date(eventData[headers.indexOf("Ends")]);
  let description = eventData[headers.indexOf("Description")];
  let event = calendar.createEvent(title, start, end, {description: description});
  return event.getLastUpdated()
}



function writeLastUpdate(activeSheet, headers, eventRowInt, updateDate) {
  // Changes the last updated column for given event
  let cell = activeSheet.getRange(eventRowInt, headers.indexOf("Last Modified"))
  cell.setvalue(updateDate)
}


function getStartRow(sheetData, eventIndex) {
  // Determines the row of first event that hasn't ended.
  // Keep in mind startRow is an estimate based on previous status of sheet.
  startRow = 1                              // TODO - make this get a cell from sheet instead

  // Move forward until we find first event that has not occured yet.
  if (new Date(sheetData[startRow][eventIndex] <= currentDate)) {
    while (new Date(sheetData[startRow][eventIndex]) <= currentDate && startRow < sheetData.length) {
        startRow += 1;
    };
  }

  // Move backwards until we find first event that has not occured yet
  else if (new Date(sheetData[startRow][eventIndex]) >= currentDate && startRow > 1) {
      while (new Date(sheetData[startRow][eventIndex]) >= currentDate) {
          startRow -= 1;
      };
  }
  else {
    console.error("ERROR: Could not find start row.");
  };

  // TODO - write this value to sheet for future reference
  return startRow
}


// TODO - How to handle deleting events?
// TODO - add staff members to the list/.
// TODO - only convert to date object when it has to be that format
// TODO - make a debug bool at top to tweak values when testing
// TODO sort these notes
// TODO don't hard code strings for headers
// TODO - write function mean its writing to spreadsheet, create makes an event, get gets data

// TODO clean up the notes
// TODO make headers match main section

// Deleted calendar event caught by spreadsheet having an invalid link to event (as opposed to none)
// Deleted spreadsheet event caught by edit detection.


// TODO - What do we do if event paired and both changed?
// TODO - What if its unpaired but it gets filtered by the date?

/* NOTES - Include in documentation
On edit functtion required to keep last edited values up-to-date
This script does not edit events that are over.
NOTE - we're going to omit the lock.  
We can't lock calendar events so there's a chance
things will be edited during script run phase.
Just time it to mitigate the risk.
TODO - Sort all thesed ntoes into one place.
TODO - instructions for adding calendar
TODO - fix variables names to match java style
TODO - explain the find starting point section.  We loop until condition breaks to ensure we're at first event > currentTime
TODO - Make the start date function actually do a second before midnbight to include events from current day as well

*/