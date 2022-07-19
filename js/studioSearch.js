;(function() {

    // --- здесь надо получать данные о расположении студий с сервера ---
    // --- но за неимением сервера воспользуемся моковым массивом ---
    const locationsData = [
        {
            coords: [48.01749953531891, 37.801175073025284],
            address: 'Artyoma street 100, Donetsk',
            contact: '+7 222 222 22 22',
            workTime: '9:00 — 17:00',
        },
        {
            coords: [48.00615466803201, 37.8062927278257],
            address: 'Postysheva street 137, Donetsk',
            contact: '+7 222 222 22 21',
            workTime: '9:00 — 17:00',
        },
        {
            coords: [47.990622366667544, 37.7892553361631],
            address: 'Stadium street 6, Donetsk',
            contact: '+7 222 242 52 23',
            workTime: '9:00 — 17:00',
        },
        {
            coords: [48.009275682443715, 37.850812033054886],
            address: 'Shevchenko blvd 87, Donetsk',
            contact: '+7 222 213 68 22',
            workTime: '9:00 — 17:00',
        },
        {
            coords: [47.94847583723212,37.777759603434866],
            address: 'Leninskiy prospect 146, Donetsk',
            contact: '+7 222 278 24 12',
            workTime: '9:00 — 17:00',
        },
        {
            coords: [47.96617646952357,37.73432731110655],
            address: 'Kirova street 126, Donetsk',
            contact: '+7 264 217 23 22',
            workTime: '9:00 — 17:00',
        },
    ];

    // --- логика по поиску фотостудий: ищем совпадения с поисковой строкой в моковых данных и показываем список совпадений  ---
    let studioInput = document.querySelector('.studio-search__location-input');
    let searchDropdown = document.querySelector('.studio-search__dropdown');
    let searchDropdownList = document.querySelector('.studio-search__dropdown-list');

    studioInput.addEventListener('input', (evt) => {
        let newVal = evt.target.value.trim().toLowerCase();

        if (newVal === '') {
            searchDropdown.classList.add('studio-search__dropdown--hidden');
            return;
        }

        let searchedData = locationsData.filter((item) => {
            return item.address.toLowerCase().startsWith(newVal);
        });

        if (searchedData.length > 0) {
            searchDropdown.classList.remove('studio-search__dropdown--hidden');
            searchDropdownList.innerHTML = '';

            searchedData.forEach((item) => {
                let dropDownItem = document.createElement('li');
                dropDownItem.className = 'studio-search__dropdown-item';
                dropDownItem.textContent = item.address;
                searchDropdownList.append(dropDownItem);
            });
        } else {
            searchDropdown.classList.add('studio-search__dropdown--hidden');
        }
    });

    // --- подключение и настройка карты ---
    if (window.ymaps) {
        ymaps.ready(() => {
            let locationsMap = new ymaps.Map('studiosMap', {
                center: [48.01, 37.50],
                zoom: 11,
                controls: []
            });
    
            locationsMap.controls.add('zoomControl', {
                position: {
                    top: '15px',
                    left: '15px'
                },
                size: 'small'
            });
    
            locationsData.forEach((item) => {
                let placemark = new ymaps.Placemark(item.coords, {
                    balloonContentHeader: item.address,
                    balloonContentBody: `
                        <div style="margin:9px 0 6px;">
                            Contact: ${item.contact}
                        </div>
                        <div style="margin: 0 0 9px;">
                            Working hours: ${item.workTime}
                        </div>
                    `,
                    hintContent: "Подробнее"
                }, {
                    preset: 'islands#darkBlueDotIcon'
                });
    
                locationsMap.geoObjects.add(placemark);
            });
        });
    }

})()