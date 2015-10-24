var COLS = 40,
    ROWS = 40;
var EMPTY = 0,
    SNAKE = 1,
    FRUIT = 2;
var UP = 0,
		RIGHT = 1,
		DOWN = 2,
		LEFT = 3;
var KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40;
var SCORE = 0;
var grid = {
	width: null,
	height: null,
	_grid: null,

	init: function(d, c, r) {
		this.width = c;
		this.height = r;

		this._grid=[];
		for (x=0; x<c; x++){
			this._grid.push([]);
			for (y=0; y<r; y++){
				this._grid[x].push(d);
			}
		}
	},

	set: function(val, x, y){
		this._grid[x][y] = val;
	},

	get: function(x, y) {
		return this._grid[x][y];
	}
}

var snake = {
	direction: null,
	last: null,
	_queue: null,

	init: function(d, x, y){
		this.direction = d;

		this._queue = [];
		this.insert(x, y);
	},

	insert: function(x, y){
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},

	remove: function() {
		return this._queue.pop();
	}
}

function setFood() {
	var empty = [];
	for (x=0; x < grid.width; x++){
		for (y=0; y < grid.height; y++){
			if (grid.get(x,y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}
  var randpos = empty[Math.floor(Math.random()*empty.length)];
  grid.set(FRUIT, randpos.x, randpos.y);
}

var frames, keystate;
function drawBoard() {

  var $box = $("<div class='box'></div>");
  for (var x=0; x<40; x++){
  	for (var y=0; y<40; y++){
  		var box_id = (y + (x*40));
  		$('.container').append($("<div class='box' id="+box_id+"></div>"));
  	}
  }
  $('body').append($("<div class='score'>"+SCORE+"</div>"));
}

function main() {
	frames = 0;
	keystate = {};
	drawBoard();
	init();
	loop();
}

function init() {
	grid.init(EMPTY,COLS,ROWS);
	var sp = {x:Math.floor(COLS/2), y:Math.floor(ROWS/2)};
	snake.init(RIGHT, sp.x, sp.y);
	grid.set(SNAKE, sp.x, sp.y);

	setFood();	
}

function loop() {
	update();
	draw();
}

function update() {

	setInterval(function(){
		var nx = snake.last.x;
		var ny = snake.last.y;
		console.log(nx,ny);

		$(document).keydown(function(event) {
			if (event.which === KEY_UP && snake.direction !== DOWN) {
				snake.direction = UP;
			} else if (event.which === KEY_RIGHT && snake.direction !== LEFT) {
				snake.direction = RIGHT;
			} else if (event.which === KEY_DOWN && snake.direction !== UP) {
				snake.direction = DOWN;
			} else if (event.which === KEY_LEFT && snake.direction !== RIGHT) {
				snake.direction = LEFT;
			}
		});

		switch (snake.direction){
			case UP:
			  nx--;
			  break;
			case RIGHT:
			  ny++;
			  break;
			case DOWN:
			  nx++;
			  break;
			case LEFT:
			  ny--;
			  break;
		}
		if (0 > nx || nx > grid.width-1 || 
		    0 > ny || ny > grid.height-1) {
			SCORE = 0;
	    $('.score').html(SCORE);
			return init();
		}

		if (grid.get(nx, ny) === FRUIT) {
			SCORE += 10;
			$('.score').html(SCORE);
			var tail = {x:nx, y:ny};
			setFood();

		} else if (grid.get(nx, ny) === SNAKE){
			SCORE = 0;
	    $('.score').html(SCORE);
			return init();
		} else {
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
			tail.x = nx;
			tail.y = ny;
		}
	
		grid.set(SNAKE, tail.x, tail.y);

		snake.insert(tail.x, tail.y);
		draw();
	},100);
}

function draw() {
	for (var x=0; x < grid.width; x++){
		for (var y=0; y < grid.height; y++){
			var boxID = (y + (x*40));
			var $box = $(".container").find("#"+boxID);
			switch (grid.get(x,y)) {
				case EMPTY:
				  $box.removeClass('snake');
				  $box.removeClass('fruit');
				  $box.addClass('empty');
					break;
				case SNAKE:
				  $box.addClass('snake');
				  break;
				case FRUIT:
				  $box.addClass('fruit');
				  break;
			}
		}
	}
}


$(document).ready(function(){
  main();
});