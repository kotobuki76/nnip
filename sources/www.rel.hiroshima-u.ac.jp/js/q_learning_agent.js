//Q学習用のエージェント

var QLearningAgent = function(alpha, gamma, epsilon, env) {
	this.alpha = alpha;
	this.gamma = gamma;
	this.epsilon = epsilon;
	this.env = env;
	this.q = new Array();
	this.buffer = new Array();
	this.lastAction = 1;

	//Q学習用の配列を初期化
	for (var i=0; i<this.env.getNState(); i++) {
		this.q[i] = new Array(this.env.getNAction());
		this.buffer[i] = new Array(this.env.getNAction());
	}
	this.init();
};

//Q学習用の配列を初期化
QLearningAgent.prototype.init = function() {
	for (var i = 0; i < this.q.length; i++) {
		for (var j = 0; j < this.q[i].length; j++) {
			this.q[i][j] = 0.0;
			this.buffer[i][j] = 0.0;
		}
	}
};

QLearningAgent.prototype.reset = function() {
	this.init();
};

QLearningAgent.prototype.buffer = function() {
	for(var i = 0; i < this.q.length; i++){
		for(var j = 0; j < this.q[i].length; j++){
			this.buffer[i][j] = this.q[i][j];
		}
	}
};

QLearningAgent.prototype.selectBufferedAction = function() {
	var s = this.env.getCurrentState();
	var a = 0;

	for (var i = 0; i < this.buffer[s].length; i++){
		if (this.buffer[s][i] > this.buffer[s][a]) {
			a = i;
		}
	}

	return this.env.getAction(a);
};

QLearningAgent.prototype.setLastAction = function(a) {
	for (var i = 0; i < this.env.getNAction(); i++){
		if (this.env.getAction(i) == a){
			this.lastAction = i;
			break;
		}
	}
};

QLearningAgent.prototype.selectAction = function() {
	return this.selectAction2();
};

QLearningAgent.prototype.selectAction1 = function() {
	var s = this.env.getCurrentState();
	var a = 0;
	var tmp = 0.0;

	for (var i = 0; i < this.q[s].length; i++){
		tmp += Math.exp(this.q[s][i]);
	}

	tmp = Math.random() * tmp;

	for (var i = 0; i < this.q[s].length; i++){
		tmp -= Math.exp(this.q[s][i]);
		if(tmp < 0){
			a = i;
			break;
		}
	}
	return this.env.getAction(a);
};

QLearningAgent.prototype.selectAction2 = function() {
	var s = this.env.getCurrentState();
	var a = 0;

	if (Math.random() < this.epsilon){
		this.lastAction = Math.floor(this.env.getNAction() * Math.random());
		return this.env.getAction(this.lastAction);
	}

	for(var i = 0; i < this.q[s].length; i++){
		if(this.q[s][i] > this.q[s][a]){
			a = i;
		}
	}

	return this.env.getAction(a);
};

QLearningAgent.prototype.update = function(s1, s2) {
	this.q[s1][this.lastAction] += this.alpha * this.getTDError(this.env.getReward(s2), s1, s2);
};

QLearningAgent.prototype.getTDError = function(r, s1, s2) {
	var a1 = this.lastAction;
	var a2 = 0;

	for(var i = 1; i < this.q[s2].length; i++){
		if(this.q[s2][i] > this.q[s2][a2]){
			a2 = i;
		}
	}

	return r + this.gamma * this.q[s2][a2] - this.q[s1][a1];
};
