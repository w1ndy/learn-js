
// Inspired by Lee Byron's test data generator.
function bumpLayer(n) {

    function bump(a) {
        var x = 1 / (.1 + Math.random()),
            y = 2 * Math.random() - .5,
            z = 10 / (.1 + Math.random());
        for (var i = 0; i < n; i++) {
            var w = (i / n - y) * z;
            a[i] += x * Math.exp(-w * w);
        }
    }

    var a = [], i;
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < 5; ++i) bump(a);
    return a.map(function (value, i) { return {x: i, y: value}; });
}

function interpolate(arr) {
    var coffs = [], last_d = (arr[1].y - arr[0].y) / (arr[1].x - arr[0].x);
    function interpolateCubic(d0, x0, y0, x1, y1, x2, y2) {
        return math.multiply(math.inv([
            [3 * x0 * x0, 2 * x0, 1, 0],
            [x0 * x0 * x0, x0 * x0, x0, 1],
            [x1 * x1 * x1, x1 * x1, x1, 1],
            [x2 * x2 * x2, x2 * x2, x2, 1]]),
                [d0, y0, y1, y2]);
    }
    for(var i = 0; i < arr.length - 2; i += 2) {
        var coff = interpolateCubic(last_d, arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y, arr[i + 2].x, arr[i + 2].y);
        console.log({x: arr[i].x, a:coff[0], b:coff[1], c:coff[2], d:coff[3]});
        coffs.push({x: arr[i].x, a:coff[0], b:coff[1], c:coff[2], d:coff[3]});
        last_d = 3 * coff[0] * arr[i + 2].x * arr[i + 2].x + 2 * coff[1] * arr[i + 2].x + coff[2];
    }
    if(arr.length > 3 && math.abs(coffs[coffs.length - 1].x - arr[arr.length - 4].x) < 1e-6) {
        var p = arr.length - 2;
        var coff = interpolateCubic(last_d, arr[p].x, arr[p].y, arr[p - 1].x, arr[p - 1].y, arr[p + 1].x, arr[p + 1].y);
        console.log({x: arr[p].x, a:coff[0], b:coff[1], c:coff[2], d:coff[3]});
        coffs.push({x: arr[p].x, a:coff[0], b:coff[1], c:coff[2], d:coff[3]});
    }

    return function (x) {
        var left = 0, right = coffs.length - 1;
        while(left < right) {
            var mid = ~~((left + right) / 2);
            if(x > coffs[mid].x && (mid == coffs.length - 1 || x < coffs[mid + 1].x)) {
                    return coffs[mid].a * x * x * x + coffs[mid].b * x * x + coffs[mid].c * x + coffs[mid].d;
            } else if(mid != coffs.length - 1 && x > coffs[mid + 1].x) {
                left = mid + 1;
            } else right = mid - 1;
        }
        return coffs[left].a * x * x * x + coffs[left].b * x * x + coffs[left].c * x + coffs[left].d;
    };
}

function drawFunction(ctx, f, low, high, density, xoffset, yoffset, xscale, yscale) {
    ctx.translate(0, 500);
    ctx.scale(1, -1);
    var stepping = (high - low) / density;
    ctx.beginPath();
    ctx.moveTo(0, f(low) * yscale);
    for(var x = low + stepping; x <= high; x += stepping) {
        ctx.lineTo((x - low) * xscale, f(x) * yscale);
    }
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawPoints(ctx, points, xoffset, yoffset, xscale, yscale) {
    ctx.translate(0, 500);
    ctx.scale(1, -1);
    for(var i = points.length - 1; i >= 0; i--) {
        ctx.beginPath();
        ctx.arc((points[i].x + xoffset) * xscale, points[i].y * yscale, 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.stroke();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

