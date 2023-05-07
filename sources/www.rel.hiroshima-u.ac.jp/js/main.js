var outerDiv;
var canvasDiv;
var ctx;

var cart;
var env;
var agent;

var action;

var time = 0;
var episode = 1;
var record = 0;

var MainFrame = {
    WIDTH : 800,
    HEIGHT : 480
};

function onPlayClick(){
    clearInterval(timerID);
    timerID = setInterval(run, 30);
    chg1();
}

function onPauseClick(){
    clearInterval(timerID);
    chg4();
}

function onFastClick(){
    clearInterval(timerID);
    timerID = setInterval(run, 0.00001);
    chg2();
}

function onResetClick(){
    clearInterval(timerID);
    init()
}

//main loop
function run() {
    timeUpdate();
    console.log(action)
    console.log(cart.isMovable())
    console.log(cart.isFailed())
    if (cart.isMovable()) {
        console.log("movable")
        if (cart.isFailed()) {
            //移動処置
            cart.move(action);
            //描画処理
            cart.drawCart(ctx);
        } else {
     
            var s = env.getCurrentState();
            //Q学習エージェントに行動選択をさせる
            action = agent.selectAction();
            //移動処置
            cart.move(action);
            //前回行動の報酬を設定
            agent.setLastAction(action);
            //描画処理
            cart.drawCart(ctx);
            if (cart.isFailed()) {
                episode++;
                if(record<time){
                    record = time;
                }
                resultUpdate();
                console.log('failed!!');
                console.log(env.getCurrentState());
                console.log(env.getReward(env.getCurrentState()));
            }
            time++;
            agent.update(s, env.getCurrentState());
        }
    } else {
        //動く必要がない場合
        console.log("no movable")
        console.log(time);
        time=0;
        cart.init();
        cart.drawCart(ctx);
        action = CartAction.LEFT;
    }
};

//main entry point
function init() {

    //// set buttons status
    chg3();

    //iniiialize
    episode = 1;
    time = 0;
    record = 0;

    //update displayed time
    timeUpdate();

    //update displayed episode and record
    resultUpdate();
    
    outerDiv  = document.getElementById("outer");
    canvasDiv = document.getElementById("canvasContainer");

    //make Cart object
    cart = new Cart(100, 50, 100, 1);

    //make Environment object
    env = new Environment(cart);

    //make Agent object
    agent = new QLearningAgent(0.1, 0.95, 0.01, env);

    var canvas = document.getElementById('tutorial');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        cart.init();
        cart.drawCart(ctx);
    }
};
var timerID;

// set buttons status
function chg1(){
    document.myForm.play.disabled = "true";
    document.myForm.pause.disabled = "";
}

// set buttons status
function chg2(){
    document.myForm.play.disabled = "true";
    document.myForm.fast.disabled = "true";
    document.myForm.pause.disabled = "";
}

// set buttons status
function chg3(){
    document.myForm.play.disabled = "";
    document.myForm.fast.disabled = "";
    document.myForm.pause.disabled = "true";
}

// set buttons status
function chg4(){
    document.myForm.play.disabled = "";
    document.myForm.fast.disabled = "";
    document.myForm.pause.disabled = "true";
}

//update displayed time
function timeUpdate(){
    document.getElementById("time").innerHTML = "time: "+time;
}

//update displayed episode and record
function resultUpdate(){
    document.getElementById("episode").innerHTML = "episode: "+episode;
    document.getElementById("record").innerHTML = "record: "+record;
}