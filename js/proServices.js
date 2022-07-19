// ---- в данном модуле размещаем логику управления меню по выбору фотографий из блока .pro-services ----

;(function() {

    let curItemInd = 0;     // индекс текущего выбранного пункта меню
    let imagesPage = 0;     // текущая страница в навигации по фоткам (нужна для переключения фоток через кнопки стрелочек)
    let selectedImgInd = 0; // индекс выбранной картинки (нужно для переключения фоток через кнопки стрелочек)

    let photosChanging = false;        // флаг, блокирующий интерфейс пока идет анимация переключения фото
    let selectedPhotoChanging = false; // флаг, блокирующий интерфейс пока идет анимация переключения выбранного фото
    const imagesAtPage = 4;            // количество выводимых в секции фоток

    let navItems;
    const navList = document.querySelector('.pro-services__nav-list');
    const underline = document.querySelector('.pro-services__underline-strip');
    const galleryButtons = document.querySelectorAll('.pro-services__gallery-buttons button');
    const selectedImageButtons = document.querySelectorAll('.pro-services__selected-photo-buttons button');

    const sectionPhotos = [].slice.call(document.querySelectorAll('.pro-services__gallery-img')); // сразу получаем массив из коллекции dom-элементов
    const selectedPhoto = document.querySelector('.pro-services__selected-photo img');

    // здесь храним пути к фотографиям, распределенным по секциям
    const imageSections = [
        {
            name: 'Modeling',
            images: [
                'images/portfolio/modeling/1.jpg',
                'images/portfolio/modeling/2.jpg',
                'images/portfolio/modeling/3.jpg',
                'images/portfolio/modeling/4.jpg',
            ],
        },
        {
            name: 'Acting',
            images: [
                'images/portfolio/acting/1.jpg',
                'images/portfolio/acting/2.jpg',
                'images/portfolio/acting/3.jpg',
                'images/portfolio/acting/4.jpg',
            ],
        },
        {
            name: 'Corporate',
            images: [
                'images/portfolio/corporate/1.jpg',
                'images/portfolio/corporate/2.jpg',
                'images/portfolio/corporate/3.jpg',
                'images/portfolio/corporate/4.jpg',
            ],
        },
        {
            name: 'Business',
            images: [
                'images/portfolio/business/1.jpg',
                'images/portfolio/business/2.jpg',
                'images/portfolio/business/3.jpg',
                'images/portfolio/business/4.jpg',
            ],
        },
        {
            name: 'Professional',
            images: [
                'images/portfolio/professional/1.jpeg',
                'images/portfolio/professional/2.jpeg',
                'images/portfolio/professional/3.jpg',
                'images/portfolio/professional/4.jpg',
            ],
        },
        {
            name: 'Group',
            images: [
                'images/portfolio/group/1.jpg',
                'images/portfolio/group/2.jpg',
                'images/portfolio/group/3.jpg',
                'images/portfolio/group/4.jpg',
            ],
        },
        {
            name: 'Company',
            images: [
                'images/portfolio/company/1.jpg',
                'images/portfolio/company/2.jpg',
                'images/portfolio/company/3.jpg',
                'images/portfolio/company/4.jpg',
            ],
        },
        {
            name: 'Officer',
            images: [
                'images/portfolio/officer/1.jpg',
                'images/portfolio/officer/2.jpg',
                'images/portfolio/officer/3.jpg',
                'images/portfolio/officer/4.jpg',
            ],
        },
    ];

    // меняет выбранный элемент меню
    const changeMenuItem = (clickedInd, resizing = false) => {
        selectedImgInd = 0;
        imagesPage = clickedInd == 0 ? clickedInd : clickedInd - 1;

        changeItemSelection(clickedInd);
        

        // флаг resizing в true означает что функция вызвана в результате изменения ширины окна браузера
        // сделал это для избежания ошибок в логике (т.к. при адаптиве некоторые пункты меню скрываются, может вызвать ошибки)
        if (resizing) {
            curItemInd = 0;
            underline.style.left = '0px';
            underline.style.width = `${navItems[0].offsetWidth}px`;
        } else {
            setItemUnderline(clickedInd);
        }

        changeImages(imagesPage);
    };

    // меняет стили для выбранного пункта меню
    const changeItemSelection = (clickedInd) => {
        navItems[curItemInd].classList.remove('pro-services__nav-item--active');
        navItems[clickedInd].classList.add('pro-services__nav-item--active');
    };

    // устанавливает элементу по индексу clickedInd нижнее подчеркивание
    const setItemUnderline = (clickedInd) => {
        let totalItemsWidth = 0;   // ширина элементов, идущих на пути линии, которую будем прибавлять к конечному сдвигу
        let totalMarginWidth = 0;  // отступы между элементами, идущими на пути линии, которые также будем прибавлять к конечному сдвигу

        // эту функцию вызываем если выбрали пункт расположен дальше, чем текущий
        const setUnderlinePosFurther = (from, to) => {
            totalItemsWidth = navItems[from].offsetWidth;
            totalMarginWidth = parseInt(getComputedStyle(navItems[to]).marginLeft);

            for (let i = from + 1; i < to; i++) {
                totalItemsWidth += navItems[i].offsetWidth; // суммируем ширину всех элементов по пути
                totalMarginWidth += parseInt(getComputedStyle(navItems[i]).marginLeft); // суммируем отступ пункта меню
            }

            curItemInd = clickedInd;
            let curOffset = parseInt(getComputedStyle(underline).left); // получаем текущий отступ линии (надо его сохранить, и прибавить новый)

            // подстраиваем нашу полоску под текущий выбранный элемент
            underline.style.left = `${totalItemsWidth + totalMarginWidth + curOffset}px`;
            underline.style.width = `${navItems[curItemInd].offsetWidth}px`;
        }

        // эту функцию вызываем если выбрали пункт расположен ранее, чем текущий
        const setUnderlinePosEarlier = (from, to) => {
            totalItemsWidth = navItems[to].offsetWidth;
            totalMarginWidth = parseInt(getComputedStyle(navItems[from]).marginLeft);

            for (let i = from - 1; i > to; i--) {
                totalMarginWidth += parseInt(getComputedStyle(navItems[i]).marginLeft);
                totalItemsWidth += navItems[i].offsetWidth;
            }

            curItemInd = clickedInd;
            let curOffset = parseInt(getComputedStyle(underline).left); // получаем текущий отступ линии (надо его сохранить, и прибавить новый)

            // подстраиваем нашу полоску под текущий выбранный элемент
            underline.style.left = `${curOffset - (totalItemsWidth + totalMarginWidth)}px`;
            underline.style.width = `${navItems[curItemInd].offsetWidth}px`;
        }

        if (clickedInd > curItemInd) {
            setUnderlinePosFurther(curItemInd, clickedInd);
        } else if (clickedInd < curItemInd) {
            setUnderlinePosEarlier(curItemInd, clickedInd);
        }
    };

    // загружаем картинки, соответствующие выбранной секции
    const changeImages = (clickedInd) => {
        photosChanging = true; // флаг, блокирующий интерфейс пока идет анимация переключения фото

        // меняем фото с анимацией плавного затухания и появления
        for (let i = 0; i < imagesAtPage; i++) {
            sectionPhotos[i].src = imageSections[clickedInd].images[i];
            sectionPhotos[i].classList.add('pro-services__gallery-img--fade');

            setTimeout(() => {
                sectionPhotos[i].classList.remove('pro-services__gallery-img--fade');
                if (i === imagesAtPage - 1) {
                    photosChanging = false;
                }
            }, 500);
        }

        changeSelectedImage(imageSections[clickedInd].images[0]);
    };

    // меняет текущее выбранное фото
    const changeSelectedImage = (newVal) => {
        selectedPhotoChanging = true; // флаг, блокирующий интерфейс пока идет анимация переключения фото

        selectedPhoto.classList.add('pro-services__gallery-img--fade');
        selectedPhoto.src = newVal;

        setTimeout(() => {
            selectedPhoto.classList.remove('pro-services__gallery-img--fade');
            selectedPhotoChanging = false;
        }, 500);
    };

    // обработчик клика по кнопке "следующее фото"
    const nextImageButtonClicked = () => {
        if (photosChanging || selectedPhotoChanging) {
            return;
        }

        if (selectedImgInd + 1 < imagesAtPage) {
            changeSelectedImage(imageSections[imagesPage].images[++selectedImgInd]);
        } else {
            if (curItemInd == 0) {
                selectedImgInd = 0;
                changeImages(++imagesPage);
            }
        }
    };

    // обработчик клика по кнопке "предыдущее фото"
    const prevImageButtonClicked = () => {
        if (photosChanging || selectedPhotoChanging) {
            return;
        }

        if (selectedImgInd > 0) {
            changeSelectedImage(imageSections[imagesPage].images[--selectedImgInd]);
        } else {
            if (curItemInd == 0 && imagesPage > 0) {
                selectedImgInd = 0;
                changeImages(--imagesPage);
            }
        }
    };

    // отрисовка секций меню на основании данных полученных с сервера
    const renderMenuItems = () => {
        let menuItem = document.createElement('li');
        menuItem.className = 'pro-services__nav-item pro-services__nav-item--active';
        menuItem.textContent = 'All';
        navList.append(menuItem);

        imageSections.forEach((item) => {
            menuItem = document.createElement('li');
            menuItem.className = 'pro-services__nav-item';
            menuItem.textContent = item.name;
            navList.append(menuItem);
        });

        navItems = [].slice.call(document.querySelectorAll('.pro-services__nav-item'));

        // выставляем подчеркивающей линии ширину первого пункта меню
        underline.style.width = `${navItems[curItemInd].offsetWidth}px`;
    };

    navList.addEventListener('click', (evt) => {
        let src = evt.target;

        // если клик не по элементу меню, по активному элементу или клик произведен во время анимации переключения фото - уходим
        if (!src.classList.contains('pro-services__nav-item') || src === navItems[curItemInd] || photosChanging || selectedPhotoChanging) {
            return;
        }

        changeMenuItem(navItems.indexOf(src)); // меняем выбранный пункт меню-навигации
    });

    // когда интерфейс готов - загружаем картинки
    window.addEventListener('DOMContentLoaded', () => {
        changeImages(curItemInd);
    });

    // при изменении размеров окна, чтобы ничего не сломалось
    // будем делать первый пункт выбранным
    window.addEventListener('resize', () => {
        if (curItemInd != 0) {
            changeMenuItem(0, true);
        }
    });

    galleryButtons[0].addEventListener('click', prevImageButtonClicked);
    galleryButtons[1].addEventListener('click', nextImageButtonClicked);

    selectedImageButtons[0].addEventListener('click', prevImageButtonClicked);
    selectedImageButtons[1].addEventListener('click', nextImageButtonClicked);

    renderMenuItems();

})()