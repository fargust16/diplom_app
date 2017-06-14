var MsqTab = (GLOB) => {
    "use strict";
    var DOC = GLOB;
    // Эта ф-ция вызывается в контексте объекта вкладок (того, что возвращаем ниже)
    function initEventListener(tab) {
        tab.list.onclick = function (e) {
            // Получаем кроссбр. объект события:
            var ev = e || GLOB.event,
                target = ev.target || ev.srcElement;
            // Если кликнули не на элементе А  или элемент является текущим - на выход:
            if (target.tagName !== "A" || (target.className && target.className.indexOf("current") !== -1)) {
                return false;
            }
            // Событие перед закрытием вкладки:
            if (!tab.config.closeTabCallback(tab)) {
                return false;
            }
            // Скрываем активную вкладку:
            tab.openTab.style.display = "none";
            // Получаем вкладку, соответствующую кликнутому<img class="smilies-pic" src="/images/ab.gif">элементу:
            tab.openTab = DOC.getElementById(target.hash.slice(1));
            // Событие перед открытием вкладки:
            if (!tab.config.openTabCallback(tab)) {
                return false;
            }
            // Отображаем вкладку, соответствующую клик. элементу:
            tab.openTab.style.display = "block";
            // Убираем класс "current" у, теперь уже бывшего элемента (ссылки) списка:
            tab.currLiA.className = tab.currLiA.className.replace(/(\s?current)\b/, '');
            // Запоминаем ссылку на кликнутый элемент списка (ссылку)...
            tab.currLiA  = target;
            // Устанавливаем ему класс "current", избегая ненужных пробелов:
            tab.currLiA.className += tab.currLiA.className.length ? " current" : "current";
            // Возвращаем всегда, что бы не происходило ни каких переходов:
            return false;
        };
    }
    // Инициализация конфигурации:
    function initConfig(newConfig, tabConfig) {
        var p;
        for (p in newConfig) {
            if (newConfig.hasOwnProperty(p) && tabConfig.hasOwnProperty(p)) {
                tabConfig[p] = typeof newConfig[p] === "undefined" ? tabConfig[p] : newConfig[p];
            }
        }
        return true;
    }
    return function (list, container, config) {
        return {
            list      : null, // HTML-элемент-список элементов "А" вкладок
            listItems : null, // Массив ссылок(элементов "А") на вкладки
            tabItems  : null, // Массив вкладок(элементов "DIV")
            openTab   : null, // Ссылка на объект (HTMLDIVElement) - открытую вкладку
            currLiA   : null, // Ссылка на объект (HTMLAElement) - текущий (активный) элемент списка
            // Конфигурация:
            config   : {
                preOpen          : 1,
                initCallback     : function (tabObj) {return true; },
                openTabCallback  : function (tabObj) {return true; },
                closeTabCallback : function (tabObj) {return true; }
            },
            /**
            * Инициализация вкладок срабатывает сразу.
            * @param HTMLULElement list - список с элементами-вкладками.
            * @param HTMLElement container - контейнер тел вкладок. 
            * @param Object config - объект конфигурации.
            * @param boolean false
            */
            init : function (list, container, config) {
                var length, i;
                this.list       = list;
                this.listItems  = list.getElementsByTagName("A");
                this.tabItems   = container.getElementsByTagName("DIV");
                // Инициализация конфигурации:
                initConfig(config, this.config);                
                for (i = 0, length = this.listItems.length; i < length; i += 1) {
                    // Ищем текущий (активный) элемент списка
                    // И запоминаем ссылки на них.
                    if ((i + 1) === this.config.preOpen) {
                        this.currLiA  = this.listItems[i];
                        // В случае, если currLiA уже имел какой - либо класс-стиль - нам нужно добавить сначала пробел, а потом уже наш класс.
                        // Если currLiA НЕ имел какого - либо класса-стиля нам нужно установить имя без пробела.
                        // Устанавливаем имя класса, избегая ненужных пробелов:
                        this.currLiA.className += this.currLiA.className.length ? " current" : "current";
                        this.openTab = DOC.getElementById(this.listItems[i].hash.slice(1));
                    }
                    // Скрываем все не активные вкладки:
                    if (this.tabItems[i] !== this.openTab) {
                        this.tabItems[i].style.display = "none";
                    }
                }
                // Событие инициализации:
                if (!this.config.initCallback(this)) {
                    return false;
                }
                // Навешиваем ОДИН! единственный обработчик сразу на весь список:
                initEventListener(this);
                return this;
            }
        }.init(list, container, config);
    };
}(this);