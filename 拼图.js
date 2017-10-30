$(function() {
    let canvas = document.createElement("canvas");
    let minScreenWidth = Math.min(document.documentElement.clientWidth - 10, document.documentElement.clientHeight - 10);
    canvas.width = minScreenWidth;
    canvas.height = minScreenWidth;
    document.getElementById("content").style.width = minScreenWidth + "px";

    //宸ュ叿鏂规硶
    let util = {
        /**
         * @desc 鍥剧墖鍔犺浇鎴愬姛鐨勮瘽灏辨墽琛屽洖璋冨嚱鏁�
         * @param 鍥剧墖鍦板潃 || 鍥剧墖鐨凞ataUrl鏁版嵁;
         */
        loadImg(e, fn) {
            return new Promise((resolve, reject) => {
                let img = new Image;
                if (typeof e !== "string") {
                    img.src = (e.srcElement || e.target).result;
                } else {
                    img.src = e;
                };

                img.onload = function() {
                    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve();
                };
            })
        }
    };

    function bindEvents() {
        let $file = $("#file");
        $file.on("change", function(e) {
            let reader = new FileReader;
            reader.onload = function(e) {
                util.loadImg(e).then(() => {
                    window.clipImage = new ClipImage(canvas, numbers[window.lev]);
                    window.clipImage.random();
                    Controller(window.clipImage, numbers[window.lev]);
                });
            };
            reader.readAsDataURL(this.files[0]);
        })
    }


    class Blocks {
        constructor(canvas, left, top, avW, avH) {
            this.canvas = canvas;
            this.left = left;
            this.top = top;
            this.avW = avW;
            this.avH = avH;
            this.init();
        }
        init() {
            $(this.canvas).css({
                position: "absolute",
                left: this.avW * this.left,
                top: this.avH * this.top
            })
            this.canvas.x = this.left;
            this.canvas.y = this.top;
            document.getElementById("content").appendChild(this.canvas);
        }

        setPosition() {
            $(this.canvas).css({
                left: this.avW * this.canvas.x,
                top: this.avH * this.canvas.y
            })
        }

        upF(maps, numbers) {
            let temp = (this.canvas.y > 0 ? (this.canvas.y - 1) : this.canvas.y);
            let targetXY = `${temp}_${this.canvas.x}`;
            return new Promise((resolve, reject) => {
                if (!maps[targetXY]) {
                    this.canvas.y = temp;
                    this.canvas.map = targetXY;
                    resolve(this.canvas);
                }
                reject();
            })
        }

        rightF(maps, numbers) {
            let temp = (this.canvas.x + 1 > numbers - 1) ? this.canvas.x : this.canvas.x + 1;
            let targetXY = `${this.canvas.y}_${temp}`;
            return new Promise((resolve, reject) => {
                if (!maps[targetXY]) {
                    this.canvas.x = temp;
                    this.canvas.map = targetXY;
                    resolve(this.canvas);
                };
                reject();
            })
        }

        downF(maps, numbers) {
            let temp = (this.canvas.y + 1 > numbers - 1) ? this.canvas.y : this.canvas.y + 1;
            let targetXY = `${temp}_${this.canvas.x}`;
            return new Promise((resolve, reject) => {
                if (!maps[targetXY]) {
                    this.canvas.y = temp;
                    this.canvas.map = targetXY;
                    resolve(this.canvas);
                };
                reject();
            })
        }

        leftF(maps, numbers) {
            let temp = (this.canvas.x - 1) >= 0 ? this.canvas.x - 1 : this.canvas.x;
            let targetXY = `${this.canvas.y}_${temp}`;
            return new Promise((resolve, reject) => {
                if (!maps[targetXY]) {
                    this.canvas.x = temp;
                    this.canvas.map = targetXY;
                    resolve(this.canvas);
                };
                reject();
            })
        }

        clickF(maps, numbers) {
            return new Promise((resolve, reject) => {
                let temp, targetXY;
                if (this.canvas.y < numbers - 1) {
                    temp = this.canvas.y + 1;
                    targetXY = `${temp}_${this.canvas.x}`;
                    if (!maps[targetXY]) {
                        this.canvas.y = temp;
                        this.canvas.map = targetXY;
                        return resolve(this.canvas);
                    }
                }
                if (this.canvas.y > 0) {
                    temp = this.canvas.y - 1;
                    targetXY = `${temp}_${this.canvas.x}`;
                    if (!maps[targetXY]) {
                        this.canvas.y = temp;
                        this.canvas.map = targetXY;
                        return resolve(this.canvas);
                    }
                }
                if (this.canvas.x < numbers - 1) {
                    temp = this.canvas.x + 1;
                    targetXY = `${this.canvas.y}_${temp}`;
                    if (!maps[targetXY]) {
                        this.canvas.x = temp;
                        this.canvas.map = targetXY;
                        return resolve(this.canvas);
                    }
                }
                if (this.canvas.x > 0) {
                    temp = this.canvas.x - 1;
                    targetXY = `${this.canvas.y}_${temp}`;
                    if (!maps[targetXY]) {
                        this.canvas.x = temp;
                        this.canvas.map = targetXY;
                        return resolve(this.canvas);
                    };
                }
            })
        }
    }
    class ClipImage {
        constructor(canvas, number) {
            this.blocks = []; //浜岀淮鏁扮粍锛屽瓨鏀綾anvas鏂瑰潡;
            this.instances = []; //涓€缁存暟缁勶紝瀛樻斁瀹炰緥鍖栧悗鐨勬暟缁�;
            this.maps = {};
            this.canvas = canvas;
            this.context = this.canvas.getContext("2d");
            this.number = number;
            this.clip();
        }
        clip() {
            let avH = this.avH = this.canvas.height / this.number,
                avW = this.avW = this.canvas.width / this.number;

            for (let i = 0; i < this.number; i++) {
                for (let j = 0; j < this.number; j++) {
                    this.blocks[i] = this.blocks[i] || [];
                    let canvas = document.createElement("canvas");
                    canvas.width = avW;
                    canvas.height = avH;
                    canvas.x = j;
                    canvas.y = i;
                    canvas.map = `${i}_${j}`;
                    canvas.correctMap = `${i}_${j}`;
                    let imageDate = this.context.getImageData(j * avW, i * avH, avW, avH);
                    canvas.getContext("2d").putImageData(imageDate, 0, 0);

                    // 鍘婚櫎鍙充笅瑙�
                    if (i === j && j === (this.number - 1)) break;
                    this.blocks[i][j] = canvas;
                }
            };
        }

        renderToDom() {
                $("#content").html("");
                this.maps = {};
                this.doms = [];
                this.instances = [];

                for (let i = 0; i < this.blocks.length; i++) {
                    for (let j = 0; j < this.blocks[i].length; j++) {
                        let instance = new Blocks(this.blocks[i][j], j, i, this.avW, this.avH)
                        this.instances.push(instance);
                        this.maps[`${i}_${j}`] = true;
                    }
                }
            }
            /**
             * @param 鎶奵anvas鍧楁贩鎺掞紝 鎵撲贡鎺掑簭;
             * */
        random() {
            let len = this.instances.length;
            $("#content").empty();
            let newArr = [];
            for (let i = 0; i < this.blocks.length; i++) {
                newArr.push(...this.blocks[i]);
                // this.blocks[i] = _.shuffle(this.blocks[i]);
            }

            newArr = _.shuffle(newArr);
            let indexArr = newArr.map((value, indexm, array) => {
                return value.y * numbers[window.lev] + value.x;
            })
            indexArr.push(numbers[window.lev] * numbers[window.lev] - 1);
            console.log(this.solvability(indexArr, numbers[window.lev]));
            if (!this.solvability(indexArr, numbers[window.lev])) {
                console.log(1);
                let lastIndex1 = indexArr.indexOf(numbers[window.lev] * numbers[window.lev] - 2),
                    lastIndex2 = indexArr.indexOf(numbers[window.lev] * numbers[window.lev] - 3);
                let temp = newArr[lastIndex1];
                newArr[lastIndex1] = newArr[lastIndex2];
                newArr[lastIndex2] = temp;
            };
            for (let i = 0; i < newArr.length; i++) {
                this.blocks[parseInt(i / numbers[window.lev])][i % numbers[window.lev]] = newArr[i];
            }

            // this.blocks = _.shuffle(this.blocks);
            // for (let i = 0; i < this.blocks.length; i++) {
            //     // console.log();
            //     for (let j = 0; j < this.blocks[i].length; j++) {
            //         newArr = [...newArr, this.blocks[i][j].y * numbers[window.lev] + this.blocks[i][j].x];
            //     }
            // }
            // console.log(newArr);
            // console.log(this.blocks);


            this.renderToDom();
        }


        /**
         * 
         * @param {*} 鍒ゆ柇鏄惁鏈夎В
         * @param {*} obj 
         */
        solvability(order, size) {
            var a;
            var count = 0;
            var m = 0;
            var n = 0;

            var len = order.length;
            size = size || 3;
            //[0,1,2,3,4,5,7,6,8]
            for (var i = 0; i < len; i++) {
                a = order[i];


                //if( a == 8){
                if (a == size * size - 1) {銆€銆€銆€銆€
                    m = parseInt(i / size);
                    n = parseInt(i % size);
                }

                for (var j = i + 1; j < len; j++) {

                    if (order[j] < a) {
                        count++;
                    }
                }
            }
            count += m;
            count += n;
            return count % 2 == 0;
        }

        updataDom(cav, obj) {
            this.updataMap();
            $(cav).animate({
                top: obj.y * this.avH,
                left: obj.x * this.avW
            });
        }

        updataMap() {
            this.maps = {};
            let len = this.instances.length;
            while (len--) {
                this.maps[`${this.instances[len].canvas.y}_${this.instances[len].canvas.x}`] = true;
                this.instances[len].canvas.map = `${this.instances[len].canvas.y}_${this.instances[len].canvas.x}`;
            };
        }

        testSuccess() {
            let len = this.instances.length;
            while (len--) {
                if (this.instances[len].canvas.correctMap !== this.instances[len].canvas.map) {
                    return;
                };
            }
            alert("瀹屾垚!")
            window.lev += 1;
            init(window.lev);
        }
    }

    /**
     * @desc 鎺у埗鍣�;
     *
     * */
    function Controller(clipImage, number) {
        let run = function(clipImage, name) {
            for (let i = 0; i < clipImage.instances.length; i++) {
                let instance = clipImage.instances[i];
                instance[name](clipImage.maps, number).then((canvas) => {
                    clipImage.updataDom(canvas, {
                        x: canvas.x,
                        y: canvas.y
                    })
                    clipImage.testSuccess();
                    return;
                }).catch(() => {})
            }
        }
        $('body').on('touchmove', function(event) { event.preventDefault(); });
        document.addEventListener('touchmove', function(e) { e.preventDefault() }, false);
        $(document).swipeLeft(function() {
            run(clipImage, "leftF")
        }).swipeUp(function() {
            run(clipImage, "upF")
        }).swipeRight(function() {
            run(clipImage, "rightF")
        }).swipeDown(function() {
            run(clipImage, "downF")
        });
    }


    function clickController(clipImage, number) {
        let run = function(clipImage, index) {
            let instance = clipImage.instances[index];
            instance.clickF(clipImage.maps, number).then((canvas) => {
                clipImage.updataDom(canvas, {
                    x: canvas.x,
                    y: canvas.y
                })
                clipImage.testSuccess();
                return;
            }).catch(() => {})


            // for(let i = 0; i < clipImage.instances.length; i++) {
            //     let instance = clipImage.instances[i];
            //     instance.clickF(clipImage.maps, number).then((canvas) => {
            //         clipImage.updataDom(canvas, {
            //             x : canvas.x,
            //             y : canvas.y
            //         })
            //         clipImage.testSuccess();
            //         return;
            //     }).catch(() => {})
            // }
        }
        $("#content canvas").on("click", function() {
            var $canvas = $(this),
                index = $canvas.index();
            run(clipImage, index);
        })
    }
    const levels = ["./images/lake.jpg", "./images/lake.jpg", "./images/lake.jpg", "./images/lake.jpg"];
    const numbers = [3, 4, 6, 7];

    function init(level) {
        util.loadImg(levels[level]).then(() => {
            window.clipImage = new ClipImage(canvas, numbers[level]);
            window.clipImage.random();
            clickController(window.clipImage, numbers[level] || 3);
        })
    }

    window.lev = 0;
    init(lev);
    bindEvents();
    // function pick (arr) {
    //     // 鑻ユ暟缁勯暱搴︿负 5锛屽垯璇ヤ笅鏍� x 鐨勮寖鍥翠负 1~3
    //     // 鐩存帴渚濇鍙� a[x - 1], a[x], a[x + 1] 涓氦閿欑殑椤瑰嵆鍙�
    //     // 涓轰簡淇濊瘉涓嶈秺鐣岃€屾牴鎹暟缁勯暱搴﹂檺鍒� x 鍙栧€艰寖鍥�
    //     const pickedIndex = Math.max(
    //       0, parseInt(Math.random() * arr.length - 2)
    //     ) + 1
    //     // 绗簩缁翠笅鏍囦氦閿欑潃 0 1 鍙栧€硷紝杈惧埌鏁板瓧涓嶇浉浜ょ殑闇€姹�
    //     return [
    //       arr[pickedIndex - 1][0],
    //       arr[pickedIndex][1],
    //       arr[pickedIndex + 1][0]
    //     ]
    // }
})