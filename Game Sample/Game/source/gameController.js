
function GameController() {
    this.question_num = 0;
    this.questionBank = new Array();
    this.questionLock = false;
    this.totalQuestions=0;
    this.score = 0;
    this.prevStage = "#prev";
    this.nextStage = "#next";
    this.confirmation = "<div id='confirmation'>" +
                      " Is that your final answer? " +
                      "<button id='yes'>YES</button>&nbsp;<button id='no'>NO</button>" +
                      "</div>";
    this.correctOption;
    this.randOption;
    this.alphabets = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'Q.', 'R.', 'S.', 'T.', 'U.', 'V.', 'W.', 'X.', 'Y.', 'Z.'];
    this.jsonPath = "";

}

GameController.prototype = {
    start: function (url) {
        this.jsonPath = url;
        this.startGame();
    },
    //method that load the json file
    load: function (url) {
        var _this = this;
        this.jsonPath = url;
        _this.setLifeLine();
       
                $.getJSON(url, function (data) {
            for (var i = 0; i < data.quizlist.length; i++) {
                _this.questionBank[i] = new Array;
                for (var key in data.quizlist[i]) {
                    var value = data.quizlist[i][key];
                    _this.questionBank[i][key] = value;
                }
            }
        }).done(function () {
            _this.displayQuestion();
            _this.totalQuestions = _this.questionBank.length;
        }).fail(function () {
            $("#startGame div").html("error in loading asset..");
        });;
    },
    
    //method that display questions
    displayQuestion: function () {
        startSound('background', true);
        $("#menu button").show();
        $("#startGame").remove()

        var currentNum = this.question_num;
        var totalOption = this.countTotalOption(this.questionBank[currentNum],true);
        this.randOption = this.randomizeOption(totalOption);
        //console.log(this.randOption);        
       
        var options = "";
        for (var q = 1; q <= this.randOption.length; q++) {
            if (this.randOption[q - 1] == 1) {
                this.correctOption = q;
            }
            options += "<div id=" + q + " class='option'>" +this.alphabets[q-1]+" "+ this.questionBank[currentNum]['option' + this.randOption[q - 1]] + "</div>";
        }
        $(this.prevStage).append('<div class="questionText">' + this.questionBank[currentNum]['question'] + "<div class='line'></div></div>" +'<div id="container">'+ options+"</div>");
        this.lifeLines();
        this.selectOption(this.correctOption);
      
       //console.log(this.correctOption);
    },
    setLifeLine: function () {
            var getCookie50 = Cookies.get('_50x50');
            var getCookieAu = Cookies.get('audience');

            if (getCookie50 === undefined && getCookie50 === undefined) {
                Cookies.set('_50x50', "false");
                Cookies.set('audience', "false");
            }

            if (getCookie50 == "false") {
                $("#menu  #_50x50 img").attr('src', 'img/_50x50.png');
                $("button#_50x50").removeAttr("disabled");
            }
            if (getCookieAu == "false") {
                $("#menu  #audience img").attr('src', 'img/audience.png');
                $("button#audience").removeAttr("disabled");
            }

            if (getCookie50 == "true") {          
                $("button#_50x50").attr("disabled", "disabled");
                $("button#_50x50 img").attr("src", 'img/_50x50x.png');
            }

            if (getCookieAu == "true") {
                $("button#audience").attr("disabled", "disabled");
                $("button#audience img").attr("src", 'img/audiencex.png');
            }
       
    },
    lifeLines: function () {
        var _this = this;
        $("#menu button").on('click', function () {
            var idVal = $(this).attr('id');
         
            if (idVal == '_50x50' && Cookies.get('_50x50') == "false") {
                $("#menu  #" + idVal + " img").attr('src', 'img/' + idVal + "x.png");
                Cookies.set('_50x50', "true");
                //remove wrong answer
                var toBeRemoved = _this.removeHalfOption();
                for (var b = 0; b< toBeRemoved.length; b++) {                   
                    $("div.option#" + toBeRemoved[b]).addClass('removed').css("opacity", "0.5");
                    console.log(toBeRemoved[b]+" "+b);
                }
            } else if (idVal == 'audience' && Cookies.get('audience') == "false") {
                $("#menu  #" + idVal + " img").attr('src', 'img/' + idVal + "x.png");
                Cookies.set('audience', "true");
                $("#dialog, #dialogBackground").show();

                $("#dialogBackground").on('click', function () {
                    $("#dialog, #dialogBackground").hide();
                });
            }
            $(this).attr("disabled", "disabled");
        });
    },

    //method trigger once user select an answer
    selectOption: function (id) {
        var _this = this;
        $('.option').click(function () {
                $("#confirmation").remove();
                if (!$(this).hasClass('removed')){
                        startSound('selecting', false);
                        $("#container").append(_this.confirmation);
                        var optionId = this.id;

                        $('.option').removeClass('selected');
                        $(this).addClass('selected');

                        $("#confirmation button").on('click', function () {
             
                            if (_this.questionLock == false && $(this).attr('id') == 'yes' ) {
                                _this.questionLock = true;
                                $("#confirmation").remove();
                                //correct answer
                                var gameOver = false;
                                if (optionId == id) {
                                    startSound('rightsound', false);
                                    $(_this.prevStage).append('<div class="feedback1">CORRECT</div>');
                                    _this.score++;
                                    
                                }
                                //wrong answer	
                                if (optionId != id) {
                                    startSound('wrongsound', false);
                                    $(_this.prevStage).append('<div class="feedback2">WRONG</div>');
                                    gameOver = true;
                                }
                                setTimeout(function () { _this.changeQuestion(gameOver) }, 1500);
                            } else if( $(this).attr('id')=='no'){
                                $("#confirmation").remove();
                            }

                        });
                } 
            
            });
            
    },
    countDownTimer: function (countdown) {

    },
    gameStart:function(){
        this.replayGame();
    },
    replayGame:function(){
        Cookies.set('_50x50', "false");
        Cookies.set('audience', "false");
        $("#menu button").show();//show the lifelines
        $("#dialogBackground").hide();
        $(this.prevStage).html("");//empty the div
        this.question_num = 0;// reset question number to default value
        this.load(this.jsonPath);
    },
    //method used to proceed to the next question
    changeQuestion: function (gameOver) {
        var _this = this;
        _this.question_num++;
        if (_this.prevStage == "#prev") {
            _this.nextStage = "#prev";
            _this.prevStage = "#next";
        }
        else {
            _this.nextStage = "#next";
            _this.prevStage = "#prev";
        }
        if (gameOver == true) {
            _this.gameOver();
        }else if (_this.question_num < _this.totalQuestions) {
            _this.displayQuestion();
        } else {           
            _this.displayResult();
        }

        $(_this.nextStage).animate({ "right": "+=800px" }, "slow", function () {
            $(_this.nextStage).css('right', '-800px'); $(_this.nextStage).empty();
        });
        $(_this.prevStage).animate({ "right": "+=800px" }, "slow", function () {
            _this.questionLock = false;
        });
    },

    //method that display the result
    displayResult:function(){
        $(this.prevStage).append('<div class="questionText">You have finished the quiz!<br><br>Total questions: '+this.totalQuestions+'<br>Correct answers: '+this.score+'</div>');
    },
    startGame:function(){
        var _this = this;
        $("#menu button").hide();
        $("#dialogBackground").show();
        $(this.prevStage).append('<div id="startGame"><img src="img/start logo.png"><br><button>Start Game</button></div></div>');
        $("#startGame button").on('click', function () {
            $(this).remove();
            $("#startGame").append("<div id=loading>loading ...</div>");
            _this.gameStart();
        });
    },
    gameOver: function () {
        var _this = this;
        $("#menu button").hide();
        $("#dialogBackground").show();
        $(this.prevStage).append('<div id="gameOver"><h1>GAME OVER</h1><button><img width="20" src="img/replay.png">Replay</button></div>');
        $("#gameOver button").on('click', function () {
            _this.replayGame();
        });
    },
    // method that randomized the option on each questions
    randomizeOption:function(length){
        var optionArr=new Array();      
        while (optionArr.length != length) {
            var rand = Math.ceil(Math.random() * length);           
            if (optionArr.indexOf(rand) == -1) {
                optionArr.push(rand);
            }        
        }
        return optionArr;
    },
    removeHalfOption: function () {
        var optionArr = new Array();
        var halfLenght = Math.ceil(this.randOption.length / 2);
        var correctOptionPos=this.correctOption;
        while (optionArr.length != halfLenght) {
            var rand = Math.ceil(Math.random() * this.randOption.length);
          
            if (correctOptionPos != rand && optionArr.indexOf(rand)==-1) {

                optionArr.push(rand);
            }
        }
        return optionArr;
    },
    //method that count the total option of a question 
    countTotalOption: function (obj,search) {
        var result = 0;
        if (search) {
            var regex = /Option/i;
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop) && regex.test(prop)) {
                    result++;
                }
            }
        }
        
        return result;
    }
}

startSound = function (id, loop) {
    soundHandle = document.getElementById(id);
    if (loop)
        soundHandle.setAttribute('loop', loop);
    soundHandle.play();
}

var Controller = new GameController();
Controller.start('questions.json');
