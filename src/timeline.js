

loadTrials('src/trials')
.then((trials) => {
  
  // Define the timeline
  var timeline = [
    browserCheck,
    enter_fullscreen,
    check_fullscreen,
    welcome,
    hello_trial,
    save_data
  ];
  
  
  jsPsych.run(timeline);
})
.catch((error) => {
  console.error('[timeline] Unable to initialise experiment:', error);
});
