const nImageInst = 2;
    /** load all the images, and remember to preload before starting the egitxperiment */
    var instruct_img = [];
    for (var i = 0; i < nImageInst; i++) {
      instruct_img.push('../img/instruct' + i + '.png');
    }
    instruct_img.push('../img/svo_example.jpg');
    var fixation_duration = 500;
    var successExp = false;
    var resize_screen = false;

    function closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    }
    var jsPsych = initJsPsych({
      extensions: [
        {type: jsPsychExtensionWebgazer}
      ], 
      on_finish: () => on_finish_callback(),
      on_close: () => on_finish_callback(),
      on_trial_finish: function () {if(successExp) {
        closeFullscreen();
        document.body.style.cursor = 'auto';
        jsPsych.endExperiment(`<div>
        Your survey code is: <b> 756CE43D </br>
        You can close the browser to end the experiment now. </br>
                    The webcam will turn off when you close the browser. </br>
                     
                     
        </div>`);
        }
    }

    });
    var condition_control = {
      instruction: "There are no right or wrong answers. Choose the option that matches your preferences.",
      condition: "control"
    }
    var condition_alturist = {
      instruction: "Please choose the options that maximize the other participant's payoff.",
      condition: "alturist"
    }
    var condition_proself = {
      instruction: "Please choose the options that maximizes your payoff.",
      condition: "self"
    }

    var condition_id = jsPsych.randomization.shuffle([condition_control, condition_alturist, condition_control])[1];
    var subject_id = jsPsych.randomization.randomID(7);
    var participant_stimuli_list = ['you_top', "top_down"];
    var participant_payoff_order = (jsPsych.randomization.shuffle(participant_stimuli_list)[1] == 'you_top') ;


    stimuli_data = jsPsych.randomization.shuffle(stimuli_data);
    console.log(stimuli_data);



    function makeSurveyCode(status) {
      uploadSubjectStatus(status);
      var prefix = {'success': 'cg', 'failed': 'sb'}[status]
      return `${prefix}${subject_id}`;
    }
    
    function uploadSubjectStatus(status) {
      $.ajax({
        type: "POST",
        url: "/subject-status",
        data: JSON.stringify({subject_id, status}),
        contentType: "application/json"
      });
    }
    

