
/* 
===============================================================
=              GLOBAL SETTINGS & INITIALIZATION               =
===============================================================
*/

// Get current date and time in Sydney
const nowInSydney = new Date().toLocaleString("en-AU", {
  timeZone: "Australia/Sydney"
});



let trialnum = 1;           // Trial counter
let blocknum = 1;           // Block counter
let aborted = false;        // Tracks whether user was aborted from experiment
let in_fullscreen = false   // Tracks whether participant is in fullscreen (set to false to begin with)

// Initialize jsPsych
const jsPsych = initJsPsych({
  on_interaction_data_update: function(data) {
    // If participant exits fullscreen, note it (unless it's a pilot).
    if (data.event === 'fullscreenexit' && pilot !== 'true') {
      in_fullscreen = false;
    }
  },
  on_finish: function(data) {
    
    // Get current date and time in Sydney
    var finishinSydney = new Date().toLocaleString("en-AU", {
      timeZone: "Australia/Sydney"
    });
    jsPsych.data.addProperties({ finish_time: finishinSydney });
    
    
    // If user is forced to abort (wrong browser or device), show alert
    if (aborted === true) {
      alert("You must use Safari, Chrome or Firefox on a Desktop or Laptop to complete this experiment.");
    }
    
    
    if (aborted === false) {
      
      
      // Turn on to save a local copy
      if (typeof local_save !== "undefined" && local_save === true) jsPsych.data.get().localSave('csv','mydata.csv'); 
      
      const meanCorrect = jsPsych.data.get().filter({trial_type: "Summary Trial"}).select('correct').mean();
      if (meanCorrect < accuracy_criterion) {
        // Failed check
        if (typeof local_save === "undefined" || local_save === false) window.location = attention_redirect_link;
      } else {
        // Passed check
        if (typeof local_save === "undefined" || local_save === false) window.location = redirect_link;
      }
    }
  }
});




/* 
===============================================================
=                 BROWSER & FULLSCREEN CHECKS                 =
===============================================================
*/

// Check that participant is using Chrome or Firefox on a desktop. Note that previously excluded Safari but it seems to be working
const browser_check = {
  timeline: [
    {
      type: jsPsychBrowserCheck,
      inclusion_function: (data) => {
        // Accept only if browser is Chrome, Safari, or Firefox and not on mobile
        return ['chrome', 'firefox', 'safari'].includes(data.browser) && data.mobile === false;
      },
      exclusion_message: (data) => {
        aborted = true;
        if (data.mobile) {
          return '<p>You must use a desktop/laptop computer to participate in this experiment.</p>';
        } else if (!['chrome','firefox', 'safari'].includes(data.browser)) {
          return '<p>You must use Chrome, Safari, or Firefox as your browser to complete this experiment.</p>';
        }
      }
    }
  ],
  conditional_function: function() {
    // Skip this check if pilot mode
    if (pilot === 'true') {
      return false;
    } 
    return true;
  }
};

// Request participant enter fullscreen
const enter_fullscreen = {
  timeline: [
    {
      type: jsPsychFullscreen,
      message: '<p>To take part in the experiment, your browser must be in fullscreen mode. Exiting fullscreen mode will pause the experiment.<br><br>Please click the button below to enable fullscreen and continue.</p>',
      fullscreen_mode: true,
      on_finish: function(){
        in_fullscreen = true;
      }
    }
  ],
  conditional_function: function() {
    // Skip if pilot
    if (pilot === 'true') {
      return false;
    } 
    return true;
  }
};




/* 
===============================================================
=                    FINAL DEBRIEF & SAVE                     =
===============================================================
*/

// Optional debug question: Issues encountered?
const debug = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: 'Did you experience any issues while completing this study?', rows: 5}
  ]
};

const data_saved = {
  type: jsPsychHtmlButtonResponse,
  stimulus: '<p>Data saved successfully. Press <strong>Continue</strong> to be redirected back to your recruitment platform.</p>',
  choices: ['Continue']
}


// Capture URL parameters (Prolific, SONA, pilot, etc.)
const PROLIFIC_PID = jsPsych.data.getURLVariable('PROLIFIC_PID');

const pilot        = jsPsych.data.getURLVariable('pilot');

// if in lab, randomly allocate an ID
if (typeof in_lab !== "undefined" && in_lab === true){
  console.log("In lab, assigning random SONA ID")
  var SONAID = jsPsych.randomization.randomID(20);
} else{
  var SONAID       = jsPsych.data.getURLVariable('SONAID');
}

// Store time
jsPsych.data.addProperties({ start_time: nowInSydney });

