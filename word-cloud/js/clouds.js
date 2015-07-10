var Mask = {
    mask: [],
    pixel_width: 0,
    height: 0,
    width: 0,
    toActualX: function(x) {
        return (x >> 5);
    },
    toActualWidth: function(w) {
        return (w >> 5) + 1;
    },
    isEmpty: function(r, g, b, a) {
        return (a != 0) ? 1 : 0;
    },
    newObject: function (width, height) {
        var obj = Object.create(Mask);
        obj.width = obj.toActualWidth(width);
        obj.mask = new Array(height);
        for (var i = 0; i < height; i++) {
            obj.mask[i] = new Array(obj.width);
            for (var j = 0; j < obj.width; j++)
                obj.mask[i][j] = 0;
        }

        obj.pixel_width = width;
        obj.height = height;
        return obj;
    },
    u32bString: function (n) {
        var t = 1, str = "";
        for (var i = 0; i < 32; i++) {
            str += (n & t) ? "1" : "0";
            t <<= 1;
        }
        return str;
    },
    printMask: function() {
        for(var i = 0; i < this.height; i++) {
            var str = "";
            for(var j = 0; j < this.width; j++) {
                str += this.u32bString(this.mask[i][j]) + " ";
            }
            console.log(str);
        }
    },
    newObjectFromPixels: function (pixels, stride, x, y, width, height) {
        var obj = this.newObject(width, height);
        for(var i = 0; i < height; i++) {
            var kx = obj.toActualX(x), offset = x & 0x1F;
            for(var j = 0, n = width * 4; j < n; j += 4) {
                var p = (y + i) * stride + (x * 4 + j);
                obj.mask[i][kx] |= obj.isEmpty(pixels[p], pixels[p + 1], pixels[p + 2], pixels[p + 3]) << offset;
                offset++;
                kx += offset >> 5;
                offset &= 0x1F;
            }
        }
        //obj.printMask();
        return obj;
    },
    intersect: function (x, y, dst) {
        var dst_row_begin, dst_row_end, dst_col_begin, dst_col_end;
        var src_row_begin, src_col_begin, dst_shift, src_shift;

        if(y < 0) {
            dst_row_begin = -y;
            src_row_begin = 0;
        } else {
            dst_row_begin = 0;
            src_row_begin = y;
        }

        if(src_row_begin + dst.height - dst_row_begin > this.height) {
            dst_row_end = dst_row_begin + this.height - src_row_begin;
        } else {
            dst_row_end = dst.height;
        }

        if(x < 0) {
            dst_col_begin = this.toActualX(-x) + 1;
            src_col_begin = 0;
            dst_shift = (-x) & 0x1F;
            src_shift = 32 - dst_shift;
        } else {
            dst_col_begin = 0;
            src_col_begin = this.toActualX(x);
            src_shift = x & 0x1F;
            dst_shift = 32 - src_shift;
        }

        if(src_col_begin + dst.width - dst_col_begin > this.width) {
            dst_col_end = dst_col_begin + this.width - src_col_begin;
        } else {
            dst_col_end = dst.width;
        }

        //console.log("dst will compare to src " + x + " " + y);
        //console.log("src_row_begin = " + src_row_begin);
        //console.log("src_col_begin = " + src_col_begin);
        for(var id = dst_row_begin, is = src_row_begin;
                id < dst_row_end;
                id++, is++) {
            for(var jd = dst_col_begin, js = src_col_begin;
                    jd < dst_col_end;
                    jd++, js++) {
                //console.log("comparing src[" + is + "," +
                //    js + "]=" + this.u32bString(this.mask[is][js]) +
                //    " to dst[" + id + "," + jd + "]=" +
                //    this.u32bString(dst.mask[id][jd]));
                if(src_shift < 32 && (this.mask[is][js] >> src_shift) & dst.mask[id][jd])
                    return true;
                else if(dst_shift < 32 && jd != 0 &&
                        ((dst.mask[id][jd - 1] >> dst_shift) &
                            this.mask[is][js]))
                    return true;
            }
        }
        return false;
    }
};

