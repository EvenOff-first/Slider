

class Sliders {
    infinitySwipe() {

    }

    buttonsManaging(selector, config) {
        let
            _mainElement = document.querySelector(selector), // main block
            _sliderWrapper = _mainElement.querySelector('.cards'), // slider wrapper
            _sliderItems = _mainElement.querySelectorAll('.card__item'), // elements
            _sliderControls = _mainElement.querySelectorAll('.sliders_control'), // managing elements
            _sliderControlLeft = _mainElement.querySelector('.slider_left_control'), // button "left"
            _sliderControlRight = _mainElement.querySelector('.slider_right_control'), // button "right"
            _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // wrapper width
            _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // width for one element 
            _positionLeftItem = 0, // left active element position
            _transform = 0, // tranform value .slider_wrapper
            _step = _itemWidth / _wrapperWidth * 100, // step for transform
            _items = [], // elements array
            _interval = 0,
            _config = {
                isCycling: false, // automatic changing slides
                direction: 'right', // side for changing slides
                interval: 2000, // interval time between changing slides
                pause: true // Pause for slides
            };

        for (let key in config) {
            if (key in _config) {
                _config[key] = config[key];
            }
        }

        // pushing array
        _sliderItems.forEach(function (item, index) {
            _items.push({ item: item, position: index, transform: 0 });
        });

        let position = {
            getItemMin: function () {
                let indexItem = 0;
                _items.forEach(function (item, index) {
                    if (item.position < _items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getItemMax: function () {
                let indexItem = 0;
                _items.forEach(function (item, index) {
                    if (item.position > _items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getMin: function () {
                return _items[position.getItemMin()].position;
            },
            getMax: function () {
                return _items[position.getItemMax()].position;
            }
        }

        let _transformItem = function (direction) {
            let nextItem;
            if (direction === 'right') {
                _positionLeftItem++;
                if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
                    nextItem = position.getItemMin();
                    _items[nextItem].position = position.getMax() + 1;
                    _items[nextItem].transform += _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform -= _step;
            }
            if (direction === 'left') {
                _positionLeftItem--;
                if (_positionLeftItem < position.getMin()) {
                    nextItem = position.getItemMax();
                    _items[nextItem].position = position.getMin() - 1;
                    _items[nextItem].transform -= _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform += _step;
            }
            _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        }

        let _cycle = function (direction) {
            if (!_config.isCycling) {
                return;
            }
            _interval = setInterval(function () {
                _transformItem(direction);
            }, _config.interval);
        }

        // event listener for buttons
        let _controlClick = function (e) {
            if (e.target.classList.contains('sliders_control')) {
                e.preventDefault();
                let direction = e.target.classList.contains('slider_right_control') ? 'right' : 'left';
                _transformItem(direction);
                clearInterval(_interval);
                _cycle(_config.direction);
            }
        };

        let _setUpListeners = function () {
            // adding _controlClick for buttons
            _sliderControls.forEach(function (item) {
                item.addEventListener('click', _controlClick);
            });
            if (_config.pause && _config.isCycling) {
                _mainElement.addEventListener('mouseenter', function () {
                    clearInterval(_interval);
                });
                _mainElement.addEventListener('mouseleave', function () {
                    clearInterval(_interval);
                    _cycle(_config.direction);
                });
            }
        }

        // initialization
        _setUpListeners();
        _cycle(_config.direction);

        return { // return methods
            right: function () { // method right
                _transformItem('right');
            },
            left: function () { // method left
                _transformItem('left');
            },
            stop: function () { // method stop
                _config.isCycling = false;
                clearInterval(_interval);
            },
            cycle: function () { // method cycle 
                _config.isCycling = true;
                clearInterval(_interval);
                _cycle();
            }
        }

    }
}



const sliders = new Sliders();

sliders.buttonsManaging(".sliders_cards", { isCycling: true });