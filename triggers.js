// ###################
// Triggered Functions
// ###################
/*
These functions are the ones called by Google's scheduler.
They are seperated from main in order to provide varying input parameters.
*/

function update_last_edit() {
  // Update the last edited time column to match when row was last edited.
  // Update the corresponding calendar event
};

function update_week() {
  main(7)
}

function update_month() {
  main(30)
}

function update_semester() {
  main(120)
}

function update_year() {
  main(365)
}