// Decide how to redirect user depending on whether they're from SONA or Prolific
let redirect_link, attention_redirect_link;

if (typeof SONAID !== 'undefined' | (typeof in_lab !== "undefined" && in_lab === true)) {
  // SONA
  jsPsych.data.addProperties({ participant_id: SONAID, Source: "SONA" });
  redirect_link = `https://sydneypsych.sona-systems.com/webstudy_credit.aspx?experiment_id=${sona_experiment_id}&credit_token=${sona_credit_token}&survey_code=${SONAID}&id=${SONAID}`;
  attention_redirect_link = `https://sydney.au1.qualtrics.com/jfe/form/SV_3h2qh8pBAnv00QK?SONAID=${SONAID}&accuracy=`;
} else {
  // Prolific
  jsPsych.data.addProperties({ participant_id: PROLIFIC_PID, Source: "Prolific" });
  redirect_link = `https://app.prolific.com/submissions/complete?cc=${Prolific_redirect}`;
  attention_redirect_link = `https://app.prolific.co/submissions/complete?cc=${Prolific_failed_check}`;
}

// Filename and location to save data
const subject_id = jsPsych.randomization.randomID(10);
const filename   = `participant-${subject_id}_data.csv`;

// We use jsPsychPipe to save to OSF (or another DataPipe-supported platform)

const save_data = {
  timeline: [
    { type: jsPsychPipe,
      action: "save",
      experiment_id: DataPipe_ID,
      filename: filename,
      data_string: () => jsPsych.data.get().csv()
    }
  ],
  conditional_function: function() {
    // Skip if local save is on
    if (typeof local_save !== "undefined" && local_save === true) {
      return false;
    } 
    return true;
  }
}







var debrief_statment = {
  timeline: [{
    type: jsPsychInstructions,
    pages: [
      `
  <div style="padding-left: 50px;">
    <div style="text-align: left;">
      <img style="height: 100px; float: right" src="https://usyd-meta-lab.github.io/files/usyd.ico"></img>
      <h1>Debrief Statement</h1>
      <h1 style="color:#e1310e">Research Study: Metacognition and Cognitive Performance</h1>
      Dr Kit Double (Responsible Researcher)<br>
      School of Psychology, Faculty of Science<br>
      Phone: +61 2 8627 8636| Email: kit.double@sydney.edu.au
    </div>
    <hr>
    <div style="text-align: left;">
      Thank you for completing the research study metacognition and cognitive performance. This study aims to understand how metacognitive self-evaluation affects cognitive performance.<br><br>
      Self-evaluation involves rating or evaluating your performance in some way. Self-evaluating while performing cognitive tasks (e.g., problem-solving tasks, memory tests) has been shown to affect performance. Generally, self-evaluation has a positive effect on cognitive performance, though this is not always the case. This research is interested in how people change their approach to problem-solving and other cognitive problems as a result of being asked to self-evaluate. <br><br>
      The study randomly assigned participants to complete a cognitive task either with or without prompting them to self-evaluate (by asking them to provide self-report ratings of their performance). We will assess how performing this self-evaluation affected cognitive performance on the task (i.e. did it improve or impair performance).<br><br>
      If you have any questions, now or at a later time, please feel free to contact Dr Kit Double (kit.double@sydney.edu.au) <br><br>
      The ethical aspects of this study have been approved by the Human Research Ethics Committee (HREC) of The University of Sydney [INSERT HREC Approval No. once obtained] according to the National Statement on Ethical Conduct in Human Research (2007).<br><br>
      If you are concerned about the way this study is being conducted or you wish to make a complaint to someone independent from the study, please contact the University:<br><br>
      Human Ethics Manager<br>
      human.ethics@sydney.edu.au<br>
      +61 2 8627 8176<br>
      <button onclick="window.print();return false;" />Print</button>
      <h4 style="color:#e1310e; text-align: center;">This debrief statement is for you to keep</h3>
    </div>
    <div style="text-align: center;"></div>
  </div>
  `
    ],
    show_clickable_nav: true,
    button_label_next: "Continue",
    allow_backward: false
  }],
  conditional_function: function(){
    if(typeof SONAID === 'undefined'){return false} else{ return true}
  }
}

var study_complete_notification = {
  timeline: [
    {
      type: jsPsychInstructions,
      pages: [
        `You have completed the study. Please notify the experimenter now.`
      ]
    }
  ],
  conditional_function: function(){
    if(typeof in_lab !== "undefined" && in_lab === true){
      return true
    } else{ 
      return false}
      
    }
  }

  var DEBRIEF_SONA2 = {
    timeline: [debrief_statment, study_complete_notification]
  }