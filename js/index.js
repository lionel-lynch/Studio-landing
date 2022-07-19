// ---- модуль для общей функциональности ----

;(function() {

    // --- переключение бургер меню ---
    const burgBtn = document.querySelector('.header__burger-button');
    const burgMenu = document.querySelector('.burger-menu');

    burgBtn.addEventListener('click', () => {
        burgBtn.classList.toggle('burger-button-active');
        burgMenu.classList.toggle('burger-menu-active');
    });


    // --- создание объекта паралакса из соответствующей библиотеки ---
    new Rellax('.header-banner__bg img');


    // --- скроллим до портфолио при клике на кнопке из баннера на первом экране ---
    const headerBannerBrowseBtn = document.querySelector('.header-banner__browse-button button');
    const portfolioBlock = document.querySelector('.pro-services');

    headerBannerBrowseBtn.addEventListener('click', () => {    
        window.scrollTo({
            behavior: 'smooth',
            top: window.pageYOffset + portfolioBlock.getBoundingClientRect().top
        });
    });


    // --- навигация по страничке из меню в шапке и из бургер меню ---
    const headerNav = document.querySelector('.header__nav-list');
    const burgerNav = document.querySelector('.burger-menu__nav-list');

    // в data-атрибуте у пункта навигации храним название секции, и по клику из этого объекта будем брать секцию, к которой надо проскроллить
    const sectionsMap = {
        'individSessions': document.querySelector('.services__item--individ'),
        'companiesSessions': document.querySelector('.services__item--companies'),
        'studiosLocations': document.querySelector('.locations'),
        'clients': document.querySelector('.clients'),
        'blog': document.querySelector('.blog')
    };

    const pageNavigate = (evt, targetClass) => {
        const src = evt.target;

        if (!src.classList.contains(targetClass)) {
            return;
        }

        let navigateTo = src.dataset.nav;

        scrollTo({
            behavior: 'smooth',
            top: window.pageYOffset + sectionsMap[navigateTo].getBoundingClientRect().top
        });
    };

    headerNav.addEventListener('click', (evt) => pageNavigate(evt, 'header__nav-item'));
    burgerNav.addEventListener('click', (evt) => pageNavigate(evt, 'burger-menu__nav-link'));


    // --- анимация контента при появлении ---
    const animItems = [].slice.call(document.querySelectorAll('.animated-content')); // сразу делаем массив из коллекции

    if (animItems.length > 0) {
        
        // функция проверяет, находится ли элемент в области видимости
        // если да - добавляем ему анимацию появления
        const animateOnScroll = () => {
            for (let i = 0; i < animItems.length; i++) {
                const animItem = animItems[i];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = animItem.getBoundingClientRect().top + window.pageYOffset;
                const animStart = 100;

                let animItemPoint = window.innerHeight - animItemHeight / animStart;

                if (animItemHeight > window.innerHeight){
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                }

                if (window.pageYOffset > animItemOffset - animItemPoint && window.pageYOffset < animItemOffset + animItemHeight) {
                    animItem.classList.add('animated-content--active');
                    animItems.splice(i, 1);
                    --i;
                }
            }
        }

        animateOnScroll();
        window.addEventListener('scroll', animateOnScroll);
    }

    // --- вывод текущего года в футере ---
    const footerDate = document.querySelector('.sub-footer__rights');
    footerDate.textContent = `© ${(new Date()).getFullYear()}. All rights reserved.`;
    
})()