// JS Env


var NStateMax = 163000

var Environment = function(cart) {
	this.X_SCOPE0 = 1.0;
	this.X_SCOPE1 = 2.0;
	this.DX_SCOPE0 = 0.5;
	this.DX_SCOPE1 = 1.0;
	this.THETA_SCOPE0 = 0.02;
	this.THETA_SCOPE1 = 0.1;
	this.DTHETA_SCOPE0 = 0.8;
	this.DTHETA_SCOPE1 = 1.6;
	this.reward1 = 0.0;
	this.reward2 = -10.0;

	this.cart = cart;
};

Environment.prototype.getAction = function(i) {
	if (i == 0) {
		return CartAction.LEFT; // left
	} else if (i == 1) {
		return CartAction.RIGHT; // right
	} else {
		return CartAction.NONE; // none
	}
};

//記録の最大値-1を返す
Environment.prototype.getNState = function() {
	return NStateMax;
};
//選択しうる行動の数-1を返す
Environment.prototype.getNAction = function() {
	return 2;
};

Environment.prototype.getCurrentState = function() {
	var s1 = 0;
	var s2 = 0;
	var s3 = 0;
	var s4 = 0;

	if (this.cart.isFailed()) {
		return NStateMax-1;
	}

	if (this.cart.getX() < -0.8) {
		s1 = 0;
	} else if (this.cart.getX() < 0.8){
		s1 = 1;
	}else {
		s1 = 2;
	}

	if(this.cart.dx < -this.DX_SCOPE0) {
		s2 = 0;
	} else if(this.cart.dx < this.DX_SCOPE0){
		s2 = 1;
	} else {
		s2 = 2;
	}

	if(this.cart.theta < -this.THETA_SCOPE0){
		s3 = 0;
	} else if(this.cart.theta < -this.THETA_SCOPE1){
		s3 = 1;
	} else if(this.cart.theta < 0.00){
		s3 = 2;
	} else if(this.cart.theta < this.THETA_SCOPE0){
		s3 = 3;
	} else if(this.cart.theta < this.THETA_SCOPE1){
		s3 = 4;
	} else {
		s3 = 5;
	}

	if(this.cart.dtheta < -this.DTHETA_SCOPE0){
		s4 = 0;
	} else if(this.cart.dtheta < this.DTHETA_SCOPE0){
		s4 = 1;
	} else {
		s4 = 2;
	}

	return s1 * 3 * 6 * 3 + s2 * 6 * 3 + s3 * 3 + s4;
};

Environment.prototype.getReward = function(state) {
	if (state == NStateMax-1) {
		return this.reward2;
	} else {
		return this.reward1;
	}
};