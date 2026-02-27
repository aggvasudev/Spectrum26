(function () {
    'use strict';

    function startSetup(sliderSize, slideSize, animationDuration) {
        this.sliderSize = parseFloat(sliderSize) / 100;
        this.slideSize = parseFloat(slideSize) / 100;
        this.animationDuration = parseFloat(animationDuration);
    }

    function Slider(newSlider, sliderSize, slideSize, animationDuration) {

        this.startSetup = new startSetup(sliderSize, slideSize, animationDuration);

        this.wrapper = newSlider.querySelector('.wrapper');

        this.slides = newSlider.querySelectorAll(
            '.slides-holder__item'
        );

        this.slidesSize = 0;

        this.descriptionsHolder = newSlider.querySelector('.descriptions');
        this.descriptions = newSlider.querySelectorAll(
            '.descriptions__item'
        );

        this.slidesHolder = newSlider.querySelector('.slides-holder');

        this.btnLeft = newSlider.querySelector('.controls__left');
        this.btnRight = newSlider.querySelector('.controls__right');

        this.currentAngle = 0;
        this.currentSlide = 0;

        this.stepAngle =
            2 * Math.PI / this.slides.length;

        this.slidesHolder.style.transitionDuration =
            this.startSetup.animationDuration + 'ms';

        this.onResize();
        this.setNav();
        this.addStyle();
    }

    Slider.prototype.onResize = function () {

        let radius,
            w = this.wrapper.parentNode.getBoundingClientRect().width,
            h = this.wrapper.parentNode.getBoundingClientRect().height;

        2 * h <= w
            ? radius = h * this.startSetup.sliderSize
            : radius = (w / 2) * this.startSetup.sliderSize;

        this.setSize(Math.round(radius));
    };

    Slider.prototype.setSize = function (radius) {

        this.wrapper.style.width = 2 * radius + 'px';
        this.wrapper.style.height = radius + 'px';

        let r = 2 * radius * (1 - this.startSetup.slideSize);

        this.slidesHolder.style.width =
        this.slidesHolder.style.height = r + 'px';

        this.slidesRepositioning(r / 2);

        this.slidesHolder.style.marginTop =
            radius * this.startSetup.slideSize + 'px';

        this.slidesSize = Math.min(
            2 * radius * this.startSetup.slideSize,
            this.stepAngle * radius *
            (1 - this.startSetup.slideSize) - 50
        );

        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].style.width =
            this.slides[i].style.height =
                this.slidesSize + 'px';
        }
    };

    Slider.prototype.slidesRepositioning = function (r) {

        for (let i = 0; i < this.slides.length; i++) {

            let x = r * Math.cos(this.stepAngle * i - Math.PI / 2),
                y = r * Math.sin(this.stepAngle * i - Math.PI / 2);

            this.slides[i].style.transform =
                'translate(' + x + 'px,' + y + 'px) rotate(' +
                this.stepAngle * 180 / Math.PI * i + 'deg)';
        }
    };

    Slider.prototype.rotate = function (multiplier) {

        let _this = this;

        this.removeStyle();

        if (this.currentSlide === this.slides.length - 1 && multiplier === -1) {

            this.slidesHolder.style.transform = 'rotate(-360deg)';
            this.currentSlide = this.currentAngle = 0;
            this.addStyle();

            setTimeout(function () {

                _this.slidesHolder.style.transitionDuration = '0s';
                _this.slidesHolder.style.transform =
                    'rotate(' + _this.currentAngle + 'deg)';

                setTimeout(function () {
                    _this.slidesHolder.style.transitionDuration =
                        _this.startSetup.animationDuration + 'ms';
                }, 20);

            }, this.startSetup.animationDuration);

        } else if (this.currentSlide === 0 && multiplier === 1) {

            this.slidesHolder.style.transform =
                'rotate(' + this.stepAngle * 180 / Math.PI + 'deg)';

            this.currentSlide = this.slides.length - 1;
            this.currentAngle =
                -(2 * Math.PI - this.stepAngle) * 180 / Math.PI;

            this.addStyle();

            setTimeout(function () {

                _this.slidesHolder.style.transitionDuration = '0s';
                _this.slidesHolder.style.transform =
                    'rotate(' + _this.currentAngle + 'deg)';

                setTimeout(function () {
                    _this.slidesHolder.style.transitionDuration =
                        _this.startSetup.animationDuration + 'ms';
                }, 20);

            }, this.startSetup.animationDuration);

        } else {

            this.currentSlide -= multiplier;
            this.currentAngle +=
                (this.stepAngle * 180 / Math.PI) * multiplier;

            this.slidesHolder.style.transform =
                'rotate(' + this.currentAngle + 'deg)';

            this.addStyle();
        }
    };

    // 🔥 ONLY FIX: arrow binding using addEventListener
    Slider.prototype.setNav = function () {

        let _this = this;

        if (!this.btnLeft || !this.btnRight) {
            console.error("Arrow buttons not found");
            return;
        }

        this.btnLeft.addEventListener("click", function () {
            _this.rotate(1);
        });

        this.btnRight.addEventListener("click", function () {
            _this.rotate(-1);
        });
    };

    Slider.prototype.removeStyle = function () {

        let x = this.currentSlide;

        this.slides[x].classList.remove('slides-holder__item_active');
        this.slides[x].style.height =
        this.slides[x].style.width =
            this.slidesSize + 'px';
    };

    Slider.prototype.addStyle = function () {

        let x = this.currentSlide;

        this.slides[x].classList.add('slides-holder__item_active');
        this.slides[x].style.height =
        this.slides[x].style.width =
            this.slidesSize + 20 + 'px';
    };

    // ✅ SAFE INIT
    document.addEventListener("DOMContentLoaded", function () {

        const sliderElement =
            document.querySelector('.circular-slider-1');

        if (!sliderElement) return;

        window.circularSlider1 =
            new Slider(sliderElement, 90, 17, 600);


        window.onresize = function () {
            window.circularSlider1.onResize();
        };
    });

})();
