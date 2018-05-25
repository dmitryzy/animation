document.addEventListener('DOMContentLoaded', function() {
    run(); //Основной цикл
    
}, false);
//
function run() {
    //Основной цикл
    //Характеристики полотна
    var CanvasOpt = {
        "width": 800,
        "height": 600,
        "maxHeight": 500
    };
    //Характеристики окружностей
    var CircleOpt1 = {
        "id": "circle1",
        "x": 80,
        "y": 150,
        "r": 10,
        "color": "green"
    };
    var CircleOpt2 = {
        "id": "circle2",
        "x": 110,
        "y": 150,
        "r": 20,
        "color": "red"
    };
    //Подготовка
    var t = 100;
    var circle1 = new Circle(CircleOpt1, CanvasOpt);
    var circle2 = new Circle(CircleOpt2, CanvasOpt);
    var canvas = new Canvas(CanvasOpt, circle1, circle2);
    //Запуск анимации
    circle1.go(t);
    circle2.go(t);
//
};
//
//Модель окружности
function Circle(CircleOpt, CanvasOpt){
    //Ограничения для координат шарика
    //по горизонтали
    var xmin = 0;
    var xmax = CanvasOpt.width;
    //по вертикали
    var ymin = 0;
    var ymax = CanvasOpt.maxHeight;
    //
    //Конструктор (стартовые параметры)
    var x = CircleOpt.x;
    var y = CircleOpt.y;
    var r = (CircleOpt.r > 0) ? CircleOpt.r : 1;
    var c = CircleOpt.color;
    var delta = 40 / r; 
    var stopped = false;
    var link = false;
    var id = CircleOpt.id;
    //
    //id (в HTML разметку)
    this.id = id;
    //Координата "x" шарика
    this.x = function(){
        if (arguments.length == 0) {return x;}
        else{
            x = (arguments[0] < xmin) ? xmin : (arguments[0] > xmax) ? xmax : arguments[0];
        };
    };
    //Координата "y" шарика
    this.y = function(){
        if(arguments.length == 0){
            return y;
        }
        else{
            y = (arguments[0] < ymin) ? ymin : (arguments[0] >ymax) ? ymax : arguments[0];
            go(t_interval);
        };
    };
    //Радиус шарика
    this.r = r;
    //Цвет шарика
    function setColor(changeColor){
        var arrayColor = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
        if(changeColor){
            c = arrayColor[Math.random() * arrayColor.length | 0];
        };
        return c;
    };
    this.color = setColor;
    //
    this.is_stopped = function(){return stopped;};
    this.stop = function(){stopped = true;};
    //
    //Интервал таймера
    var t_interval;
    this.t = function(){return t_interval;};
    //Идентификатор таймера
    var id_interval;
    //Запуск анимации
    //изменение координаты "y" по таймеру
    function go(t){
    t_interval = t;       
        var id_interval = setInterval(function(){
            if(y + r > ymax){
                stopped = true;
                setColor(true);
                clearInterval(id_interval);
            }
            else{
                stopped = false;
                y += delta;
            };
            draw(id, x, y, c);                   
        },t);
    };
    this.go = go;
};
//
//Визуализация
function Canvas(CanvasOpt, circle1, circle2){
    //
    var circles = {};
    var parent = document.getElementById("canvas");
    //SVG поле для анимации
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", CanvasOpt.width);
    svg.setAttribute("height", CanvasOpt.height);
    //Линия
    var line = document.createElementNS(ns, "line");
    line.setAttribute("x1","0");
    line.setAttribute("y1",CanvasOpt.maxHeight);
    line.setAttribute("x2",CanvasOpt.width);
    line.setAttribute("y2",CanvasOpt.maxHeight);
    line.setAttribute("stroke-width","1");
    line.setAttribute("stroke","red");
    svg.appendChild(line);
    //1-й шарик
    var c1 = document.createElementNS(ns, "circle");
    c1.setAttribute("cx", circle1.x());
    c1.setAttribute("cy", circle1.y());
    c1.setAttribute("r", circle1.r);
    c1.setAttribute("stroke-width", "0");
    c1.setAttribute("fill", circle1.color());
    c1.setAttribute("id", circle1.id);
    svg.appendChild(c1);//добавить шарик на svg
    circles[circle1.id] = circle1;
    //2-й шарик
    var c2 = document.createElementNS(ns, "circle");
    c2.setAttribute("cx", circle2.x());
    c2.setAttribute("cy", circle2.y());
    c2.setAttribute("r", circle2.r);
    c2.setAttribute("stroke-width", "0");
    c2.setAttribute("fill", circle2.color());
    c2.setAttribute("id", circle2.id);
    svg.appendChild(c2);//добавить шарик на svg
    circles[circle2.id] = circle2;
    //
    parent.appendChild(svg);//добавить svg на родительский элемент
    //
    //Обработчики событий для перетаскивания шариков
    var targetid;
    svg.addEventListener("mousedown",svgClik)
    c1.addEventListener("mousedown", circleClik);
    c2.addEventListener("mousedown", circleClik);
    function circleClik(e){
        targetid = e.target.id;
    };
    function svgClik(e){
        var x = e.offsetX==undefined?e.layerX:e.offsetX;
        var y = e.offsetY==undefined?e.layerY:e.offsetY;
        circles[targetid].x(x);
        circles[targetid].y(y);
        //
        draw(targetid, x, y, circles[targetid].color(false)); 
    };
    //
    //Обработчики событий для столкновения шариков
    function clik(c1, c2){
        //Проверка расстояния между шариками
        var r = Math.sqrt(Math.pow((c1.x()-c2.x()), 2) + Math.pow((c1.y()-c2.y()), 2));
        return r <= c1.r + c2.r;
    };
    var t_interval = Math.min(circle1.t(),circle2.t());
    var id_interval = setInterval(function(){
        if(clik(circle1, circle2)){
            if(circle1.r > circle2.r){circle2.x(circle2.x() + circle2.r);}
            else{circle1.x(circle1.x() + circle1.r);};
            circle1.color(true);
            circle2.color(true);
        };                 
    },t_interval);
};
//
//Функция для отрисовки шариков на svg
function draw(id, x, y, c){
    var circle = document.getElementById(id);
    circle.setAttribute("cy", y);
    circle.setAttribute("cx", x);
    circle.setAttribute("fill", c);
};
//
//



