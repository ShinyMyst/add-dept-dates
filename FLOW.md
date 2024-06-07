# Calendar Update Steps
## Trigger
- Google script will be set to trigger at different intervals.
- Each interval when use a different scope, time frame that is checked.
    - Checking a year ahead might only occur once monthly.
    - Checking a week ahead might occur daily.

## Prepare Sheet
- Lock the sheet to prevent concurrent edits.
- Retrieve the `currentTime`.
- Use scope to calculate the target `endDate`

## Gather Data
- Retrieve all calendar events within the defined scope.
    - This includes all calendars stored in the global `CALENDARS`
    - All events stored in a temporary, singular list.
- Collect all events from the sheet.
    > We cannot filter sheet events by scope without a loop.
    > To reduce repitition, we will filter them during our iteration phase.

## Iterate through Sheet Events
#### Find Starting Point
- Begin at the `startRow` and find the `eventDate`.
- We want to begin at the first date in the future.
    > Events may get deleted, so we cannot assume the row number is accurate.
    > Instead, we use it as a starting point and verify the accuracy.
- If `eventDate` < `currentTime`
    - Move forward until `eventDate` > `currentTime`
    - Save this as `startRow`
- If `eventDate` > `currentTime`
    - Move backwards until `eventDate` < `currentTime`
    - Save the row before this occurs as `startRow`

#### Process Events
- Start iterating through all sheet events starting at `startRow`
- Stop iteration when `eventDate` > `endDate`

#### Unpaired Events
- If an event lacks a calendar link, add it to the calendar.
- Add the `pairedRow` property to the calendarEvent
- Update the `sheetLastUpdated` column to match `calendarLastUpdated`

#### Paired Events
- If an event is linked to a calendar event, compare their modification dates:
- If `sheetLastUpdate` > `calendarLastUpdated`,
    - Update the calendar to match the sheet.
    - Ensure `sheetLastUpdate` == `calendarLastUpdated`
- If `sheetLastUpdate` < `calendarLastUpdated`
    - Update sheet data to match the calendar data
    - Ensure `sheetLastUpdate` == `calendarLastUpdated`
- If `sheetLastUpdate` == `calendarLastUpdated`
    - No action needed

## Iterate through Calendar Events
- Calendar event's have an extended property bool - `pairedRow`
- This determines if there's a matching event in the sheet.

#### Paired Events
- Paired events were already evaluated in previous loop.
- We should be able to skip over these

#### Unpaired Events
- Add the `pairedRow` property to calender event
- Add a new row for this event on the sheet.
- Update the `sheetLastUpdated` column to match `calendarLastUpdated`

## Finishing Touches
- Sort sheet by date.
- Retrieve the `currentTime`.
> Do not reuse the time from the start of process.  We want the new actual time.
> This is to account for time that passes as script runs.
- Record `currentTime` in the `lastUpdated` box.
- Unlock sheet

## Sheet Variables
- `lastupdated`: stores the date when the sheet was last modified.
- `startRow`: records the row from which the last check started.

# Spreadsheet Edited
- Prepare a trigger for when spreadsheet is edited.
- Find the time of edit and row it occured on.
- Save time of edit in the `lastEdited` column.
> If we cannot retrieve this, just blank out the column.
> TODO - we will need a special proceudre for this.
