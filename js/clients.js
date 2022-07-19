;(function() {

    const clientsSlider = new Swiper('.swiper', {
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        breakpoints: {
            1230: {
                slidesPerGroup: 3,
            },
            768: {
                slidesPerGroup: 2,
            },
        }
    });

    const sliderSwitch = document.querySelector('.clients-slider__switch');
    const sliderWrap = document.querySelector('.clients-slider__wrap');
    const sliderBlock = document.querySelector('.clients__reviews');

    let clientsData;               // данные о клиентах (из них делаем слайды)
    let sliderSwitchItems;         // кнопки для навигации по слайдам
    let selectedSwitchItem = 0;    // индекс текущей выбранной кнопки навигации
    let sliderActiveIndex = 0;     // текущий выбранный слайд с данными

    // получаем данные о клиентах (в данном случае имитация, т.к. сервера нет, просто получаем моковые данные)
    // данный код написан для демонстрации навыков, в боевом проекте будет использован реальный сервер
    const setClientsSlider = () => {
        fetch('https://jsonplaceholder.typicode.com/users')
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.length > 0) {
                clientsData = resp.slice(0, 9); // в моем случае будет 9 моковых слайдов

                // т.к. в моковых данных нет необходимых нам полей - добавляем их вручную
                clientsData.forEach((item, ind) => {
                    item.photo = `images/client-photos/${ind + 1}.jpg`;
                    item.review = 'Studio saved my job interview. Keep up with the excellent work! Test test test test';
                });

                sliderBlock.classList.remove('clients__reviews--loading');
                renderClientsSlider();
                sliderSwitchConfig(); // в зависимости от ширины экрана, выставляем нужное количество кнопок навигации

                window.addEventListener('resize', () => {
                    sliderReset();
                    sliderSwitchConfig();
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    // отрисовывает слайды и кнопки для навигации по слайдам
    const renderClientsSlider = () => {
        sliderWrap.innerHTML = '';
        
        clientsData.forEach((item, ind) => {
            let sliderItem = document.createElement('div');
            sliderItem.className = 'clients-slide swiper-slide';
            sliderItem.innerHTML = `
                <div class="clients-slide__img">
                    <img src="${item.photo}" alt="client photo">
                </div>

                <div class="clients-slide__rating">
                    <div class="clients-slide__client-name">
                        ${item.name}
                    </div>

                    <div class="clients-slide__stars">
                        <img src="images/icons/common/star.svg" alt="red star">
                        <img src="images/icons/common/star.svg" alt="red star">
                        <img src="images/icons/common/star.svg" alt="red star">
                        <img src="images/icons/common/star.svg" alt="red star">
                        <img src="images/icons/common/star.svg" alt="red star">
                    </div>
                </div>

                <div class="clients-slide__comment">
                    <p class="clients-slide__comment-text">
                        ${item.review}
                    </p>
                </div>
            `;

            // также отрисовываем кнопки навигации
            let sliderSwitchItem = document.createElement('button');
            sliderSwitchItem.className = 'clients-slider__switch-item';

            // первую кнопку делаем активной
            if (ind === 0) {
                sliderSwitchItem.classList.add('clients-slider__switch-item--active');
            }

            sliderWrap.append(sliderItem);
            sliderSwitch.append(sliderSwitchItem);
        });

        // сразу же получаем dom-объекты с кнопками навигации слайдера
        sliderSwitchItems = [].slice.call(document.querySelectorAll('.clients-slider__switch-item'));
    };

    // в зависимости от ширины экрана меняет кол-во видимых кнопок для навигации по слайдам
    const sliderSwitchConfig = () => {
        let toShow = sliderSwitchItems.length / getItemsCountAtOneSlide();

        for (let i = 0; i < sliderSwitchItems.length; i++) {
            if (i < toShow) {
                sliderSwitchItems[i].style.display = 'block';
            } else {
                sliderSwitchItems[i].style.display = 'none';
            }
        }
    };

    // возвращает массив с видимыми точками из навигации по слайдам
    const getVisibleSwitchItems = () => {
        return sliderSwitchItems.filter((item) => {
            if (item.style.display !== 'none') {
                return item;
            }
        });
    };

    // возвращает количество элементов на одном слайде
    const getItemsCountAtOneSlide = () => {
        let res = 1;
        let windowWidth = document.documentElement.clientWidth;

        if (windowWidth >= 1230) {
            res = 3;
        } else if (windowWidth >= 768) {
            res = 2;
        }

        return res;
    };

    // меняет выбранный элемент в навигации по слайдеру
    const changeSwitchItem = (visibleItems, clickedItemInd) => {
        visibleItems.forEach((item) => {
            item.classList.remove('clients-slider__switch-item--active');
        });

        visibleItems[clickedItemInd].classList.add('clients-slider__switch-item--active');
    };

    // обработчик клика по навигации слайдера
    const switchClicked = (clickedInd) => {
        const itemsAtOneSlide = getItemsCountAtOneSlide();
        clientsSlider.slideTo(clickedInd * itemsAtOneSlide);
    };

    // функция перелистывания слайдера, здесь же переключаем страницу слайдера
    const slide = () => {
        const visibleSwitchItems = getVisibleSwitchItems();
        const itemsAtOneSlide = getItemsCountAtOneSlide();

        if (itemsAtOneSlide > 1) {
            selectedSwitchItem = Math.ceil(clientsSlider.activeIndex / itemsAtOneSlide);
        } else {
            selectedSwitchItem = clientsSlider.activeIndex;
        }

        sliderActiveIndex = clientsSlider.activeIndex;
        changeSwitchItem(visibleSwitchItems, selectedSwitchItem);
    };

    // сбрасывает слайдер на нулевой слайд
    const sliderReset = () => {
        if (sliderActiveIndex !== 0) {
            selectedSwitchItem = 0;
            sliderActiveIndex = 0;
            clientsSlider.slideTo(0);
        }
    };

    sliderSwitch.addEventListener('click', (evt) => {
        let src = evt.target;

        if (!src.classList.contains('clients-slider__switch-item')) {
            return;
        }
        
        let clickedInd = sliderSwitchItems.indexOf(src);

        // если кликнули по текущей выбранной странице - уходим
        if (clickedInd === selectedSwitchItem) {
            return;
        }

        switchClicked(clickedInd);
    });

    clientsSlider.on('slideChange', () => {
        slide();
    });

    // устанавливаем слайдер
    setClientsSlider();

})()