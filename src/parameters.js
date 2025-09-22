/* 
  ===============================================================
  =                GLOBAL PARAMETERS                 =
  ===============================================================
  Modifiable global parameters used in the template 
*/

// Context
const DataPipe_ID = "vmuVgxxOMTlT";  // The DataPipe ID for where the data should be stored
const condition = assignCondition(4, { useLocalStorage: false }); // Sets the condition. THe number (e.g. "4") determines the number of conditions possible. The useLocalStorage paramater determines if the condition should reload from local stroage or be ephemeral
const is_DEBUG = true; // Initalise in debug mode
const task_time = 30; // (minutes) for the PIS
const in_lab = false; //If true a SONA ID will be randomly generated and no redirect will occur; instead, a notify expeirmenter screen will show after the debrief
const local_save = true; //If true, no data will be pushed to the server; instead a local csv is saved and no redirect to Prolific/SONA will occur.
const initalise_fullscreen = true; // initalise fullscreen

// Redirect
const sona_experiment_id = "NA";      // The SONA experiment ID 
const sona_credit_token = "NA";       // The SONA credit token 
const Prolific_redirect = "CHGWKNI0"; // The Prolific redirect link (to credit)
const Prolific_failed_check = "C13PIUOF"; // The Prolific redirect link for failing an attention check
const accuracy_criterion = .55; // Accuracy cut-off for manual data review 


// Experiment setup
var trialnum = 1; // trial count starting value
var blocknum = 1; // block count starting value


/* 
  ===============================================================
  =                EXPERIMENT PARAMETERS                 =
  ===============================================================
Add parameters that can be set dynamically for your experiment
  */

