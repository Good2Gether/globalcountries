    /** load all the images, and remember to preload before starting the experiment */


    ///////
    /////// EXPERIMENT SETUP
    ///////


   /* preload images */
    var preload = {
      type: jsPsychPreload,
      images: [
        '../img/star_purple.jpg', 
        '../img/star_yellow.jpg', 
        '../img/star_patterned.jpg',
        '../img/ios1.png', 
        '../img/ios2.png', 
        '../img/ios3.png',
        '../img/ios4.png',
        '../img/ios5.png',
        '../img/ios6.png',
        '../img/ios7.png',
        '../img/instruct0.png',
        '../img/instruct1.png']
    };

    var fixation_duration = 1000;
    var successExp = false;
    var resize_screen = false;stimuli_data_r1

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
        var randomCode = jsPsych.randomization.randomID(7);
        jsPsych.endExperiment(`<div>
        Your survey code is: <b>92830102<b></b></br>
        You can close the browser to end the experiment now. </br>
                    The webcam will turn off when you close the browser. </br>
                     
                     
        </div>`);
        }
    }

    });

    var subject_id = jsPsych.randomization.randomID(7);
    var participant_stimuli_list = ['you_top', "top_down"];
    var participant_otherinfostimuli_list = ['group_top', "group_down"];
    var participant_LMR_list = ['0','1','2'];
    var participant_payoff_order = (jsPsych.randomization.shuffle(participant_stimuli_list)[1] == 'you_top');
    var participant_otherinfo_order = (jsPsych.randomization.shuffle(participant_otherinfostimuli_list)[1] == 'group_top');
    var participant_LMR_order = (jsPsych.randomization.shuffle(participant_LMR_list)[1]);

    console.log("participant_payoff_order: " + participant_payoff_order);
    console.log("participant_otherinfo_order: " + participant_otherinfo_order);
    console.log("participant_LMR_order: " + participant_LMR_order);


    stimuli_data = jsPsych.randomization.shuffle(stimuli_data);
    console.log(stimuli_data);

    stimuli_data_r1 = jsPsych.randomization.shuffle(stimuli_data_r1);

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

    ///////
    /////// PRELIMINARY INSTRUCTIONS
    ///////

    var start_exp_survey_trial = {
      type: jsPsychSurveyText,
      questions: [
        {prompt: "What's your toloka ID? (needed for bonus payment)", rows: 2, columns:50 , required:true}, 
        {prompt: "What's your age?", rows: 1, columns: 50, required:true},
        {prompt: "What's your gender? (Female/Male/Other)", rows: 1, columns: 50,require: true},
      ],
      preamble: `<div>Thank you for participating in this study! Please answer the following questions. </div>`,
    };

    

    /** full screen */
    var fullscreenEnter = {
      type: jsPsychFullscreen,
      message: `<div> Before we begin, please close any unnecessary browser tabs, programs or applications on your computer. <br/>
      This will help the study run more smoothly and ensure that no popups or alerts can interfere with the study.    <br/>
      The study will switch to fullscreen mode after this page.    <br/>
      <b>DO NOT EXIT</b> fullscreen mode or you will terminate the study and not receive any payment. <br/>   
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
          window.location.href = "../views/failed.html";
          
        }
      }
    }
    };


    ///////
    /////// SVO
    ///////

    // INSTRUCTIONS
    var SVO_instruction = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: ` <div style="width: 80%; margin: auto;">
      <p> In this task, you are randomly paired with another participant.
      We will call this participant the <b>other</b>. 
      You do not know each other, and you will not learn who the other person is after the experiment. </p>
      <p> You will make decisions about giving points to you and to this other person. 
      This person will not know whose choices will affect them. </p> 
      <p> 
      In this task, you decide how many points to give to yourself and the other person by <b> selecting the button above the options </b>. 
      You can only choose one option for each question. </p>
      <p> The points are worth money, and will give both you and the other person an additional payment. </p>
      <p> Look at the example below. Someone chose the option to get 40 points for themselves. In this option, the anonymous other person gets 50 points.</p>
      
      <img height="150px" src="../img/svo_example.jpg"><br/>

      <p> There are no right or wrong answers, this is all about personal preferences.
      Make your choice and	<b> click on the button above the option you want. </b>	
      </p>
      <p>
      At the end of the study, it will be randomly chosen whether YOUR choice (determining the
        payoffs for yourself and another participant)
      will be implemented OR if the choice of another participant will be implemented for you. 
      <br> 
      <br>
      <b> 100 points are worth 0.37$ (about 30 Rupee, 7 Rand, or 6.5 Peso).  </b>

      </p>
      <br>
      Press <b>SPACE</b> to begin!
      </div>`,
      choices: [' '],
      post_trial_gap: 1000
    };

    var SVO_prompt = "You get: <br> | <br> Other gets:";

    // TASK 

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
        },
      ],
      preamble: "For each task, click on the option you prefer.", 
    };

  

    ///////
    /////// GROUP ALLOCATION
    ///////

     /* Define global variables */
     var globalothergroup_text;
     var globalgroup_letter;
     var globalgroup_text;
     var globalothergroup_letter1;
     var globalothergroup_letter2;
     var globalothergroup_letter3;
   

    var groupassignment = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
        return `<p>In this study, you work together with other participants from your country. 
        There are also participants from other countries. </br> </br>  Which country are you from? </br> </br> 
        Press I for India. </br>  Press M for Mexico. </br>  Press U for USA. </br>  Press S for South Africa.
        `
    },
      choices: ['u','s','i','m'],
      on_finish: function(data){
        // score the resp onse by comparing the key that was pressed (data.response) against the 
        // correct response for this trial ('f'), and store reponse accuracy in the trial data
        if(jsPsych.pluginAPI.compareKeys(data.response, 's')){
          globalgroup_text = "South Africa";
          globalgroup_letter = "S";
          globalothergroup_text = "USA, Mexico, and India";
          globalothergroup_letter1 = "U";
          globalothergroup_letter2 = "M";
          globalothergroup_letter3 = "I";
        } else if(jsPsych.pluginAPI.compareKeys(data.response, 'm')){
          globalgroup_text = "Mexico";
          globalgroup_letter = "M";
          globalothergroup_text = "USA, South Africa, and India";
          globalothergroup_letter1 = "U";
          globalothergroup_letter2 = "S";
          globalothergroup_letter3 = "I";
        } else if(jsPsych.pluginAPI.compareKeys(data.response, 'u')){
          globalgroup_text = "USA";
          globalgroup_letter = "U";
          globalothergroup_text = "South Africa, Mexico, and India";
          globalothergroup_letter1 = "S";
          globalothergroup_letter2 = "M";
          globalothergroup_letter3 = "I";
        } else if(jsPsych.pluginAPI.compareKeys(data.response, 'i')){
          globalgroup_text = "India";
          globalgroup_letter = "I";
          globalothergroup_text = "USA, Mexico, and South Africa";
          globalothergroup_letter1 = "U";
          globalothergroup_letter2 = "M";
          globalothergroup_letter3 = "S";
        }
        console.log(globalgroup_text, globalothergroup_text)
      },
      data: function() { 
        return {group_text: globalgroup_text,
                othergroup_text: globalothergroup_text,
            };
        }, 
    }
    

    /* donetext */
    var donetext = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: ` <p>Done! </p>
    <p>Press <b>SPACE</b> to move on!</p>
      `,
      choices: [' '],
    };
  
    /* define debrief */
    var group_debrief_block = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
        return `<p style=color: magenta; >You indicated that you are from ${globalgroup_text}.</p>
          <p>You will join other participants from ${globalgroup_text} in a team: Team ${globalgroup_text}!</p>
          <p></p>
          <p>Press <b>SPACE</b> to move on!</p>`;
        },
      data: function() { 
        return {group_text: globalgroup_text,
                othergroup_text: globalothergroup_text,
            };
        }, 
      post_trial_gap: 1000,
      choices: [' '],
      
    };
  
        /* define debrief */
        var group_debrief_block2 = {
          type: jsPsychHtmlKeyboardResponse,
          stimulus: function() {
            return `<p style=color: magenta; >Other participants in this study are from ${globalothergroup_text}. They each form their own teams.</p>
              <p>Your team is Team ${globalgroup_text}!</p>
              <p></p>
              <p>Press <b>SPACE</b> to move on!</p>`;
            },
          data: function() { 
            return {group_text: globalgroup_text,
                    othergroup_text: globalothergroup_text,
                };
            }, 
          post_trial_gap: 1000,
          choices: [' '],
          
        };

 
    ///////
    /////// GROUP REINFORCEMENT
    ///////

     /* define instructions trial */
     var star_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function(){
        return `
         <p>In this task, you will work together with Team ${globalgroup_text} to win a game against participants from the other countries (${globalothergroup_text}). </p>
         <p>A star will appear in the middle of the screen. For each round, you decide which color it has. Stars can be purple, yellow or blue. </br> </br></p>
         <p>When you press the <strong>correct key</strong>, you win 10 points for your team, Team ${globalgroup_text}.</p>
         <p>But when you press the <strong>wrong key</strong>, your team looses 10 points.</p>
         <p>Bonus: If you're faster than a random person from all teams, you team wins 100 extra points.</p>
         <p>Team ${globalgroup_text} wins if you gather more points than the other teams (teams from ${globalothergroup_text}). The winning team gets a bonus payment of 0.75$ (about 60 Rupee, 14 Rand, or 13 Peso). </br> </br></p> 
         <p>Place your fingers on the keys to get ready. </p>
         <div style="display: flex; justify-content: space-between; align-items: center; flex-direction: row;">
         <div style="display: flex; flex-direction: column; align-items: center;">
             <img src="img/star_purple.jpg" style="width: 100px;">
             <p class='small'><strong>Press F</strong><br> for purple stars!</p> 
             </div>
         <div style="display: flex; flex-direction: column; align-items: center;">
            <img src="img/star_patterned.jpg" style="width: 100px;">
            <p class='small';><strong>Press SPACE</strong><br> for blue stars!</p>
            </div>
        <div style="display: flex; flex-direction: column; align-items: center;">
            <img src="img/star_yellow.jpg" style="width: 100px;">
            <p class='small'><strong>Press J</strong><br> for yellow stars!</p>
            </div>
        </div>

        <p style=color: magenta; >Give your best for Team ${globalgroup_text}! </p>
        <p>Press <b>SPACE</b> to begin!</p>
        `;
      },
      post_trial_gap: 1000,
      choices: [' '],
      data: function() { 
        return {group_text: globalgroup_text,
                othergroup_text: globalothergroup_text,
            };
        }, 
    };

 /* define trial stimuli array for timeline variables */
 var star_test_stimuli = [
      { stimulus: "img/star_purple.jpg",  correct_response: 'f'},
      { stimulus: "img/star_yellow.jpg",  correct_response: 'j'},
      { stimulus: "img/star_patterned.jpg",  correct_response: ' '}
    ];

    /* define fixation and test trials */
    var star_fixation = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: "NO_KEYS",
      trial_duration: function(){
        return jsPsych.randomization.sampleWithoutReplacement([100, 150, 200, 250, 500, 750, 1000, 1250], 1)[0];
      },
      data: {
        task: 'star_fixation'
      }
    };

    var star_test = {
      type: jsPsychImageKeyboardResponse,
      stimulus: jsPsych.timelineVariable('stimulus'),
      choices: ['f', 'j', ' '],
      data: {
        task: 'star_response',
        correct_response: jsPsych.timelineVariable('correct_response')
      },
      on_finish: function(data){
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
      }
    };

    /* define test procedure */
    var star_test_procedure = {
      timeline: [star_fixation, star_test],
      timeline_variables: star_test_stimuli,
      repetitions: 4, 
      randomize_order: true
    };


    /* define debrief */
    var star_debrief_block = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {

        var star_trials = jsPsych.data.get().filter({task: 'star_response'});
        var star_correct_trials = star_trials.filter({correct: true});
        var star_accuracy = Math.round(star_correct_trials.count() / star_trials.count() * 100);
        var star_rt = Math.round(star_correct_trials.select('rt').mean());

        return `<p style=color: magenta; >Good job, Team ${globalgroup_text}!</p>
          <p>You pressed the correct key ${star_accuracy}% of the time.</p>
          <p>Your average response time was ${star_rt}ms.</p>
          <p>You will learn about the bonus payments for your team after the study, when all the other participants had a chance to compete.</p>
          <p>Press <b>SPACE</b> to move on!</p>`;

      },
      post_trial_gap: 1000,
      choices: [' '],
    };

    ///////
    /////// MAIN TASK INSTRUCTIONS 
    ///////


    var choice_instructions1 = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<div style="width: 80%; margin: auto;">
      <p> In the next task, you will decide to give points to yourself and other participants in this study in multiple rounds. </p>
      For each decision, another participant is randomly matched with you. For each option, you will see <b>how many points you get</b>, 
      and <b>how many points the other participant gets</b>. </p>
      <p> Each time, you have two options: Option F (on the left) and Option J (on the right). </p>
    
      Press <b><font color='magenta'>F</font></b> to choose <b><font color='magenta'>Option F</font></b> (the option on the left).
      <br>
      Press <b><font color='magenta'>J</font></b> to choose <b><font color='magenta'>Option J</font></b> (the option on the right).
      <p>
      <b>      
      </b>
      </p>
      <p> How much money you earn depends on your own or someone else's decisions. A coin toss will decide what will happen: </br>
      one of your own decisions is randomly chosen to be paid out to you and the other player. </br>
      OR </br>
      someone else's decision is randomly chosen to be paid out, and you receive what they decided. </p></br>
      <p> 100 points are worth 0.37$ (about 30 Rupee, 7 Rand, or 6.5 Peso). Each decision you make has the same chance to be picked to be paid out.<p/> 

      <p>Press <b>SPACE</b> to continue!</p>
      </div>
      `,
      choices: [' '],
      post_trial_gap: 1000
    };

    var choice_instructions2 = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
        return ` <p> In each round, you will also see two pieces of information about the other participant:</p>
            <p> <b>Other's Country</b>    and    <b>Other's Random Number</b> </br></br> </p>
            <p> <b>Other's Country</b>: This information tells you if the other person belongs to your team (Team ${globalgroup_text}).</br>
            If the person <span style="color: magenta;"><b>IS</b> in your team</span>, you will see the 
            letter <span style="color: magenta;"> <strong>${globalgroup_letter}</strong>, the first letter of ${globalgroup_text}</span>. </br>
            If the person <span style="color: magenta;">is <b>NOT</b> in your team</span>, you will see the 
            letters <span style="color: magenta;"> <strong>${globalothergroup_letter1}, ${globalothergroup_letter2}, or ${globalothergroup_letter3}</strong> 
            </span> (first letters of the countries ${globalothergroup_text}).</p>
            <p> <b>Other's Random Number</b>: This information tells you a random number that belongs to the other participant. It can be any number up to 99. </br>
            Every person gets a random number in this study.</p>
            <p>Press <b>SPACE</b> to see an example!</p>  
          `;

      },
      post_trial_gap: 1000,
      choices: [' '],
    };

    var imgSrc;
    var choice_instructions3 = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
        if (globalgroup_text === "India" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkI_YouTop_GroupTop0.png";
        } else if (globalgroup_text === "India" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkI_YouBottom_GroupBottom0.png";
        } else if (globalgroup_text === "India" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkI_YouTop_GroupBottom0.png";
        } else if (globalgroup_text === "India" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkI_YouBottom_GroupTop0.png";
        } else if (globalgroup_text === "Mexico" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkM_YouTop_GroupTop0.png";
        } else if (globalgroup_text === "Mexico" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkM_YouBottom_GroupBottom0.png";
        } else if (globalgroup_text === "Mexico" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkM_YouTop_GroupBottom0.png";
        } else if (globalgroup_text === "Mexico" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkM_YouBottom_GroupTop0.png";
        } else if (globalgroup_text === "USA" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkU_YouTop_GroupTop0.png";
        } else if (globalgroup_text === "USA" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkU_YouBottom_GroupBottom0.png";
        } else if (globalgroup_text === "USA" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkU_YouTop_GroupBottom0.png";
        } else if (globalgroup_text === "USA" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkU_YouBottom_GroupTop0.png";
        } else if (globalgroup_text === "South Africa" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkS_YouTop_GroupTop0.png";
        } else if (globalgroup_text === "South Africa" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkS_YouBottom_GroupBottom0.png";
        } else if (globalgroup_text === "South Africa" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkS_YouTop_GroupBottom0.png";
        } else if (globalgroup_text === "South Africa" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
          imgSrc = "../img/comp_checkS_YouBottom_GroupTop0.png";
        } 
        else if (globalgroup_text === "India" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkI_YouTop_GroupTop1.png";
        } else if (globalgroup_text === "India" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkI_YouBottom_GroupBottom1.png";
        } else if (globalgroup_text === "India" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkI_YouTop_GroupBottom1.png";
        } else if (globalgroup_text === "India" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkI_YouBottom_GroupTop1.png";
        } else if (globalgroup_text === "Mexico" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkM_YouTop_GroupTop1.png";
        } else if (globalgroup_text === "Mexico" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkM_YouBottom_GroupBottom1.png";
        } else if (globalgroup_text === "Mexico" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkM_YouTop_GroupBottom1.png";
        } else if (globalgroup_text === "Mexico" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkM_YouBottom_GroupTop1.png";
        } else if (globalgroup_text === "USA" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkU_YouTop_GroupTop1.png";
        } else if (globalgroup_text === "USA" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkU_YouBottom_GroupBottom1.png";
        } else if (globalgroup_text === "USA" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkU_YouTop_GroupBottom1.png";
        } else if (globalgroup_text === "USA" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkU_YouBottom_GroupTop1.png";
        } else if (globalgroup_text === "South Africa" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkS_YouTop_GroupTop1.png";
        } else if (globalgroup_text === "South Africa" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkS_YouBottom_GroupBottom1.png";
        } else if (globalgroup_text === "South Africa" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkS_YouTop_GroupBottom1.png";
        } else if (globalgroup_text === "South Africa" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
          imgSrc = "../img/comp_checkS_YouBottom_GroupTop1.png";
        }  
        else if (globalgroup_text === "India" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkI_YouTop_GroupTop2.png";
        } else if (globalgroup_text === "India" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkI_YouBottom_GroupBottom2.png";
        } else if (globalgroup_text === "India" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkI_YouTop_GroupBottom2.png";
        } else if (globalgroup_text === "India" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkI_YouBottom_GroupTop2.png";
        } else if (globalgroup_text === "Mexico" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkM_YouTop_GroupTop2.png";
        } else if (globalgroup_text === "Mexico" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkM_YouBottom_GroupBottom2.png";
        } else if (globalgroup_text === "Mexico" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkM_YouTop_GroupBottom2.png";
        } else if (globalgroup_text === "Mexico" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkM_YouBottom_GroupTop2.png";
        } else if (globalgroup_text === "USA" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkU_YouTop_GroupTop2.png";
        } else if (globalgroup_text === "USA" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkU_YouBottom_GroupBottom2.png";
        } else if (globalgroup_text === "USA" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkU_YouTop_GroupBottom2.png";
        } else if (globalgroup_text === "USA" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkU_YouBottom_GroupTop2.png";
        } else if (globalgroup_text === "South Africa" && participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkS_YouTop_GroupTop2.png";
        } else if (globalgroup_text === "South Africa" && !participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkS_YouBottom_GroupBottom2.png";
        } else if (globalgroup_text === "South Africa" && participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkS_YouTop_GroupBottom2.png";
        } else if (globalgroup_text === "South Africa" && !participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
          imgSrc = "../img/comp_checkS_YouBottom_GroupTop2.png";
        }  
        return `<div style="width: 80%; margin: auto; text-align: center;">
      <p>Here is an example of how the decision tasks will look. </br> </p>
      <img height="600px" src="${imgSrc}"><br/>
      <p> Each box shows you information about the decision:
      <div style="width: 80%; margin: auto; text-align:left;">
      <ul>
      <li>How many points you get if you choose Option F or J.</li>
      <li>How many points the other person get if you choose Option F or J.</li> 
      <li>If the other person belongs to ${globalgroup_text} (letter ${globalgroup_letter}) or not (letters ${globalothergroup_letter1}, ${globalothergroup_letter2}, ${globalothergroup_letter3}). </li>
      <li>What random number the other person has.</li>
      </ul></p> 
      </div> </br> </br>

      Press <b>SPACE</b> to continue!</p>
      </div>
      `;
      },
      choices: [' '],
      post_trial_gap: 1000
    };

    ///////
    /////// COMPREHENSION QUESTIONS
    ///////


    // QUESTION 1
    var comprehension_check1 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
        return `<div style="max-width: 80%; margin:auto;  text-align: center;"> 
           
          <img height="600px" src="${imgSrc}"><br/>
          <br>
          </div>
          <p>Imagine you choose Option F (left). </br>
          How many points will the <b> other person </b> get? Click on the answer!</p>
          `
      }, 
        name: 'comp_check_otherreceive', 
        choices: ['59', '56', '22', '15'],
        button_html: '<button class="jspsych-btn">%choice%</button>', 
        required: true
    };

    // FEEDBACK 1
    var comprehension_feedback1 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
        return `<div style="max-width: 80%; margin:auto;  text-align: center;"> 
           
          <img height="600px" src="${imgSrc}"><br/>
          <br>
          </div>
          <p>In this example, if you choose Option F (left), the <b> other person </b> gets 59 points.</p>
          `}, 
        name: 'comp_check_otherreceive', 
        choices: ['OK I understand'], 
        button_html: '<button class="jspsych-btn">%choice%</button>',
        required: true
    };

    // QUESTION 2
    var comprehension_check2 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
        return `<div style="max-width: 80%; margin:auto; text-align: center;"> 
           
          <img height="600px" src="${imgSrc}"><br/>
          <br>
          </div>
          <p>Look at this example again.<br>

          Is the other person <b>part of your team</b>? Click on the answer!</p>`
        }, 
        name: 'comp_check_ingroup', 
        choices: ['YES', 'NO'], 
        button_html: '<button class="jspsych-btn">%choice%</button>',
        required: true,
    };

    // FEEDBACK 2

    var comprehension_feedback2 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
        return `
        <div style="max-width: 80%; margin:auto;  text-align: center;"> 
           
        <img height="600px" src="${imgSrc}"><br/>
        <br>
        </div>
        <p style=color: magenta;}>In this example, the other person <b>IS IN YOUR TEAM </b>(Team ${globalgroup_text}). You can tell because there is a <b>${globalgroup_letter}</b> shown.</p>
        <p style=color: magenta;}>When the other person is not in your team, there is a <b>${globalothergroup_letter1}, ${globalothergroup_letter2}, or ${globalothergroup_letter3}</b> shown.</p>`;
        }, 
      post_trial_gap: 1000,
      choices: ['OK I understand'],
      button_html: '<button class="jspsych-btn">%choice%</button>',
      required: true
    };


    // QUESTION 3
    var comprehension_check3 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
        return `<div style="max-width: 80%; margin:auto; text-align: center;"> 
           
          <img height="600px" src="${imgSrc}"><br/>
          <br>
          </div>
          <p>Last question about this example:.<br>

          If you choose Option J, how many points do <b>you get</b>? Click on the answer!</p>`
        }, 
        name: 'comp_check_ownreceive', 
        choices: ['59', '56', '22', '15'],
        button_html: '<button class="jspsych-btn">%choice%</button>',
        required: true,
    };

    // FEEDBACK 3
    var comprehension_feedback3 = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
        return `<div style="max-width: 80%; margin:auto;  text-align: center;"> 
           
          <img height="600px" src="${imgSrc}"><br/>
          <br>
          </div>
          <p>In this example, if you choose Option J (on the right), <b> you </b> get 15 points.</p> 
          `}, 
        name: 'comp_check_ownreceive', 
        choices: ['OK I understand'], 
        button_html: '<button class="jspsych-btn">%choice%</button>',
        required: true
    };
    
    ///////
    /////// SET UP WEBCAM AND EYE-TRACKING
    ///////

    // INITIATLIZE CAMERA
    var init_camera = {
      type: jsPsychWebgazerInitCamera,
      on_finish: function () {
        document.body.style.cursor = 'none'
      }
    };

    // CALIBRATION INSTRUCTION 
    var calibration_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
      <div>
             <font size = 4px font color = "black">      <p> We record your eye movements in this decision task.</p>
             <p> You need to help the camera get a good view of your eyes. To do that, it's <b>IMPORTANT</b> that you follow these rules: <br/> <br/> <br/></font>
             <img height="200px" width="1000px" src="../img/instruct1.png"><br/>
             <br><br/>
            Keep lights in front of you. No windows or lamps behind you. <br/> <br/>
             <br><br/>
             On the next page, you will start the eye tracking. Use the rules above.                 <br><br/>
             <div>
                After that, you will teach the computer to track your eyes.<br/>
                You will see a <b>black circle</b> on the screen.<br/>
                Look directly at each circle until it goes away.<br/>
                Then, <b>move your eyes</b> to look at the next circle, and repeat.<br/>
          <br>
             <font   >Press <b>SPACE</b> to start eye tracking! </font></div
      `,
      choices: [' '], 
      
      post_trial_gap: 1000
    };

    // CALIBRATION PROCEDURE
    var calibration = {
      type: jsPsychWebgazerCalibrate,
      calibration_points: [[90,10], [10,90] ,[10,10], [50,50], [25,25], [25,75], [75,25], [75,75], [90,90]],
      repetitions_per_point: 1 ,
      calibration_mode: 'view',
      time_per_point: 2500, 
      randomize_calibration_order: true,
    };

    // VALIDATION INSTRUCTIONS
    var validation_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <p>Let's do this again. </p>
        <p>Keep your head still. Move your eyes to look at each circle.</p>
        Press <b>SPACE</b> to continue!`,
      choices: [' '],
      post_trial_gap: 1000
    };

    // VALIDATION PROCEDURE
    var validation_points_array = [[25,25], [25,75], [75,25], 
      [75,75], [25,50], [50,50],
      [75,50], [50,25], [50,75]];
        var validation_points_trial = jsPsych.randomization.shuffle(validation_points_array);

    var validation = {
      type: jsPsychWebgazerValidate,
      validation_points: validation_points_trial.slice(0, 4),
      show_validation_data: false,
      roi_radius: 150,
      validation_duration: 2000,
      on_finish: (data) => console.log("sadfasdfa2", data.percent_in_roi)
    };


    ///////
    /////// PRACTICE TRIALS
    ///////

    // BUTTON REMINDERS
    var task_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
      <div style="width: 80%; margin: auto;">
      <p> Let's practice the decision task. Please keep your head still. <br/>
     <br/>
      Before each round, a "+" will appear on the screen. Look at it until it goes away.  <br/>
      
      Press <b><font color='magenta'>F</font></b> to choose <b><font color='magenta'>Option F</font></b>.
     <br>
     Press <b><font color='magenta'>J</font></b> to choose <b><font color='magenta'>Option J</font></b>.
                 <br><br/></p>

      <p> Press <b>SPACE</b> for three example tasks!</p></div>
      `,
      choices: [' '],
      post_trial_gap: 1000
    };

    // FIXATION CROSS
    var fixation = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<p id = "fix" style="font-size:40px;">+</p>',
      choices: "NO_KEYS",
      trial_duration: fixation_duration,
      extensions: [
        {
          type: jsPsychExtensionWebgazer,
          params: {targets: ['#fix']}
        }]
    };

    // SHUFFLE EXAMPLE DATA TO SHOW IN RANDOM ORDER
    stimuli_data = jsPsych.randomization.shuffle(stimuli_data);

    // START PRACTICE TRIALS (show 3)
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
          payoffGroupTop: participant_otherinfo_order, 
          payoffLMR: participant_LMR_order,
          on_finish: () => charity_prac_choice_count++,
          extensions: [
        {type: jsPsychExtensionWebgazer, params: {targets: ['#up-left', '#bottom-right']}}  
      ]
        }
      ],
      loop_function: () => charity_prac_choice_count < 4,
    };

    ///////
    /////// START MAIN DECISION PHASE
    ///////

    var EnterRealChoice = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div> Now it's time for the real decisions. <br></br>
        Press <b>SPACE</b> to begin!</div>`,
        choices: [' '],
        post_trial_gap: 500,
    }
    
    // RECALIBRATION 
    var cali_vali_instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
      <div>We need to check the webcam again.  </br>
      Stare at each circle until it goes away. Look with your eyes. Don’t move your head.</br>
       <br></br>
       Press <b>SPACE</b> to begin!</div>`,
      choices: [' '],
      post_trial_gap: 1000
    };

    // FIXATIONS TO CALIBRATE
    var fixation_cali = {
        type: jsPsychWebgazerCalibrate,
        calibration_points: [[90,10], [10,90] ,[10,10], [50,50], [25,25], [25,75], [75,25], [75,75], [90,90]],
        repetitions_per_point: 1,
        calibration_mode: 'view',
        time_per_point: 2500, 
        randomize_calibration_order: true,
      };

    // FIXATIONS TO VALIDATE
    var fixation1 = {
        type: jsPsychWebgazerValidate,
        validation_points: [[25,25], [25,75], [75,25], [75,75]],
        show_validation_data: false,
        roi_radius: 150,
        validation_duration: 2000,
        on_finish: (data) => console.log("acc: ",data.percent_in_roi),
        on_start: (fixation1) => fixation1.validation_points = jsPsych.randomization.shuffle(validation_points_array).slice(0,3)
      };

    // RUN CALIBRATION PROCEDURE BEFORE TRIALS 0, 12, 24, 36, 48 
    var if_node1 = {
        timeline: [cali_vali_instructions ,fixation_cali, fixation1],
        conditional_function: function(){
            if(real_choice_counts == 0 || real_choice_counts == 12 || real_choice_counts == 24 || real_choice_counts == 36 || real_choice_counts == 48){
                return true;
            } else {
                return false;
            }
        }
      }
      
    // RUN FIXATION CROSS FOR TRIALS THAT ARE NOT 0, 12, 24, 36, 48 
    var if_node2 = {
      timeline: [fixation],
      conditional_function: function(){
          if(real_choice_counts != 0 && real_choice_counts != 12 && real_choice_counts != 24  && real_choice_counts != 36 && real_choice_counts != 48 ){
              return true;
          } else {
              return false;
          }
      }
    }

    // RUN FULL CALI VALI AT TRIAL 0 -- we don't use this
    var if_node3 = {
      timeline: [calibration , validation],
      conditional_function: function(){
          if (real_choice_counts == 10){
              return true;
          } else {
              return false;
          }
      }
    }

    // SHUFFLE STIMULI
    var stimuli_data_b1 = jsPsych.randomization.shuffle(stimuli_data_r1);
  
    // SET TRIAL COUNT TO 0
    var real_choice_counts = 0;
  
    // RUN DECISION TRIALS 
    var real_choice = {
      timeline: [
        if_node1,
        if_node2,
        {
          type: jsPsychBinaryChoiceTableFour,
          stimulus: () => stimuli_data_b1[real_choice_counts%10],
          choices: ["F", "J"],
          realOrPrac: true,
          payoffYouTop: participant_payoff_order,
          payoffGroupTop: participant_otherinfo_order, 
          payoffLMR: participant_LMR_order,
          on_start: function(trial) {
            document.body.classList.add('no-scroll');
          },
          on_finish: function(trial) {
            real_choice_counts++;
            document.body.classList.remove('no-scroll');
          },
          extensions: [
            {
              type: jsPsychExtensionWebgazer,
              params: {targets: ['#up-left', '#bottom-right']}
            }  
          ]
        }
      ],
      loop_function: () => real_choice_counts < 80, // set number of trials here
    };

    var donecursor = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: ` <p>Done! You can move around freely again. The webcam will not track your gaze anymore.</p>
        <p>Press SPACE to move on.</p>
      `,
      choices: [' '],
      on_load: function () {
        document.body.style.cursor = 'auto';
      }
    };

    ///////
    /////// EXPLICIT PREFERENCE TO LOOK
    ///////

    /* check if participants want to see */
    var lookcheck_trial = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
        return `
         <p>In this task, you have 100 points that are worth 0.37$ (about 30 Rupee, 7 Rand, or 6.5 Peso).</p> 
         <p>You can keep these points to yourself, or you can give some or all of the points to another participant in this study. </p>
         <p>This other participant is either a member of your team, ${globalgroup_text}, or a member of the other teams from ${globalothergroup_text}.</p>
         <p><strong>Would you like to know which team the other participant belongs to?</strong></p>`;
        },
        choices: ['YES, I want to know which team the other participant belongs to!','NO, I do not want to know which team the other participant belongs to.'],
        button_html: '<button class="jspsych-btn">%choice%</button>',
        required: true
      }

      var lookcheck_trial_M = {
        type: jsPsychSurveyText,
        questions: [
        {prompt: "How many points do you give to the other participant?", rows: 2, columns:50 , required:true, placeholder: 'Enter a number between 0 and 100', name:'lookcheck_other_G'}, 
        ], 
        preamble: `
        <div style="color: magenta;">The other participant belongs to TEAM MEXICO.</div>
        <div>You have 100 points. Decide how much to give to the other participant. You will keep the rest for yourself. </div>`,
      };

      var lookcheck_trial_I = {
        type: jsPsychSurveyText,
        questions: [
        {prompt: "How many points do you give to the other participant?", rows: 2, columns:50 , required:true, placeholder: 'Enter a number between 0 and 100', name:'lookcheck_other_B'}, 
        ], 
        preamble: `
        <div style="color: magenta;">The other participant belongs to TEAM INDIA.</div>
        <div>You have 100 points. Decide how much to give to the other participant. You will keep the rest for yourself. </div>`,
      };

      var lookcheck_trial_G = {
        type: jsPsychSurveyText,
        questions: [
        {prompt: "How many points do you give to the other participant?", rows: 2, columns:50 , required:true, placeholder: 'Enter a number between 0 and 100', name:'lookcheck_other_B'}, 
        ], 
        preamble: `
        <div style="color: magenta;">The other participant belongs to TEAM USA.</div>
        <div>You have 100 points. Decide how much to give to the other participant. You will keep the rest for yourself. </div>`,
      };

      var lookcheck_trial_S = {
        type: jsPsychSurveyText,
        questions: [
        {prompt: "How many points do you give to the other participant?", rows: 2, columns:50 , required:true, placeholder: 'Enter a number between 0 and 100', name:'lookcheck_other_B'}, 
        ], 
        preamble: `
        <div style="color: magenta;">The other participant belongs to TEAM SOUTH AFRICA.</div>
        <div>You have 100 points. Decide how much to give to the other participant. You will keep the rest for yourself. </div>`,
      };
  
    var lookcheck_trial_anonymous = {
        type: jsPsychSurveyText,
        questions: [
        {prompt: "How many points do you give to the other participant?", rows: 2, columns:50 , required:true, placeholder: 'Enter a number between 0 and 100', name:'lookcheck_other_anonymous'}, 
        ], 
        preamble: `
        <div style="color: magenta;">We won't tell you which team the other player belongs to.</div>
        <div>You have 100 points. Decide how much to give to the other participant. You will keep the rest for yourself. </div>`,
      };


    // Randomly select one of the trials
    var lookcheck_trials = [lookcheck_trial_G, lookcheck_trial_M, lookcheck_trial_I, lookcheck_trial_S, lookcheck_trial_anonymous];
    var selected_lookcheck = jsPsych.randomization.sampleWithoutReplacement(lookcheck_trials, 1)[0];

    // Push the selected trial to the timeline

    ///////
    /////// Expectations
    ///////
    
    /* participant expectations about own payout */
    var expectations_favoritism = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p>In this game, would you expect to get more points from another participant </br> who IS IN YOUR TEAM, rather than from someone who is in the other team? </br> </br> Click on your answer!</p>',
      choices: ['YES', 'NO'],
      button_html: '<button class="jspsych-btn">%choice%</button>',
      required: true
    };

    /* participant expectations about other players */
    var expectations_others = {
      type: jsPsychSurveyText,
      questions: [
      {prompt: "Out of 100 participants in this study, how many <b>want to KNOW which team the other participant belongs to</b>?", rows: 2, columns:50 , required:true, placeholder: 'Enter a number between 0 and 100', name:'expectations_others_look'},
      {prompt: "Out of 100 participants in this study, how many <b>GIVE MORE points to another participant who belongs to the SAME team</b>?", rows: 2, columns:50 , required:true, placeholder: 'Enter a number between 0 and 100', name:'expectations_others_give'}, 
      {prompt: "Out of 100 participants in this study, how many <b>expect to GET MORE points from another participant who belongs to the SAME team</b>?", rows: 2, columns:50 , required:true, placeholder: 'Enter a number between 0 and 100', name:'expectations_others_get'}, 
      ], 
      preamble: `
      <div>How do you think other participants decided in the previous task about splitting 100 points?</br> </br> </div>`,
    };
  
    ///////
    /////// GROUP IDENTIFICATION, ATTITUDE, LIKING
    ///////

       // define the images to display
       var ios_images = [
         "img/ios1.png",
         "img/ios2.png",
         "img/ios3.png",
         "img/ios4.png",
         "img/ios5.png",
         "img/ios6.png",
         "img/ios7.png"
    ];

    var teamcheck_trial = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p>Which team do you belong to?  </br> </br> Click on the correct answer!</p>',
      choices: ['TEAM INDIA', 'TEAM USA', 'TEAM MEXICO', 'TEAM SOUTH AFRICA'],
      button_html: '<button class="jspsych-btn">%choice%</button>',
      required: true
    };


    
    var ios_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
        return `
         <p>How do you feel about your team, ${globalgroup_text}? </p>
         <p>Click on the image that best describes your relationship with your team:</p>`;
    },
    choices: [
        "<img src='" + ios_images[0] + "' style='max-width: 200px;'/>",
        "<img src='" + ios_images[1] + "' style='max-width: 200px;'/>",
        "<img src='" + ios_images[2] + "' style='max-width: 200px;'/>",
        "<img src='" + ios_images[3] + "' style='max-width: 200px;'/>",
        "<img src='" + ios_images[4] + "' style='max-width: 200px;'/>",
        "<img src='" + ios_images[5] + "' style='max-width: 200px;'/>",
        "<img src='" + ios_images[6] + "' style='max-width: 200px;'/>"
    ],
    button_html: '<button class="jspsych-btn">%choice%</button>',
    required: true
    };

    /* rating intro */
    var rateintro = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
        return `
         <p>Next, we will ask you some questions about your team, ${globalgroup_text}, and about the other teams from ${globalothergroup_text}. </p>
         <p>Press <b>SPACE</b> to continue!</p>`;
        },
      choices: [' '],
    };


    // Define the statements to be rated
    var group_statements_M = [   
      "I see myself as a member of TEAM MEXICO.",  
      "I like TEAM MEXICO."];

   var group_statements_I = [  
      "I see myself as a member of TEAM INDIA.",  
      "I like TEAM INDIA."];

    var group_statements_G = [  
      "I see myself as a member of TEAM USA.",  
      "I like TEAM USA."];

      var group_statements_S = [  
        "I see myself as a member of TEAM SOUTH AFRICA.",  
        "I like TEAM SOUTH AFRICA."];

   // Define the Likert scale labels
   var group_scale_labels = [
     "Totally Disagree",
     "Somewhat Disagree",
     "Slightly Disagree",
     "Neutral",
     "Slightly Agree",
     "Somewhat Agree",
     "Totally Agree"
   ];

   var ident_G_trials = [];
   for (var i = 0; i < group_statements_G.length; i++) {
     var ident_G_trial = {
       type: jsPsychSurveyLikert,
       preamble: "Please rate your agreement with the these statements about <span style='color: magenta;'>TEAM USA:</span>",
       questions: [{prompt: group_statements_G[i], labels: group_scale_labels, required: true, name: 'ident_g'+i}],
     };
     ident_G_trials.push(ident_G_trial); 
   }

   var ident_I_trials = [];
   for (var i = 0; i < group_statements_I.length; i++) {
     var ident_I_trial = {
       type: jsPsychSurveyLikert,
       preamble: "Please rate your agreement with the these statements about <span style='color: magenta;'>TEAM INDIA:</span>",
       questions: [{prompt: group_statements_I[i], labels: group_scale_labels, required: true, name: 'ident_i'+i}],
     };
     ident_I_trials.push(ident_I_trial); 
   }

   var ident_M_trials = [];
   for (var i = 0; i < group_statements_M.length; i++) {
     var ident_M_trial = {
       type: jsPsychSurveyLikert,
       preamble: "Please rate your agreement with the these statements about <span style='color: magenta;'>TEAM MEXICO:</span>",
       questions: [{prompt: group_statements_M[i], labels: group_scale_labels, required: true, name: 'ident_m'+i}],
     };
     ident_M_trials.push(ident_M_trial); 
   }

   var ident_S_trials = [];
   for (var i = 0; i < group_statements_S.length; i++) {
     var ident_S_trial = {
       type: jsPsychSurveyLikert,
       preamble: "Please rate your agreement with the these statements about <span style='color: magenta;'>TEAM SOUTH AFRICA:</span>",
       questions: [{prompt: group_statements_S[i], labels: group_scale_labels, required: true, name: 'ident_s'+i}],
     };
     ident_S_trials.push(ident_S_trial); 
   }
   ///////
   //// Individualism collectivism
   ///////

   // Define the Likert scale labels
   var indicol_scale_labels = [
     "Never or definitely no",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "Always or definitely yes"
   ];

   var indicol = {
    type: jsPsychSurveyLikert,
    preamble: "Please rate how these statements apply to you.",
    questions: [
      {prompt: "I rely on myself most of the time; I rarely rely on others.", name: 'HI2', labels: indicol_scale_labels},
      {prompt: "My personal identity, independent of others, is very important to me.", name: 'HI4', labels: indicol_scale_labels},
      {prompt: "It is important that I do my job better than others.", name: 'VI1', labels: indicol_scale_labels},
      {prompt: "Winning is everything.", name: 'VI2', labels: indicol_scale_labels},
      {prompt: "If a coworker gets a prize, I would feel proud.", name: 'HC1', labels: indicol_scale_labels},
      {prompt: "To me, pleasure is spending time with others.", name: 'HC3', labels: indicol_scale_labels},
      {prompt: "It is my duty to take care of my family, even when I have to sacrifice what I want.", name: 'VC2', labels: indicol_scale_labels},
      {prompt: "It is important to me that I respect the decisions made by my groups.", name: 'VC4', labels: indicol_scale_labels},
    ],
    randomize_question_order: true
  };


    ///////
    /////// COUNTRY, VISION
    ///////
    
    var visioncheck_trial = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p>Did you wear glasses during the study?  </br> </br> Click on your answer!</p>',
      choices: ['YES', 'NO'],
      button_html: '<button class="jspsych-btn">%choice%</button>',
      required: true
    };

    var eslcheck_trial = {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p>Is English your native language?  </br> </br> Click on your answer!</p>',
      choices: ['YES', 'NO'],
      button_html: '<button class="jspsych-btn">%choice%</button>',
      required: true
    };

    var country_survey_trial = {
      type: jsPsychSurveyText,
      questions: [
        {prompt: "In which country have you spent the most time before you turned 18?", rows: 2, columns:50 , required:true, name:'country10'}, 
        {prompt: "In which country do you currently live?", rows: 2, columns: 50, required:true, name:'countrynow'},
      ], 
      preamble: `<div>Please answer the following questions: </div>`,
    };

    ///////
    /////// ENDING THE EXPERIMENT
    ///////

    // ALLOW PARTICIPANTS TO DOWNLOAD DATA
    var done = {
      type: jsPsychHtmlButtonResponse,
      choices: ['CSV', 'JSON','No thanks'],
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
      At this point, we would like if you have any feedback about this study. 
      If you do, please enter it in the box below. If you do not have any feedback, leave the box empty and click on <b>Continue</b>.
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
            payoff_order: participant_payoff_order,
            otherplayer_order: participant_otherinfo_order,
            LMR_order: participant_LMR_order,
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
            ("The experiment data has been saved successfully!" +
            "Your survey code is: <b> 92830102." +
            "You can close the browser to end the experiment now. " +
            "The webcam will turn off when you close the browser.")
           })
           .fail(function () {
             ("A problem occured while saving the data." +
             "Please save the data to your computer and send it to the experimenter via email: rahal@coll.mpg.de.") ;
             var failsavecsv = jsPsych.data.get().cvs();
             var failsavefilename = jsPsych.data.get().values()[0].subject_id+".csv";
             downloadCSV(csv,failsavefilename);
        })
    }

    function startExp(){
        var timeline = [];
        timeline.push(preload);
        timeline.push(start_exp_survey_trial);
        timeline.push(fullscreenEnter);
        timeline.push(SVO_instruction);
        timeline.push(SVO_trial_likert);
       timeline.push(groupassignment);
       timeline.push(group_debrief_block);
       timeline.push(group_debrief_block2);
       timeline.push(star_instructions);
       timeline.push(star_test_procedure);
       timeline.push(donetext);
       timeline.push(star_debrief_block);
       timeline.push(choice_instructions1);
       timeline.push(choice_instructions2);
       timeline.push(choice_instructions3);
       timeline.push(comprehension_check1);
       timeline.push(comprehension_feedback1);
       timeline.push(comprehension_check2);
       timeline.push(comprehension_feedback2);
       timeline.push(comprehension_check3);
       timeline.push(comprehension_feedback3);
       timeline.push(calibration_instructions);
       timeline.push(init_camera);
       timeline.push(calibration);
       timeline.push(validation_instructions);
       timeline.push(validation);
       timeline.push(task_instructions);
       timeline.push(charity_prac_choice);
       timeline.push(EnterRealChoice);
       timeline.push(real_choice);
       timeline.push(donecursor);
//
       timeline.push(lookcheck_trial);
       timeline.push(selected_lookcheck);
//
       timeline.push(expectations_favoritism);
       timeline.push(expectations_others);
//
       timeline.push(teamcheck_trial);
       timeline.push(ios_trial);
//
       timeline.push(rateintro);
       for (var i = 0; i < ident_G_trials.length; i++) {
        timeline.push(ident_G_trials[i]);
      }
      
      for (var i = 0; i < ident_M_trials.length; i++) {
        timeline.push(ident_M_trials[i]);
      }
      
      for (var i = 0; i < ident_I_trials.length; i++) {
        timeline.push(ident_I_trials[i]);
      }
      
      for (var i = 0; i < ident_S_trials.length; i++) {
        timeline.push(ident_S_trials[i]);
      }
      
//
      timeline.push(indicol);
      timeline.push(visioncheck_trial);
      timeline.push(eslcheck_trial);
      timeline.push(country_survey_trial);
        timeline.push(feedback);
        timeline.push(success_guard);
        
        jsPsych.run(timeline);
    }
    