// **********************
// ****** Trials ********
// **********************

    var start_exp_survey_trial = {
      type: jsPsychSurveyText,
      questions: [
        {prompt: "What's your prolific ID?", rows: 2, columns:50 , required:true}, 
        {prompt: "What's your age?", rows: 1, columns: 50, required:true},
        {prompt: "What's your gender? (Female/Male/Other)", rows: 1, columns: 50,require: true},
      ],
      preamble: `<div>Thank you for participating in this study! Please answer the following questions to begin the study. </div>`,
    };

    

    /** full screen */
    var fullscreenEnter = {
      type: jsPsychFullscreen,
      message: `<div> Before we begin, please close any unnecessary programs or applications on your computer. <br/>
      This will help the study run more smoothly.    <br/>
      Also, please close any browser tabs that could produce popups or alerts that would interfere with the study.    <br/>
      Finally, once the study has started, <b>DO NOT EXIT</b> fullscreen mode or you will terminate the study and not receive any payment. <br/>   
      <br>
      The study will switch to full screen mode when you press the button below.  <br/>
      When you are ready to begin, press the button.<br> <br></div>
    `,
      fullscreen_mode: true,
      on_finish: function () {
      //   document.body.style.cursor = 'none'
      window.onresize = resize
      function resize() {
        if(successExp && !resize_screen){
          resize_screen = false;
          console.log("end experiment resize");
        } else{
          resize_screen = true;
          console.log("Resized!");
          alert("You exited the full screen mode! The experiment cannot continue!");
          // location.reload(true);
          // window.location.href = window.location;
          window.location.href = "views/failed.html";
          
        }
      }
    }
    };

    var SVO_instruction = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: ` <div style="width: 80%; margin: auto;">
      <p> In this task, imagine that you have been randomly paired with another person,
      whom we will refer to as <b>the other</b>. This other person is someone you do not
      know and will remain mutually anonymous. All of your choices would be
      completely confidential. </p> 
      <p> You will be making a series of decisions about allocating resources between you
      and this other person. For each of the following questions, please indicate the
      distribution you prefer most by <b> selecting the button above the payoff
      allocations</b>. You can only make one selection for each question. Your decisions
      will yield money for both yourself and the other person. In the example below, a
      person has chosen to distribute the payoff so that he/she receives 40 dollars, while
      the anonymous other person receives 50 dollars. </p>
      
      <img height="150px" src="${instruct_img[2]}"><br/>

      <p> There	are	no	right	or	wrong	answers,	this	is	all	about	personal	preferences.	After	you	
      have	made	your	decision,	<b> select	the	resulting	distribution	of	money	by	clicking	on	
      button	above	your	choice. </b>	As	you	can	see,	your	choices	will	influence	both	the	amount	
      of	money 	you	receive	as	well	as	the	amount	of	money	the	other	receives.
      </p>
      <br>
      Press the <b>SPACE BAR</b> to begin.
      </div>`,
      choices: [' '],
      post_trial_gap: 1000
    };

    var SVO_prompt = "You receive: <br> | <br> Other receives:";


    var SVO_trial_likert = {
      type: jsPsychSVOSurveyLikert,
      questions:[
        {
          prompt: SVO_prompt, 
          name: 'SVO_1', 
          labels: [`\n85\n | \n85`, `\n85\n | \n76`, `\n85\n | \n68`,`\n85\n | \n59`, `\n85\n | \n50`, `\n85\n | \n41`, `\n85\n | \n33`, `\n85\n | \n24`, `\n85\n | \n15`], 
          required: true
        },
        {
          prompt: SVO_prompt, 
          name: 'SVO_2', 
          labels: [`\n85\n | \n15`, `\n87\n | \n19`,`\n89\n | \n24`, `\n91\n | \n28`, `\n93\n | \n33`, `\n94\n | \n37`, `\n96\n | \n41`, `\n98\n | \n46`, `\n100\n | \n50`], 
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_3', 
          labels: [`\n50\n | \n100`, `\n54\n | \n98`,`\n59\n | \n96`, `\n63\n | \n94`, `\n68\n | \n93`, `\n72\n | \n91`, `\n76\n | \n89`, `\n81\n | \n87`, `\n85\n | \n85`], 
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_4', 
          labels: [`\n50\n | \n100`, `\n54\n | \n89`,`\n59\n | \n79`, `\n63\n | \n68`, `\n68\n | \n58`, `\n72\n | \n47`, `\n76\n | \n36`, `\n81\n | \n26`, `\n85\n | \n15`], 
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_5', 
          labels: [`\n100\n | \n50`, `\n94\n | \n56`,`\n88\n | \n63`, `\n81\n | \n69`, `\n75\n | \n75`, `\n69\n | \n81`, `\n63\n | \n88`, `\n56\n | \n94`, `\n50\n | \n100`], 
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_6', 
          labels: [`\n100\n | \n50`, `\n98\n | \n54`,`\n96\n | \n59`, `\n94\n | \n63`, `\n93\n | \n68`, `\n91\n | \n72`, `\n89\n | \n76`, `\n87\n | \n81`, `\n85\n | \n85`], 
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_7', 
          labels: [`\n100\n | \n50`, `\n96\n | \n56`,`\n93\n | \n63`, `\n89\n | \n69`, `\n85\n | \n75`, `\n81\n | \n81`, `\n78\n | \n88`, `\n74\n | \n94`, `\n70\n | \n100`],  
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_8', 
          labels: [`\n90\n | \n100`, `\n91\n | \n99`,`\n93\n | \n98`, `\n94\n | \n96`, `\n95\n | \n95`, `\n96\n | \n94`, `\n98\n | \n93`, `\n99\n | \n91`, `\n100\n | \n90`],  
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_9', 
          labels: [`\n100\n | \n70`, `\n94\n | \n74`,`\n88\n | \n78`, `\n81\n | \n81`, `\n75\n | \n85`, `\n69\n | \n89`, `\n63\n | \n93`, `\n56\n | \n96`, `\n50\n | \n100`],  
          required: true
        }, {
          prompt: SVO_prompt,
          name: 'SVO_10', 
          labels: [`\n100\n | \n70`, `\n99\n | \n74`,`\n98\n | \n78`, `\n96\n | \n81`, `\n95\n | \n85`, `\n94\n | \n89`, `\n93\n | \n93`, `\n91\n | \n96`, `\n90\n | \n100`],  
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_11', 
          labels: [`\n70\n | \n100`, `\n74\n | \n96`,`\n78\n | \n93`, `\n81\n | \n89`, `\n85\n | \n85`, `\n89\n | \n81`, `\n93\n | \n78`, `\n96\n | \n74`, `\n100\n | \n70`],  
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_12', 
          labels: [`\n50\n | \n100`, `\n56\n | \n99`,`\n63\n | \n98`, `\n69\n | \n96`, `\n75\n | \n95`, `\n81\n | \n94`, `\n88\n | \n93`, `\n94\n | \n91`, `\n100\n | \n90`],   
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_13', 
          labels: [`\n50\n | \n100`, `\n56\n | \n94`,`\n63\n | \n88`, `\n69\n | \n81`, `\n75\n | \n75`, `\n81\n | \n69`, `\n88\n | \n63`, `\n94\n | \n56`, `\n100\n | \n50`],   
          required: true
        }, {
          prompt: SVO_prompt,
          name: 'SVO_14', 
          labels: [`\n100\n | \n90`, `\n96\n | \n91`,`\n93\n | \n93`, `\n89\n | \n94`, `\n85\n | \n95`, `\n81\n | \n96`, `\n78\n | \n98`, `\n74\n | \n99`, `\n70\n | \n100`],  
          required: true
        }, {
          prompt: SVO_prompt,
          name: 'SVO_15', 
          labels: [`\n90\n | \n100`, `\n91\n | \n94`,`\n93\n | \n88`, `\n94\n | \n81`, `\n95\n | \n75`, `\n96\n | \n69`, `\n98\n | \n63`, `\n99\n | \n56`, `\n100\n | \n50`],    
          required: true
        }, 
      ]
    };

    
    var likert_scale = [
      "Strongly Disagree", 
      "Disagree", 
      "Neutral", 
      "Agree", 
      "Strongly Agree"
    ];


    var camera_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <p>This experiment uses your camera for eye tracking.</p>
        <p>In order to participate you must allow the experiment to use your camera.</p>
        <p>You will be prompted to do this on the next screen.</p>
        <p>If you do not want to permit the experiment to use your camera, please close the page.</p>
        <p>Loading the next page may take a few seconds, thank you for your patience.</p>
        Press the <b>SPACE BAR</b> to begin.
      `,
      choices: [' '],
      post_trial_gap: 1000
    };


    var choice_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
      <p> In the following trials, we will show you two options. In each option,
      you will see your payoff as well as another participant's payoff value.
      You have to choose between the left option and right option by pressing on the following keys: </p>
      <br>
      To select the left option, press the <b><font color='green'>F</font></b> key
      <br>
      To select the right option, press the <b><font color='green'>J</font></b> key
      <p>
      <b>
      ${condition_id['instruction']}
      </b>
      </p>
      <p>
      We record your eye movement in the following part of the experiment.
      In order to have accurate data quality, please sit a way that you can comfortably reach
      and press the F, J and SPACE BAR on the keyboard. </p>
      <p>
      We will run calibration and verification for eye tracking.
      We will run a few rounds of calibration and verification throughout the trials to increase eye tracking data quality. 
      
      <br>

      Press <b>SPACE BAR</b> to continue
      
      `,
      choices: [' '],
      post_trial_gap: 1000
    };


    
    var init_camera = {
      type: jsPsychWebgazerInitCamera,
      on_finish: function () {
        document.body.style.cursor = 'none'
      }
    };

    var calibration_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
      <div><font size=120%; font color = 'green';> Calibration & Validation</font><br/>
                                                                          <br><br/>
             <font size = 3px font color = "black">There are several <b>IMPORTANT</b> tips that are useful for passing the calibration task:<br/></font>
             <img height="200px" width="1000px" src="${instruct_img[1]}"><br/>
             <br><br/>
             <div style="text-align-last:left">
            In addition to the tips in the figure: <br/>
            (1). Use your eyes to look around the screen and try to avoid moving your head. <br/>
            (2). Try to keep lights in front of you rather than behind you so that the webcam can clearly see your face. Avoid sitting with a window behind you. <br/>
            (3). After you have made these adjustments, check again that your face fits nicely within the box on the video feed and that the box is green. <br/></div>
             <br><br/>
             
             <div>
                There are two parts to this process. The first part is calibration and the second part is validation.<br/>
                <br><br/>
                During calibration, you will see a series of dots like this <span id="calibration_dot_instruction"></span> appear on the screen, each for 2 seconds.<br/>
                Your task is simply to stare directly at each dot until it disappears.<br/>
                Then, quickly move your eyes to the next dot and repeat.<br/>
                <br>
                Validation is basically the same as calibration. You simply need to stare at each dot until it and disappears.<br/>
          <br>
             <font   >When you are ready, press the <b>SPACE BAR</b> to continue. </font></div
      `,
      choices: [' '],
      
      post_trial_gap: 1000
    };

    var calibration = {
      type: jsPsychWebgazerCalibrate,
      calibration_points: [[90,10], [10,90] ,[10,10], [50,50], [25,25], [25,75], [75,25], [75,75], [90,90]],
      // calibration_points: [[50,50], [25,25], [25,75], [75,25], [75,75]],
      //calibration_points: [[10,10],[10,30],[10,50],[10,70],[10,90],[30,10],[30,30],[30,50],[30,70],[30,90],[50,10],[50,30],[50,50],[50,70],[50,90],[70,10],[70,30],[70,50],[70,70],[70,90],[90,10],[90,30],[90,50],[90,70],[90,90]],
      // calibration_points: [
      //   [10,10],[10,50],[10,90],
      //   [30,10],[30,50],[30,90],
      //   [40,10],[40,30],[40,40],[40,45],[40,50],[40,55],[40,60],[40,70],[40,90],
      //   [50,10],[50,30],[50,40],[50,45],[50,50],[50,55],[50,60],[50,70],[50,90],
      //   [60,10],[60,30],[60,40],[60,45],[60,50],[60,55],[60,60],[60,70],[60,90],
      //   [70,10],[70,50],[70,90],
      //   [90,10],[90,50],[90,90]],
      repetitions_per_point: 1 ,
      calibration_mode: 'view',
      time_per_point: 2000, 
      randomize_calibration_order: true,
    };

    var validation_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <p>Let's see how accurate the eye tracking is. </p>
        <p>Keep your head still, and move your eyes to focus on each dot as it appears.</p>
        <p>You do not need to click on the dots. Just move your eyes to look at the dots.</p>
        Press the <b>SPACE BAR</b> to continue.`,
      choices: [' '],
      post_trial_gap: 1000
    };

    var validation_points_array = [[25,25], [25,75], [75,25], 
      [75,75], [25,50], [50,50],
      [75,50], [50,25], [50,75]];
        var validation_points_trial = jsPsych.randomization.shuffle(validation_points_array);

    var validation = {
      type: jsPsychWebgazerValidate,
      validation_points: validation_points_trial.slice(0, 4),
      show_validation_data: false,
      roi_radius: 150,
      validation_duration: 1000,
      on_finish: (data) => console.log("sadfasdfa2", data.percent_in_roi)
    };


  //   <div>
  //   <p> Now, we will begin with the choice task. Please keep your head still, otherwise we may have to redo the calibration and validation.<br/>
  //   There will be a break halfway through the task. During the break you can move your head if you need to.    <br/>
  //   You are choosing which option you would choose:</p>
  //  <br/>
  //   To select the left option, press  the <b><font color='green'>F</font></b> key; <br/>
  //   To select the right option, press the <b><font color='green'>J</font></b>  key;<br/>
  //              <br><br/>
  //   After each choice, make sure to stare at the + that will appear on the screen, until they disappear.  <br/>
  //   <!-- This is part of ongoing adjustments to the eye-tracking.<br/> -->
  //   <p> When you are ready, press the <b>SPACE BAR</b> to begin with a couple of practice rounds.</p></div>

    var task_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
      <div>
      <p> Now, we will begin with the choice task. Please keep your head still. <br/>
      As a quick reminder,  ${condition_id['instruction']}</p>
     <br/>
      To select the left option, press  the <b><font color='green'>F</font></b> key; <br/>
      To select the right option, press the <b><font color='green'>J</font></b>  key;<br/>
                 <br><br/>
      After each choice, make sure to stare at the + that will appear on the screen, until they disappear.  <br/>
      <!-- This is part of ongoing adjustments to the eye-tracking.<br/> -->
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
          payoffYouTop: participant_payoff_order, 
          on_finish: () => charity_prac_choice_count++,
          extensions: [
        {type: jsPsychExtensionWebgazer, params: {targets: ['#up-left', '#bottom-right']}}  
      ]
        }
      ],
      loop_function: () => charity_prac_choice_count < 3,
      // on_start: () => {this.jsPsych.extensions.webgazer.showPredictions();
      //   this.jsPsych.extensions.webgazer.resume();
      // }
    };


    var EnterRealChoice = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div> Now you can move on to the real choices. When you are ready, press the <b>SPACE BAR</b> to begin.</div>`,
        choices: [' '],
        post_trial_gap: 500,
    }
    
    var cali_vali_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
      <div>We need to redo the calibration and validation before you return to the study.  </br>
      As before, make sure you stare at each dot until it disappears and make sure you don’t move your head.</br>
       <br></br>
       Press the <b>SPACE BAR</b> when you are ready to begin.</div>`,
      choices: [' '],
      post_trial_gap: 1000
    };

    var fixation_cali = {
        type: jsPsychWebgazerCalibrate,
        calibration_points: [[90,10], [10,90] ,[10,10], [50,50], [25,25], [25,75], [75,25], [75,75], [90,90]],
        //calibration_points: [[10,10],[10,30],[10,50],[10,70],[10,90],[30,10],[30,30],[30,50],[30,70],[30,90],[50,10],[50,30],[50,50],[50,70],[50,90],[70,10],[70,30],[70,50],[70,70],[70,90],[90,10],[90,30],[90,50],[90,70],[90,90]],
        // calibration_points: [
        //   [10,10],[10,50],[10,90],
        //   [30,10],[30,50],[30,90],
        //   [40,10],[40,30],[40,40],[40,45],[40,50],[40,55],[40,60],[40,70],[40,90],
        //   [50,10],[50,30],[50,40],[50,45],[50,50],[50,55],[50,60],[50,70],[50,90],
        //   [60,10],[60,30],[60,40],[60,45],[60,50],[60,55],[60,60],[60,70],[60,90],
        //   [70,10],[70,50],[70,90],
        //   [90,10],[90,50],[90,90]],
        repetitions_per_point: 1,
        calibration_mode: 'view',
        time_per_point: 2000, 
        randomize_calibration_order: true,
      };

    var fixation1 = {
        type: jsPsychWebgazerValidate,
        validation_points: [[25,25], [25,75], [75,25], [75,75]],
        show_validation_data: false,
        roi_radius: 150,
        on_finish: (data) => console.log("acc: ",data.percent_in_roi),
        on_start: (fixation1) => fixation1.validation_points = jsPsych.randomization.shuffle(validation_points_array).slice(0,3)
      };

    var if_node1 = {
        timeline: [cali_vali_instructions ,fixation_cali, fixation1],
        conditional_function: function(){
            if(real_choice_counts == 5 ){
                return true;
            } else {
                return false;
            }
        }
      }
      
      
      var if_node2 = {
        timeline: [fixation],
        conditional_function: function(){
            if(real_choice_counts != 5 && real_choice_counts != 10){
                return true;
            } else {
                return false;
            }
        }
      }

      var if_node3 = {
        timeline: [cali_vali_instructions , fixation1],
        conditional_function: function(){
            if (real_choice_counts == 10){
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
            if_node3,
            {
                type: jsPsychBinaryChoiceTableFour,
                stimulus: () => stimuli_data[real_choice_counts],
                choices: ["F", "J"],
                realOrPrac: true,
                payoffYouTop: participant_payoff_order,
                on_finish: () => real_choice_counts++,
                extensions: [
                  {
                    type: jsPsychExtensionWebgazer,
                    params: {targets: ['#up-left', '#bottom-right']}
                  }  
            ]
            }
        ],
        loop_function: () => real_choice_counts < 24,
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

    
    var feedback = {
      type: jsPsychSurveyText,
      questions: [
        {prompt: "Do you have any feedback for us?", rows: 5, columns:100 , required:false} 
        ],
      preamble: `<div style="max-width: 1000px;"> You have come to the end of our study.
      We thank you very much for your participation! <br>
      At this point, we would like to ask you for any feedback that you might have with regard to our
      study. If you do, please enter them in the box below. If you do not have any feedback,
      please leave the box empty and click on the <b>Continue</b> button.
       </div>`,
      on_load: function () {
        document.body.style.cursor = 'auto'
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
            condition: condition_id['condition'],
            payoff_order: participant_payoff_order,
            interaction: jsPsych.data.getInteractionData().json(),
            //quiz: quiz_correct_count,
            windowWidth: screen.width,
            windowHeight: screen.height
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
        
        timeline.push(fullscreenEnter);
        
        timeline.push(SVO_instruction);
        // timeline.push(SVO_trial);
        timeline.push(SVO_trial_likert);
        timeline.push(choice_instructions);
        timeline.push(calibration_instructions);
        timeline.push(camera_instructions);
        timeline.push(init_camera);
        timeline.push(calibration);
        timeline.push(validation_instructions);
        timeline.push(validation);
        timeline.push(task_instructions);
        timeline.push(charity_prac_choice);
        timeline.push(EnterRealChoice);
        timeline.push(real_choice);
        
        // timeline.push(trial_proc);
        // timeline.push(done);
        timeline.push(feedback);
        timeline.push(success_guard);
        
        jsPsych.run(timeline);
    }
    
