var Vector = {
    x: 0,
    y: 0,
    newObject: function (x, y) {
        var v = Object.create(Vector);
        v.x = x;
        v.y = y;
        return v;
    },
    add: function (v) {
        return Vector.newObject(this.x + v.x, this.y + v.y);
    },
    sub: function (v) {
        return Vector.newObject(this.x - v.x, this.y - v.y);
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    normalize: function() {
        len = this.length();
        return Vector.newObject(this.x / len, this.y / len);
    },
    scale: function(f) {
        return Vector.newObject(this.x * f, this.y * f);
    },
    dot: function(v) {
        return this.x * v.x + this.y * v.y;
    },
    negate: function () {
        return Vector.newObject(-this.x, -this.y);
    }
}

var Node = {
    x: 0,
    y: 0,
    radius: 8,
    fillColor: "#FFFFFF",
    strokeColor: "#000000",
    newObject: function() {
        return Object.create(Node);
    }
}

var N = 16, edgeList = [[1,11],[1,12],[1,13],[1,14],[1,15],[0,2],[2,1],[0,3],[0,4],[4,5],[3,2],[6,5],[3,6],[6,7],[6,8],[6,9],[6,10]];
var nodeList = [], matrix = [], v0 = [];
var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");

function generateGraph() {
    for (var i = 0; i < N; i++) {
        var n = Node.newObject();
        n.x = Math.random() * canvas.width;
        n.y = Math.random() * canvas.height;
        nodeList.push(n);
        matrix.push(Array.apply(null, new Array(N)).map(
            Boolean.prototype.valueOf, false));
        v0.push(Vector.newObject(0, 0));
    }
    for (var i = 0; i < edgeList.length; i++) {
        matrix[edgeList[i][0]][edgeList[i][1]] = true;
        matrix[edgeList[i][1]][edgeList[i][0]] = true;
    }
}

function drawGraph() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    for (var i = 0; i < edgeList.length; i++) {
        ctx.beginPath();
        ctx.moveTo(nodeList[edgeList[i][0]].x, nodeList[edgeList[i][0]].y);
        ctx.lineTo(nodeList[edgeList[i][1]].x, nodeList[edgeList[i][1]].y);
        ctx.stroke();
    }
    for (var i = 0; i < N; i++) {
        ctx.beginPath();
        ctx.arc(nodeList[i].x, nodeList[i].y, nodeList[i].radius, 0,
            2 * Math.PI, false);
        ctx.fillStyle = nodeList[i].fillColor;
        ctx.fill();
        ctx.strokeStyle = nodeList[i].strokeColor;
        ctx.stroke();
    }
}

function calculateRepulsion(i, j) {
    var k = 5000.0;
    var repV = Vector.newObject(
        nodeList[i].x - nodeList[j].x,
        nodeList[i].y - nodeList[j].y);
    return repV.normalize().scale(k / repV.dot(repV));
}

function calculateAttraction(i, j) {
    if(!matrix[i][j])
        return Vector.newObject(0, 0);
    var k = 0.1;
    var L = 20;
    var attV = Vector.newObject(
        nodeList[j].x - nodeList[i].x,
        nodeList[j].y - nodeList[i].y);
    var dist = attV.length();
    return attV.normalize().scale(k * (dist - L));

}

var lastFrameTime = new Date();

function render() {
    var nowFrameTime = new Date();
    var timeElapsed = (nowFrameTime - lastFrameTime) / 1000.0;
    lastFrameTime = nowFrameTime;

    ctx.clearRect(0, 0, 640, 480);
    var forceDirection = new Array(N);
    for (var i = 0; i < N; i++) forceDirection[i] = Vector.newObject(0, 0);
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < i; j++) {
            var v1 = calculateRepulsion(i, j).add(calculateAttraction(i, j));
            forceDirection[i] = forceDirection[i].add(v1);
            forceDirection[j] = forceDirection[j].add(v1.negate());
        }
    }
    for (var i = 0; i < N; i++) {
        //var delta = v0[i].scale(timeElapsed).add(
        //    forceDirection[i].scale(0.5 * timeElapsed * timeElapsed));
        //v0[i] = v0[i].add(forceDirection[i].scale(timeElapsed));
        nodeList[i].x += forceDirection[i].x;
        nodeList[i].y += forceDirection[i].y;
    }
    drawGraph();
}

generateGraph();
setInterval(render, 1000 / 60);
