
var CartAction = {
    LEFT : -1,
    RIGHT : 1,
    NONE : 0
};

var Cart = function(width, height, scale, color) {
	this.width = 100;
	this.height = 50;
	this.scale = 100.0;//表示スケール

	if (color == 1) {
		this.color = "rgb(31, 191, 191)";
	} else {
		this.color = "rgb(31, 191, 100)";
	}

	this.init();
};

Cart.prototype.init = function() {
	this.x0 = MainFrame.WIDTH / 2.0;
	this.y0 = MainFrame.HEIGHT - this.height - 160;

	this.x = 0.0;
	this.margin = 4;

	this.dx = 0.0;
	this.theta = Math.random() * 0.02 - 0.01;
	//this.theta = 0;
	this.dtheta = 0.0;
	this.failed = false;

	this.M = 1.0; // [kg]台車の質量．
	this.m = 1.0; // [kg]棒の質量
	this.l = 0.8; // [m]棒の長さ
	this.g = 9.8; // [m/sec^2]　重力加速度
	this.tau = 0.01; // [sec] //単位時間
	this.f = 10.0; // [N] 台車を押す力
}

Cart.prototype.reset = function(M, m, l, g, tau, f) {
	this.M = M; // [kg]
	this.m = m; // [kg]
	this.l = l; // [m]
	this.g = g; // [m/sec^2]
	this.tau = tau; // [sec]
	this.f = f; // [N]
}

//移動処理（右か左か移動しないか）
Cart.prototype.move = function(action) {
	var ff = this.f * action
	var sinTheta = Math.sin(this.theta);
	var cosTheta = Math.cos(this.theta);
	var tmp1 = ff + this.m * this.l * sinTheta * this.dtheta * this.dtheta;
	var tmp2 = this.M + this.m * sinTheta * sinTheta;
	var ddx = (tmp1 - this.m * this.g * sinTheta * cosTheta) / tmp2;
	var ddtheta = (this.M * this.g * sinTheta - cosTheta * tmp1) / (this.l * tmp2);

	this.x += this.dx * this.tau;
	this.dx += ddx * this.tau;
	this.theta += this.dtheta * this.tau;
	this.dtheta += ddtheta * this.tau;

	var tmpx = this.x0 + this.x * this.scale;

	//衝突OR転倒判定
	this.failed = this.failed || tmpx - this.width / 2 < 0;//
	this.failed = this.failed || tmpx + this.width / 2 >= MainFrame.WIDTH;
	this.failed = this.failed || Math.cos(this.theta) <= 0;
};

Cart.prototype.getX = function() {
	return this.x * this.scale;
};

Cart.prototype.isMovable = function() {
	return Math.cos(this.theta) > 0;
};

Cart.prototype.isFailed = function() {
	return this.failed;
};

Cart.prototype.drawCart = function(ctx) {
	var tmpx = this.x0 + this.x * this.scale - this.width / 2.0;
	var tmpy = this.y0;
	var r = this.height / 5.0;

	ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, MainFrame.WIDTH, MainFrame.HEIGHT);

    ctx.fillStyle = "rgb(191, 191, 191)";
    ctx.fillRect(0, tmpy+this.height, MainFrame.WIDTH, MainFrame.HEIGHT - tmpy - this.height);

	ctx.fillStyle = this.color;
	ctx.fillRect(tmpx, tmpy, this.width, this.height - r);

	ctx.fillStyle = "rgb(127, 127, 127)";

	ctx.beginPath();
	ctx.arc(tmpx + this.width/4.0, tmpy + this.height - r, r, 0.0, Math.PI*2.0, true);
    ctx.fill();

	ctx.beginPath();
	ctx.arc(tmpx + 3*this.width/4.0, tmpy + this.height - r, r, 0.0, Math.PI*2.0, true);
    ctx.fill();

	r -= this.margin;

	ctx.fillStyle = "rgb(191, 191, 191)";

	ctx.beginPath();
	ctx.arc(tmpx + this.width/4.0, tmpy + this.height - r - this.margin, r, 0.0, Math.PI*2.0, true);
    ctx.fill();

	ctx.beginPath();
	ctx.arc(tmpx + 3*this.width/4.0, tmpy + this.height - r - this.margin, r, 0.0, Math.PI*2.0, true);
    ctx.fill();

	ctx.strokeStyle = "rgb(0, 0, 0)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(tmpx + this.width / 2.0, tmpy);
	ctx.lineTo(tmpx + this.width / 2.0 + 2.0 * this.l * this.scale * Math.sin(this.theta),
		tmpy - 2.0 * this.l * this.scale * Math.cos(this.theta));
	ctx.stroke();
};

