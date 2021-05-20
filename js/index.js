(function(){
    var stage, textStage, form, input;
    var circles, textPixels, textFormed;
    var offsetX, offsetY, text;
    var colors = ['#B2949D', '#FFF578', '#FF5F8D', '#37A9CC', '#188EB2'];
    var valueInput = document.querySelector('#inputText');
    var submitInput = document.querySelector('input[type="submit"]');
    var FlowerHTML = `
        <canvas id="c"></canvas>
        <script>
             var b = document.body;
             var c = document.getElementsByTagName('canvas')[0];
             var a = c.getContext('2d');
             document.body.clientWidth;</script>
                <script>
            with (m = Math)
              C = cos, S = sin, P = pow, R = random;
            c.width = c.height = f = 500;
            h = -250;
            function p(a, b, c) {
              if (c > 60)
                return [ S(a * 7) * (13 + 5 / (.2 + P(b * 4, 4))) - S(b) * 50,
                    b * f + 50,
                    625 + C(a * 7) * (13 + 5 / (.2 + P(b * 4, 4))) + b * 400,
                    a * 1 - b / 2, a ];
              A = a * 2 - 1;
              B = b * 2 - 1;
            if(A*A+B*B<1){if(c>37){n=(j=c&1)?6:4;o=.5/(a+.01)+C(b*125)*3-a*300;w=b*h;return[o*C(n)+w*S(n)+j*610-390,o*S(n)-w*C(n)+550-j*350,1180+C(B+A)*99-j*300,.4-a*.1+P(1-B*B,-h*6)*.15-a*b*.4+C(a+b)/5+P(C((o*(a+1)+(B>0?w:-w))/25),30)*.1*(1-B*B),o/1e3+.7-o*w*3e-6]}if(c>32){c=c*1.16-.15;o=a*45-20;w=b*b*h;z=o*S(c)+w*C(c)+620;return[o*C(c)-w*S(c),28+C(B*.5)*99-b*b*b*60-z/2-h,z,(b*b*.3+P((1-(A*A)),7)*.15+.3)*b,b*.7]}o=A*(2-b)*(80-c*2);w=99-C(A)*120-C(b)*(-h-c*4.9)+C(P(1-b,7))*50+c*2;z=o*S(c)+w*C(c)+700;return[o*C(c)-w*S(c),B*99-C(P(b, 7))*50-c/3-z/1.35+450,z,(1-b/1.2)*.9+a*.1, P((1-b),20)/4+.05]}}setInterval('for(i=0;i<1e4;i++)if(s=p(R(),R(),i%46/.74)){z=s[2];x=~~(s[0]*f/z-h);y=~~(s[1]*f/z-h);if(!m[q=y*f+x]|m[q]>z)m[q]=z,a.fillStyle="rgb("+~(s[3]*h)+","+~(s[4]*h)+","+~(s[3]*s[3]*-80)+")",a.fillRect(x,y,1,1)}',0)
        </script>
    `

    async function init() {
        initStages();
        initForm();
        initText();
        initCircles();
        animate();
        addListeners();
        hideInput();
        changeToFlower(getRenderTime());
    }

    // Init Canvas
    function initStages() {
        offsetX = (window.innerWidth-600)/2;
        offsetY = (window.innerHeight-300)/2;
        textStage = new createjs.Stage("text");
        textStage.canvas.width = 600;
        textStage.canvas.height = 200;

        stage = new createjs.Stage("stage");
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
    }

    function initForm() {
        form = document.getElementById('form');
        form.style.top = offsetY+200+'px';
        form.style.left = offsetX+'px';
        input = document.getElementById('inputText');
    }

    function initText() {
        text = new createjs.Text("t", "80px 'Source Sans Pro'", "#eee");
        text.textAlign = 'center';
        text.x = 300;
    }

    function initCircles() {
        circles = [];
        for(var i=0; i<600; i++) {
            var circle = new createjs.Shape();
            var r = 7;
            var x = window.innerWidth*Math.random();
            var y = window.innerHeight*Math.random();
            var color = colors[Math.floor(i%colors.length)];
            var alpha = 0.2 + Math.random()*0.5;
            circle.alpha = alpha;
            circle.radius = r;
            circle.graphics.beginFill(color).drawCircle(0, 0, r);
            circle.x = x;
            circle.y = y;
            circles.push(circle);
            stage.addChild(circle);
            circle.movement = 'float';
            tweenCircle(circle);
        }
    }


    // animating circles
    function animate() {
        stage.update();
        requestAnimationFrame(animate);
    }

    function tweenCircle(c, dir) {
        if(c.tween) c.tween.kill();
        if(dir == 'in') {
            c.tween = TweenLite.to(c, 0.4, {x: c.originX, y: c.originY, ease:Quad.easeInOut, alpha: 1, radius: 5, scaleX: 0.4, scaleY: 0.4, onComplete: function() {
                c.movement = 'jiggle';
                tweenCircle(c);
            }});
        } else if(dir == 'out') {
            c.tween = TweenLite.to(c, 0.8, {x: window.innerWidth*Math.random(), y: window.innerHeight*Math.random(), ease:Quad.easeInOut, alpha: 0.2 + Math.random()*0.5, scaleX: 1, scaleY: 1, onComplete: function() {
                c.movement = 'float';
                tweenCircle(c);
            }});
        } else {
            if(c.movement == 'float') {
                c.tween = TweenLite.to(c, 5 + Math.random()*3.5, {x: c.x + -100+Math.random()*200, y: c.y + -100+Math.random()*200, ease:Quad.easeInOut, alpha: 0.2 + Math.random()*0.5,
                    onComplete: function() {
                        tweenCircle(c);
                    }});
            } else {
                c.tween = TweenLite.to(c, 0.05, {x: c.originX + Math.random()*3, y: c.originY + Math.random()*3, ease:Quad.easeInOut,
                    onComplete: function() {
                        tweenCircle(c);
                    }});
            }
        }
    }

    function formText() {
        for(var i= 0, l=textPixels.length; i<l; i++) {
            circles[i].originX = offsetX + textPixels[i].x;
            circles[i].originY = offsetY + textPixels[i].y;
            tweenCircle(circles[i], 'in');
        }
        textFormed = true;
        if(textPixels.length < circles.length) {
            for(var j = textPixels.length; j<circles.length; j++) {
                circles[j].tween = TweenLite.to(circles[j], 0.4, {alpha: 0.1});
            }
        }
    }

    function explode() {
        for(var i= 0, l=textPixels.length; i<l; i++) {
            tweenCircle(circles[i], 'out');
        }
        if(textPixels.length < circles.length) {
            for(var j = textPixels.length; j<circles.length; j++) {
                circles[j].tween = TweenLite.to(circles[j], 0.4, {alpha: 1});
            }
        }
    }

    // event handlers
    function addListeners() {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if(textFormed) {
                explode();
                if(input.value != '') {
                    setTimeout(function() {
                        createText(input.value.toUpperCase());
                    }, 810);
                } else {
                    textFormed = false;
                }
            } else {
                createText(input.value.toUpperCase());
            }

        });
    }

    function createText(t) {
        var fontSize = 860/(t.length);
        if (fontSize > 160) fontSize = 160;
        text.text = t;
        text.font = "900 "+fontSize+"px 'Source Sans Pro'";
        text.textAlign = 'center';
        text.x = 300;
        text.y = (172-fontSize)/2;
        textStage.addChild(text);
        textStage.update();

        var ctx = document.getElementById('text').getContext('2d');
        var pix = ctx.getImageData(0,0,600,200).data;
        textPixels = [];
        for (var i = pix.length; i >= 0; i -= 4) {
            if (pix[i] != 0) {
                var x = (i / 4) % 600;
                var y = Math.floor(Math.floor(i/600)/4);

                if((x && x%8 == 0) && (y && y%8 == 0)) textPixels.push({x: x, y: y});
            }
        }

        formText();

    }

    function hideInput() {
        valueInput.style.opacity = 0;
        submitInput.style.opacity = 0;
    }

    function getRenderTextFn(baseTimeout) {
        var _timeout = -baseTimeout;
        return function(text, timeout = baseTimeout) {
            setTimeout(function() {
                valueInput.setAttribute('value', text);
                submitInput.click();
            }, _timeout + timeout);
            _timeout += timeout;
            return _timeout;
        }
    }

    function renderTextAnimation() {
        var renderText = getRenderTextFn(1520);
        renderText('I LOVE U');
        renderText('YOU ARE MY');
        renderText('SWEET');
        renderText('LOVELY');
        renderText('PIGPIG');
        renderText('LOVE YOU');
        renderText('FOR EVER');
        renderText('ZC');
        renderText('LOVE');
        renderText('WM');
        return renderText('爱你!');
    }

    function getRenderTime() {
        return renderTextAnimation();
    }

    function changeToFlower(renderTime) {
        setTimeout(function() {
            document.querySelector('#page1').style.display = 'none';
            document.querySelector('html').setAttribute('style', 'width: 100%;height: 100%;');
            document.querySelector('body').setAttribute('style', 'width: 100%;height: 100%;');
            document.querySelector('#page2').setAttribute('style', 'width: 100%;height: 100%;');
            document.querySelector('#page2>iframe').setAttribute('src', './520.html');
        }, 0)
    }

    window.onload = function() { init() };
})();