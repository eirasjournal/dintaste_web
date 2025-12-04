// app/lib/sparkle.js

export function initSparkle($) {
    "use strict";
  
    $.fn.sparkle = function(options) {
        return this.each(function(k, v) {
            var $this = $(v);
            var settings = $.extend({
                color: "#FFFFFF",
                count: 30,
                overlap: 0,
                speed: 1,
                minSize: 4,
                maxSize: 7,
                direction: "both"
            }, options);
  
            var sparkle = new Sparkle($this, settings);
  
            $this.on({
                "mouseover.sparkle focus.sparkle": function() {
                    $this.trigger("start.sparkle");
                },
                "mouseout.sparkle blur.sparkle": function() {
                    $this.trigger("stop.sparkle");
                },
                "start.sparkle": function() {
                    sparkle.start($this);
                },
                "stop.sparkle": function() {
                    sparkle.stop();
                },
                "resize.sparkle": function() {
                    sparkle.resize($this);
                    sparkle.setParticles();
                }
            });
        });
    };
  
    function Sparkle($parent, options) {
        this.options = options;
        this.init($parent);
    }
  
    Sparkle.prototype = {
        "init": function($parent) {
            var relativeOverlap = 0 - parseInt(this.options.overlap, 10);
            var cssOpts = {
                position: "absolute",
                top: relativeOverlap.toString() + "px",
                left: relativeOverlap.toString() + "px",
                "pointer-events": "none"
            };
  
            if ($parent.css("position") === "static") {
                $parent.css("position", "relative");
            }
  
            this.$canvas = $("<canvas>")
                .addClass("sparkle-canvas")
                .css(cssOpts)
                .hide();
  
            if ($parent.css("z-index") !== "auto") {
                var zdex = parseInt($parent.css("z-index"), 10);
                this.$canvas.css("z-index", zdex + 1);
            }
  
            var singletons = "IMG|BR|HR|INPUT";
            var regexp = "\\b" + $parent[0].nodeName + "\\b";
            this.isSingleton = new RegExp(regexp).test(singletons);
  
            if (this.isSingleton) {
                this.$canvas.insertAfter($parent);
            } else {
                this.$canvas.appendTo($parent);
            }
  
            this.canvas = this.$canvas[0];
            this.context = this.canvas.getContext("2d");
  
            this.sprite = new Image();
            this.sprite.src = this.datauri;
            this.spriteCoords = [0, 6, 13, 20];
  
            this.canvas.width = $parent.outerWidth() * 1.2;
            this.canvas.height = $parent.outerHeight() * 1.2;
  
            this.setParticles();
  
            this.anim = null;
            this.fade = false;
        },
  
        "randomParticleSize": function() {
            return Math.floor(Math.random() * (this.options.maxSize - this.options.minSize + 1) + this.options.minSize);
        },
  
        "randomHexColor": function() {
            return '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
        },
  
        "setParticles": function() {
            this.particles = this.createSparkles(this.canvas.width, this.canvas.height);
        },
  
        "createSparkles": function(w, h) {
            var tempicles = [];
            for (var i = 0; i < this.options.count; i++) {
                var color;
                if (this.options.color === "rainbow") {
                    color = this.randomHexColor();
                } else if ($.type(this.options.color) === "array") {
                    color = this.options.color[Math.floor(Math.random() * this.options.color.length)];
                } else {
                    color = this.options.color;
                }
  
                var yDelta = Math.floor(Math.random() * 1000) - 500;
                if (this.options.direction === "down") {
                    yDelta = Math.floor(Math.random() * 500) - 550;
                } else if (this.options.direction === "up") {
                    yDelta = Math.floor(Math.random() * 500) + 50;
                }
  
                tempicles[i] = {
                    position: {
                        x: Math.floor(Math.random() * w),
                        y: Math.floor(Math.random() * h)
                    },
                    style: this.spriteCoords[Math.floor(Math.random() * this.spriteCoords.length)],
                    delta: {
                        x: Math.floor(Math.random() * 1000) - 500,
                        y: yDelta
                    },
                    size: this.randomParticleSize(),
                    color: color
                };
            }
            return tempicles;
        },
  
        "draw": function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (var i = 0; i < this.particles.length; i++) {
                this.context.save();
                this.context.globalAlpha = this.particles[i].opacity;
                this.context.drawImage(this.sprite, this.particles[i].style, 0, 7, 7, this.particles[i].position.x, this.particles[i].position.y, this.particles[i].size, this.particles[i].size);
  
                if (this.options.color) {
                    this.context.globalCompositeOperation = "source-atop";
                    this.context.globalAlpha = 0.6;
                    this.context.fillStyle = this.particles[i].color;
                    this.context.fillRect(this.particles[i].position.x, this.particles[i].position.y, 7, 7);
                }
                this.context.restore();
            }
        },
  
        "update": function() {
this.anim = window.requestAnimationFrame((time) => {
    var flatTime = Math.floor(time);
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        var resizeParticle = false;
        var randX = (Math.random() > Math.random() * 2);
        var randY = (Math.random() < Math.random() * 5);

        if (randX) {
            p.position.x += ((p.delta.x * this.options.speed) / 1500);
        }
        if (randY) {
            p.position.y -= ((p.delta.y * this.options.speed) / 800);
        }

        if (p.position.x > this.canvas.width) {
            p.position.x = -(this.options.maxSize);
            resizeParticle = true;
        } else if (p.position.x < -(this.options.maxSize)) {
            p.position.x = this.canvas.width;
            resizeParticle = true;
        }

        if (p.position.y > this.canvas.height) {
            p.position.y = -(this.options.maxSize);
            p.position.x = Math.floor(Math.random() * this.canvas.width);
            resizeParticle = true;
        } else if (p.position.y < -(this.options.maxSize)) {
            p.position.y = this.canvas.height;
            p.position.x = Math.floor(Math.random() * this.canvas.width);
            resizeParticle = true;
        }

        if (resizeParticle) {
            p.size = this.randomParticleSize();
            p.opacity = 0.4;
        }

        if (this.fade) {
            p.opacity -= 0.035;
        } else {
            p.opacity -= 0.005;
        }

        if (p.opacity <= 0.15) {
            p.opacity = (this.fade) ? 0 : 1.2;
        }

        if (flatTime % Math.floor((Math.random() * 7) + 1) === 0) {
            p.style = this.spriteCoords[Math.floor(Math.random() * this.spriteCoords.length)];
        }
    }

    this.draw(time);

    if (this.fade) {
        this.fadeCount -= 1;
        if (this.fadeCount < 0) {
            window.cancelAnimationFrame(this.anim);
            this.$canvas.hide();
        } else {
            this.update();
        }
    } else {
        this.update();
    }
});
        },
  
        "resize": function($parent) {
            this.canvas.width = $parent.outerWidth() + (this.options.overlap * 2);
            this.canvas.height = $parent.outerHeight() + (this.options.overlap * 2);
            if (this.isSingleton) {
                this.$canvas.css({
                    top: $parent.position().top - this.options.overlap,
                    left: $parent.position().left - this.options.overlap
                });
            }
        },
  
        "start": function($parent) {
            this.resize($parent);
            this.$canvas.show();
            window.cancelAnimationFrame(this.anim);
            for (var i = 0; i < this.options.count; i++) {
                this.particles[i].opacity = Math.random();
            }
            this.fade = false;
            this.update();
        },
  
        "stop": function() {
            this.fade = true;
            this.fadeCount = 100;
        },
  
        "datauri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAHCAYAAAD5wDa1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDNFMzM5REEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDNFMzM5RUEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0M0UzMzlCQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0M0UzMzlDQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jzOsUQAAANhJREFUeNqsks0KhCAUhW/Sz6pFSc1AD9HL+OBFbdsVOKWLajH9EE7GFBEjOMxcUNHD8dxPBCEE/DKyLGMqraoqcd4j0ChpUmlBEGCFRBzH2dbj5JycJAn90CEpy1J2SK4apVSM4yiKonhePYwxMU2TaJrm8BpykpWmKQ3D8FbX9SOO4/tOhDEG0zRhGAZo2xaiKDLyPGeSyPM8sCxr868+WC/mvu9j13XBtm1ACME8z7AsC/R9r0fGOf+arOu6jUwS7l6tT/B+xo+aDFRo5BykHfav3/gSYAAtIdQ1IT0puAAAAABJRU5ErkJggg=="
    };
}