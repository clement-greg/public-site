var point = function (x, y) {
    this.x = x;
    this.y = y;
};

point.prototype.wrap = function () {
    if (this.x > gameArgs.A_SCREEN_WIDTH)
        this.x = 0;
    if (this.y > gameArgs.A_SCREEN_HEIGHT)
        this.y = 0;

    if (this.x < 0)
        this.x = gameArgs.A_SCREEN_WIDTH;
    if (this.y < 0)
        this.y = gameArgs.A_SCREEN_HEIGHT;
};