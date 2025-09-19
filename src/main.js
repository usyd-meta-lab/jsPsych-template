/* 
===============================================================
=                INITALISE JSPSYCH                =
===============================================================
*/

var jsPsych = initJsPsych({
    
    on_trial_finish: function(data){
        
        
        // Timestamp
        data.timeStamp = Date().toLocaleString("en-AU", {
            timeZone: "Australia/Sydney"
        });
        
        // Debug Mode
        if(is_DEBUG) console.log(data);
        
        
    },
    
    on_finish: function(data){
        
        // Check if forced abort
        if(aborted) return;
        
        // Store variables
        jsPsych.data.addProperties({ 
            jsPsych_template: "2.0.0", 
            urlVariables: urlVariables,
            totalTime: jsPsych.getTotalTime()
        });
        
        // Local save?
        if(local_save) jsPsych.data.get().localSave('csv','mydata.csv');
        
        // In lab?
        if(in_lab) return;
        
        // Debug Mode        
        if(is_DEBUG) {jsPsych.data.displayData('csv'); return}
        
        
        // Average accuracy 
        const meanCorrect = jsPsych.data.get().filter({trial_type: "Summary Trial"}).select('correct').mean();
        
        // Redirect
        if(meanCorrect < accuracy_criterion){var final_redirect = attention_redirect_link} else {var final_redirect = redirect_link}
        window.location = final_redirect;
        
        
    },
    
    on_interaction_data_update: function(data) {
        // If participant exits fullscreen, note it (unless in DEBUG).
        if (data.event === 'fullscreenexit' && is_DEBUG !== 'true') {
            in_fullscreen = false;
        }
    },
});


/* 
===============================================================
=                ID AND SOURCE                =
===============================================================
*/

// Store IDs from URL
urlVariables = jsPsych.data.urlVariables();

// Note recruitment source
const is_SONA = Object.prototype.hasOwnProperty.call(urlVariables, 'SONAID')
const is_PROLIFIC = Object.prototype.hasOwnProperty.call(urlVariables, 'PROLIFIC_PID')

// Store ID, source, and redirect
if(is_SONA){
    const SONAID = jsPsych.data.getURLVariable('SONAID');
    jsPsych.data.addProperties({ participant_id: SONAID, Source: "SONA" });
    // SONA Redirect links
    redirect_link = `https://sydneypsych.sona-systems.com/webstudy_credit.aspx?experiment_id=${sona_experiment_id}&credit_token=${sona_credit_token}&survey_code=${SONAID}&id=${SONAID}`;
    attention_redirect_link = `https://sydney.au1.qualtrics.com/jfe/form/SV_3h2qh8pBAnv00QK?SONAID=${SONAID}&accuracy=`;
}

else if(is_PROLIFIC){
    const PROLIFIC_PID = jsPsych.data.getURLVariable('PROLIFIC_PID');
    jsPsych.data.addProperties({ participant_id: PROLIFIC_PID, Source: "Prolific" });
    // Prolific Redirect links
    redirect_link = `https://app.prolific.com/submissions/complete?cc=${Prolific_redirect}`;
    attention_redirect_link = `https://app.prolific.co/submissions/complete?cc=${Prolific_failed_check}`;
}

else if(in_lab){
    console.log("In lab study, random ID generated")
    jsPsych.data.addProperties({ participant_id: jsPsych.randomization.randomID(), Source: "Lab" });
}

else{
    if(!is_DEBUG) alert("Warning...no ID has been passed to the experiment.")
    }




/* 
===============================================================
=               SAVE DATA                =
===============================================================
*/



// Filename and location to save data
const subject_id = jsPsych.randomization.randomID(10);
const filename   = `participant-${subject_id}_data.csv`;

// We use jsPsychPipe to save to OSF 

const save_data = {
    timeline: [
        { type: jsPsychPipe,
            action: "save",
            experiment_id: DataPipe_ID,
            filename: filename,
            data_string: () => jsPsych.data.get().csv()
        },
        {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Data saved successfully. Press <strong>Continue</strong> to be redirected back to your recruitment platform.</p>',
            choices: ['Continue']
            
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





/* 
===============================================================
=                STANDARDISED TRIALS (move to cloud)                 =
===============================================================
*/


// Check browser compatability
var browserCheck = {
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
};


// Initalise full screen
const enter_fullscreen = {
    timeline: [
        {
            type: jsPsychFullscreen,
            message: '<p>To take part in the experiment, your browser must be in fullscreen mode. Exiting fullscreen mode will pause the experiment.<br><br>Please click the button below to enable fullscreen and continue.</p>',
            fullscreen_mode: true,
            on_finish: function(){
                in_fullscreen = true; // update tracker
            }
        }
    ],
    conditional_function: function() {
        // Skip if in DEBUG
        if (is_DEBUG) {
            return false;
        } 
        return true;
    }
};


// Check Fullscreen
var check_fullscreen = {
    timeline: [
        
        {type: jsPsychFullscreen,
            message: '<p>You need to be in fullscreen mode to continue the experiment! <br></br> Please click the button below to enter fullscreen mode.<br></br><p>',
            fullscreen_mode: true,
            on_finish: function(){
                in_fullscreen = true;
            }
        }
    ],
    conditional_function: function(){
        if(in_fullscreen  | is_DEBUG){
            return false;
        } else {
            return true;
        }
    }
};

// Optional debug question: Issues encountered?
const debug = {
    type: jsPsychSurveyText,
    questions: [
        {prompt: 'Did you experience any issues while completing this study?', rows: 5}
    ]
};

