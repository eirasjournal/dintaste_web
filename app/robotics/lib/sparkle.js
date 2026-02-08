export function initSparkle($) {
  "use strict";

  // --- CONFIGURARE SIMBOLURI ---
  const SYMBOLS = ["θ", "ω", "∫", "π", "Σ", "≈", "∂", "λ"];
  
  const spriteCache = {};

  function getSymbolSprite(symbol, color, size) {
      const key = symbol + "-" + color + "-" + size;
      if (spriteCache[key]) return spriteCache[key];

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const resolution = 2; 
      const fontSize = size * resolution;
      
      canvas.width = fontSize * 1.5;
      canvas.height = fontSize * 1.5;

      ctx.font = "bold " + fontSize + "px 'Courier New', monospace";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      ctx.fillText(symbol, canvas.width / 2, canvas.height / 2);
      
      spriteCache[key] = {
          canvas: canvas,
          width: canvas.width / resolution,
          height: canvas.height / resolution
      };
      
      return spriteCache[key];
  }

  // --- PLUGIN JQUERY ---

  $.fn.sparkle_hover = function(options) {
      return this.each(function(k, v) {
          var $this = $(v);
          // Curățăm instanța veche dacă există
          if ($this.data("sparkle-instance")) {
              $this.data("sparkle-instance").destroy();
          }

          var settings = $.extend({
              color: "#2b5797",
              count: 30,
              overlap: 0,
              speed: 1,
              minSize: 8,
              maxSize: 12,
              direction: "both"
          }, options);

          var sparkle = new Sparkle($this, settings);
          $this.data("sparkle-instance", sparkle); // Salvăm referința

          $this.on({
              "mouseover.sparkle focus.sparkle": function() { $this.trigger("start.sparkle"); },
              "mouseout.sparkle blur.sparkle": function() { $this.trigger("stop.sparkle"); },
              "start.sparkle": function() { sparkle.start($this); },
              "stop.sparkle": function() { sparkle.stop(); },
              "resize.sparkle": function() { sparkle.resize($this); sparkle.setParticles(); },
              "destroy.sparkle": function() { sparkle.destroy(); }
          });
      });
  };

  $.fn.sparkle_always = function(options) {
      return this.each(function(k, v) {
          var $this = $(v);
          // KILL SWITCH: Dacă există deja sclipici aici, îl distrugem pe cel vechi
          if ($this.data("sparkle-instance")) {
              $this.data("sparkle-instance").destroy();
          }

          var settings = $.extend({
              color: "#2b5797",
              count: 30,
              overlap: 0,
              speed: 1,
              minSize: 8,
              maxSize: 12,
              direction: "both"
          }, options);

          var sparkle = new Sparkle($this, settings);
          $this.data("sparkle-instance", sparkle);

          $this.on({
              "start.sparkle": function() { sparkle.start($this); },
              "stop.sparkle": function() { sparkle.stop(); },
              "resize.sparkle": function() { sparkle.resize($this); sparkle.setParticles(); },
              "destroy.sparkle": function() { sparkle.destroy(); }
          });

          $this.trigger("start.sparkle");

          // Gestionăm resize-ul global cu grijă
          var resizeTimer;
          $(window).on("resize.sparkleGlobal", function() {
              clearTimeout(resizeTimer);
              resizeTimer = setTimeout(function() {
                  if ($this.find('canvas').length > 0) { // Verificăm dacă elementul mai există
                      $this.trigger("resize.sparkle");
                  }
              }, 100);
          });
      });
  };

  function Sparkle($parent, options) {
      this.options = options;
      this.init($parent);
  }

  Sparkle.prototype = {
      "init": function($parent) {
          this.$parent = $parent; // Păstrăm referința la părinte
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

          if ($parent[0].nodeName === "IMG") {
              this.$canvas.insertAfter($parent);
          } else {
              this.$canvas.appendTo($parent);
          }

          this.canvas = this.$canvas[0];
          this.context = this.canvas.getContext("2d");

          this.canvas.width = $parent.outerWidth() + (this.options.overlap * 2);
          this.canvas.height = $parent.outerHeight() + (this.options.overlap * 2);

          this.setParticles();
          this.anim = null;
          this.fade = false;
      },

      "destroy": function() {
          // --- ACEASTA ESTE FUNCȚIA CARE SALVEAZĂ MEMORIA ---
          // 1. Oprește bucla infinită
          if (this.anim) {
              window.cancelAnimationFrame(this.anim);
          }
          // 2. Șterge canvas-ul din HTML
          this.$canvas.remove();
          // 3. Șterge datele atașate
          this.$parent.removeData("sparkle-instance");
          // 4. Oprește event listenerii specifici
          this.$parent.off(".sparkle");
      },

      "randomParticleSize": function() {
          return Math.floor(Math.random() * (this.options.maxSize - this.options.minSize + 1) + this.options.minSize);
      },

      "setParticles": function() {
          this.particles = this.createSparkles(this.canvas.width, this.canvas.height);
      },

      "createSparkles": function(w, h) {
          var tempicles = [];
          for (var i = 0; i < this.options.count; i++) {
              var color = ($.type(this.options.color) === "array") 
                  ? this.options.color[Math.floor(Math.random() * this.options.color.length)]
                  : this.options.color;

              var size = this.randomParticleSize();
              var randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
              var spriteData = getSymbolSprite(randomSymbol, color, size);

              var yDelta = Math.floor(Math.random() * 1000) - 500;
              if (this.options.direction === "down") yDelta = Math.floor(Math.random() * 500) - 550;
              else if (this.options.direction === "up") yDelta = Math.floor(Math.random() * 500) + 50;

              tempicles[i] = {
                  position: { x: Math.floor(Math.random() * w), y: Math.floor(Math.random() * h) },
                  delta: { x: Math.floor(Math.random() * 1000) - 500, y: yDelta },
                  size: size,
                  sprite: spriteData,
                  opacity: Math.random()
              };
          }
          return tempicles;
      },

      "draw": function() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          for (var i = 0; i < this.particles.length; i++) {
              var p = this.particles[i];
              this.context.save();
              this.context.globalAlpha = p.opacity;
              this.context.drawImage(p.sprite.canvas, p.position.x, p.position.y, p.sprite.width, p.sprite.height);
              this.context.restore();
          }
      },

      "update": function() {
          this.anim = window.requestAnimationFrame(() => {
              for (var i = 0; i < this.particles.length; i++) {
                  var p = this.particles[i];
                  var randX = (Math.random() > Math.random() * 2);
                  var randY = (Math.random() < Math.random() * 5);

                  if (randX) p.position.x += ((p.delta.x * this.options.speed) / 1500);
                  if (randY) p.position.y -= ((p.delta.y * this.options.speed) / 800);

                  if (p.position.x > this.canvas.width) p.position.x = -10;
                  else if (p.position.x < -10) p.position.x = this.canvas.width;

                  if (p.position.y > this.canvas.height) {
                      p.position.y = -10;
                      p.position.x = Math.floor(Math.random() * this.canvas.width);
                  } else if (p.position.y < -10) {
                      p.position.y = this.canvas.height;
                      p.position.x = Math.floor(Math.random() * this.canvas.width);
                  }

                  if (this.fade) p.opacity -= 0.035;
                  else p.opacity -= 0.005;

                  if (p.opacity <= 0.15) p.opacity = (this.fade) ? 0 : 1.2;
              }

              this.draw();

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
      },

      "start": function($parent) {
          this.resize($parent);
          this.$canvas.show();
          if (this.anim) window.cancelAnimationFrame(this.anim);
          for (var i = 0; i < this.options.count; i++) {
              this.particles[i].opacity = Math.random();
          }
          this.fade = false;
          this.update();
      },

      "stop": function() {
          this.fade = true;
          this.fadeCount = 100;
      }
  };
}