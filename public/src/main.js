const nImageInst = 2;
    /** load all the images, and remember to preload before starting the egitxperiment */
    var instruct_img = [];
    for (var i = 0; i < nImageInst; i++) {
      instruct_img.push('../img/instruct' + i + '.png');
    }

    var fixation_duration = 500;
    var successExp = false;
    
    var jsPsych = initJsPsych({
      extensions: [
        {type: jsPsychExtensionWebgazer}
      ], 
      on_finish: () => on_finish_callback(),
      on_close: () => on_finish_callback(),
      on_trial_finish: function () {if(successExp) {
        closeFullscreen()
        document.body.style.cursor = 'pointer'
        jsPsych.endExperiment(`<div>
        Thank you for your participation! You can close the browser to end the experiment now. </br>
                    The webcam will turn off when you close the browser. </br>
                      Your survey code is: ${makeSurveyCode('success')}. </br>
                     We will send you $7 as your participant fee soon! </br> 
        </div>`);
        }
    }

    });


    var subject_id = jsPsych.randomization.randomID(7);

    stimuli_data = jsPsych.randomization.shuffle(stimuli_data);
    console.log(stimuli_data);

    var start_exp_survey_trial = {
      type: jsPsychSurveyText,
      questions: [
        {prompt: "What's your worker ID?", rows: 2, columns:50 , required:true}, 
        {prompt: "What's your age?", rows: 1, columns: 50, required:true},
        {prompt: "What's your gender? (Female/Male/Other)", rows: 1, columns: 50,require: true},
      ],
      preamble: `<div>Thanks for choosing our experiment! Please answer the following questions to begin today's study. </div>`,
    };


    /** full screen */
    var fullscreenEnter = {
      type: jsPsychFullscreen,
      message: `<div> Before we begin, please close any unnecessary programs or applications on your computer. <br/>
      This will help the study run more smoothly.    <br/>
      Also, please close any browser tabs that could produce popups or alerts that would interfere with the study.    <br/>
      Finally, once the study has started, <b>DO NOT EXIT</b> fullscreen mode or you will terminate the study and not receive any payment. <br/>   
      <br><br/>
      The study will switch to full screen mode when you press the button below.  <br/>
      When you are ready to begin, press the button.</div>
    `,
      fullscreen_mode: true,
      // on_finish: function () {
      //   document.body.style.cursor = 'none'
      // }
    };

    var camera_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <p>This experiment uses your camera for eye tracking.</p>
        <p>In order to participate you must allow the experiment to use your camera.</p>
        <p>You will be prompted to do this on the next screen.</p>
        <p>If you do not want to permit the experiment to use your camera, please close the page.</p>
        press the <b>SPACE BAR</b> to begin.
      `,
      choices: [' '],
      post_trial_gap: 1000
    };
    
    var init_camera = {
      type: jsPsychWebgazerInitCamera
    };

    var calibration_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
      <div><font size=120%; font color = 'green';> Calibration & Validation</font><br/>
                                                                          <br><br/>
             <font size = 5px font color = "yellow">There are several <b>IMPORTANT</b> tips that are useful for passing the calibration task:<br/></font>
             <img height="200px" width="1000px" src="${instruct_img[1]}"><br/>
             <br><br/>
             <div style="text-align-last:left">
            In addition to the tips in the figure: <br/>
            (1). Use your eyes to look around the screen and try to avoid moving your head. <br/>
            (2). Try to keep lights in front of you rather than behind you so that the webcam can clearly see your face. Avoid sitting with a window behind you. <br/>
            (3). After you have made these adjustments, check again that your face fits nicely within the box on the video feed and that the box is green. <br/></div>
             <br><br/>
             <!-- <font size=5px; font color = 'red';> <b>NOTE</b>:  <br/>
            If you are back on this page, it means the calibration and validation did not work as well as we would like.  <br/>
            Please read the tips above again, make any adjustments, and try again.  <br/>
            There are only <b>THREE</b> chances to get this right.  <br/>
            Otherwise, the study cannot proceed and you will only receive 50 cents for participating.  </font><br/>
            <br><br/> -->
             <font   >When you are ready, press the <b>SPACE BAR</b> to continue. </font></div
      `,
      choices: [' '],
      
      post_trial_gap: 1000
    };

    var calibration = {
      type: jsPsychWebgazerCalibrate,
      calibration_points: [[50,50], [25,25], [25,75], [75,25], [75,75]],
      //calibration_points: [[10,10],[10,30],[10,50],[10,70],[10,90],[30,10],[30,30],[30,50],[30,70],[30,90],[50,10],[50,30],[50,50],[50,70],[50,90],[70,10],[70,30],[70,50],[70,70],[70,90],[90,10],[90,30],[90,50],[90,70],[90,90]],
      // calibration_points: [
      //   [10,10],[10,50],[10,90],
      //   [30,10],[30,50],[30,90],
      //   [40,10],[40,30],[40,40],[40,45],[40,50],[40,55],[40,60],[40,70],[40,90],
      //   [50,10],[50,30],[50,40],[50,45],[50,50],[50,55],[50,60],[50,70],[50,90],
      //   [60,10],[60,30],[60,40],[60,45],[60,50],[60,55],[60,60],[60,70],[60,90],
      //   [70,10],[70,50],[70,90],
      //   [90,10],[90,50],[90,90]],
      repetitions_per_point: 2,
      calibration_mode: 'view',
      time_per_point: 3000, 
      randomize_calibration_order: true,
    };

    var validation_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <p>Let's see how accurate the eye tracking is. </p>
        <p>Keep your head still, and move your eyes to focus on each dot as it appears.</p>
        <p>You do not need to click on the dots. Just move your eyes to look at the dots.</p>
        press the <b>SPACE BAR</b> to continue.`,
      choices: [' '],
      post_trial_gap: 1000
    };

    var validation = {
      type: jsPsychWebgazerValidate,
      validation_points: [[25,25], [25,75], [75,25], [75,75]],
      show_validation_data: false,
      roi_radius: 150,
      on_finish: (data) => console.log("sadfasdfa2", data.percent_in_roi)
    };

    // var task_instructions = {
    //   type: jsPsychHtmlButtonResponse,
    //   stimulus: `
    //     <p>We're ready for the task now.</p>
    //     <p>You'll see an arrow symbol (⬅ or ➡) appear on the screen.</p>
    //     <p>Your job is to press A if ⬅ appears, and L if ➡ appears.</p>
    //     <p>This will repeat 8 times.</p>
    //   `,
    //   choices: ['I am ready!'],
    //   post_trial_gap: 1000
    // };

    var task_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
      <div>
      <p> Now, we will begin with the choice task. Please keep your head still, otherwise we may have to redo the calibration and validation.<br/>
      There will be a break halfway through the task. During the break you can move your head if you need to.    <br/>
      You are choosing which option you would choose:</p>
     <br/>
      To select the left option, press  the <b><font color='green'>F</font></b> key; <br/>
      To select the right option, press the <b><font color='green'>J</font></b>  key;<br/>
                 <br><br/>
      After each choice, make sure to stare at the + that will appear on the screen, until they disappear.  <br/>
      <! -- This is part of ongoing adjustments to the eye-tracking.<br/> -->
      <p> When you are ready, press the <b>SPACE BAR</b> to begin with a couple of practice rounds.</p></div>
      `,
      choices: [' '],
      post_trial_gap: 1000
    };

    var fixation = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<p style="font-size:40px;">+</p>',
      choices: "NO_KEYS",
      trial_duration: fixation_duration
    };

    stimuli_data = jsPsych.randomization.shuffle(stimuli_data);

    var charity_prac_choice_count = 0;
    var charity_prac_choice = {
      timeline: [
      fixation,
        {
          type: jsPsychBinaryChoiceTableFour,
          stimulus: () => stimuli_data[charity_prac_choice_count],
          choices: ["F", "J"],
          realOrPrac: false,
          on_finish: () => charity_prac_choice_count++,
          extensions: [
        {type: jsPsychExtensionWebgazer, params: {targets: ['#up-left', '#bottom-right']}}  
      ]
        }
      ],
      loop_function: () => charity_prac_choice_count < 3,
    };


    var EnterRealChoice = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div> Now you can move on to the real choices. When you are ready, press the <b>SPACE BAR</b> to begin.</div>`,
        choices: [' '],
        post_trial_gap: 500,
    }
    

    var fixation1 = {
        type: jsPsychWebgazerValidate,
        validation_points: [[25,25], [25,75], [75,25], [75,75]],
        show_validation_data: false,
        roi_radius: 150,
        // on_finish: (data) => binary_choice_state_logger(data.accuracy)
        on_finish: (data) => console.log("accccc: ",data.percent_in_roi)
      };

    var if_node1 = {
        timeline: [fixation1],
        conditional_function: function(){
            if(Math.round(real_choice_counts%8) == 0){
                return true;
            } else {
                return false;
            }
        }
      }
      
      
      var if_node2 = {
        timeline: [fixation],
        conditional_function: function(){
            if(Math.round(real_choice_counts%8) != 0){
                return true;
            } else {
                return false;
            }
        }
      }
      stimuli_data = jsPsych.randomization.shuffle(stimuli_data);
    var real_choice_counts = 0;
    var real_choice = {
        timeline: [
            if_node1,
            if_node2,
            {
                type: jsPsychBinaryChoiceTableFour,
                stimulus: () => stimuli_data[real_choice_counts],
                choices: ["F", "J"],
                realOrPrac: true,
                on_finish: () => real_choice_counts++,
                extensions: [
                  {
                    type: jsPsychExtensionWebgazer,
                    params: {targets: ['#up-left', '#bottom-right']}
                  }  
            ]
            }
        ],
        loop_function: () => real_choice_counts < 10,
      };
  
      

    var trial = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        return(
        `<div style="position: relative; width: 400px; height: 400px;">
          <div style="position: absolute; top:${jsPsych.timelineVariable('top', true)}%; left: ${jsPsych.timelineVariable('left', true)}%">
            <span id="arrow-target" style="font-size: 40px; transform: translate(-50%, -50%);">${jsPsych.timelineVariable('direction', true) == 'left' ? '⬅' : '➡'}</span>
          </div>
        </div>`
        )
      },
      choices: ['a', 'l'],
      post_trial_gap: 750,
      data: {
        top: jsPsych.timelineVariable('top'),
        left: jsPsych.timelineVariable('left')
      },
      extensions: [
        {type: jsPsychExtensionWebgazer, params: {targets: ['#arrow-target']}}  
      ]
    };

    var params = [
      { left: 0, top: 0, direction: 'left' },
      { left: 100, top: 0, direction: 'left' },
      { left: 0, top: 100, direction: 'left' },
      { left: 100, top: 100, direction: 'left' },
      { left: 0, top: 0, direction: 'right' },
      { left: 100, top: 0, direction: 'right' },
      { left: 0, top: 100, direction: 'right' },
      { left: 100, top: 100, direction: 'right' },
    ];

    var trial_proc = {
      timeline: [fixation, trial],
      timeline_variables: params,
      randomize_order: true
    };


    var done = {
      type: jsPsychHtmlButtonResponse,
      choices: ['CSV', 'JSON'],
      stimulus: `<p>Done!</p><p>If you'd like to download a copy of the data to explore, click the format you'd like below</p>`,
      on_finish: function(data){
        if(data.response == 0){
          jsPsych.data.get().localSave('csv','webgazer-sample-data.csv');
        }
        if(data.response == 1){
          jsPsych.data.get().localSave('json', 'webgazer-sample-data.json');
        }
      }
    };

    var success_guard = {
        type: jsPsychCallFunction,
        func: () => {successExp = true}
    };

    var on_finish_callback = function () {
        // jsPsych.data.displayData();
        jsPsych.data.addProperties({
            browser_name: bowser.name,
            browser_type: bowser.version,
            subject: subject_id,
            interaction: jsPsych.data.getInteractionData().json(),
            //quiz: quiz_correct_count,
            windowWidth: screen.width,
            windowHight: screen.height
        });
        var data = JSON.stringify(jsPsych.data.get().values());
        $.ajax({
             type: "POST",
             url: "/data",
             data: data,
             contentType: "application/json"
           })
           .done(function () {
             // alert("your data has been saved!")
           })
           .fail(function () {
             //alert("problem occured while writing data to box.");
        })
    }

    function startExp(){
        var timeline = [];
        timeline.push(start_exp_survey_trial);
        timeline.push(fullscreenEnter)
        timeline.push(camera_instructions);
        timeline.push(init_camera);
        timeline.push(calibration_instructions);
        timeline.push(calibration);
        timeline.push(validation_instructions);
        timeline.push(validation);
        timeline.push(task_instructions);
        timeline.push(charity_prac_choice);
        timeline.push(EnterRealChoice);
        timeline.push(real_choice);

        // timeline.push(trial_proc);
        timeline.push(done);
        // timeline.push(success_guard);
    
        jsPsych.run(timeline);
    }
    
