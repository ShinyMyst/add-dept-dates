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
  var headers = sheetData[0];
  var sheetData = sheetData.slice(1);

  // ### Iterate through Sheet Events ###
  startRow = getStartRow(sheetData, endDate);
};


function getStartRow(sheetData, eventIndex) {
  // Determines the row of first event that hasn't ended.
  // Keep in mind startRow is an estimate based on previous status of sheet.
  startRow = 1                              // TODO - make this get a cell from sheet instead

  // Move forward until we find first event that has not occured yet.
  if (sheetData[startRow][eventIndex] <= currentDate) {
    while (sheetData[startRow][eventIndex] <= currentDate && startRow < sheetData.length) {
        startRow += 1;
    };
  }

  // Move backwards until we find first event that has not occured yet
  else if (sheetData[startRow][eventIndex] >= currentDate && startRow > 1) {
      while (sheetData[startRow][eventIndex] >= currentDate) {
          startRow -= 1;
      };
  }
  else {
    console.error("Error occured determining proper date");
  };

  // TODO - write this value to sheet for future reference
  return startRow
}







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