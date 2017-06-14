var wait = function(first){ 
        //класс для реализации вызова методов по цепочке
    return new (function(){ 
        var self = this;
        var callback = function(){
            var args;
            if(self.deferred.length) {
                /* превращаем массив аргументов
                  в обычный массив */
                args = [].slice.call(arguments); 

                /* делаем первым аргументом функции-обертки
                  коллбек вызова следующей функции */
                args.unshift(callback); 

                //вызываем первую функцию в стеке функций
                self.deferred[0].apply(self, args); 

                //удаляем запущенную функцию из стека
                self.deferred.shift(); 
            }
        }
        this.deferred = []; //инициализируем стек вызываемых функций

        this.wait = function(run){
            //добавляем в стек запуска новую функцию
            this.deferred.push(run); 

            //возвращаем this для вызова методов по цепочке
            return self; 
        }

        first(callback); //запуск первой функции
    });
}

wait(function(runNext){
        log('Первая анимация пошла');
        
        $('#div1').animate({
            top: 30
        }, 1000, function(){
            //передаем какие-нибудь аргументы в следующий вызов
            runNext(1,2); 
        });
        
    }).wait(function(runNext, a, b){
        //используем аргументы из предыдущего вызова
        log('Вторая анимация пошла, a='+a+' b='+b ); 
        
        $('#div2').animate({
            top: 50
        }, 1000, runNext);
        
    }).wait(function(runNext){
        log('Ждем две секунды');
        
        setTimeout(function(){
            log('Две секунды прошли')
            runNext();
        }, 2000);
        
    }).wait(function(runNext){
        log('Третья анимация пошла');
        
        $('#div3').animate({
            left: 50
        }, 1000, runNext);
        
    }).wait(function(runNext){
        log('Последняя анимация');
        
        $('#div1').animate({
            top: 0,
            left: 45
        }, 1000, runNext);
        
    }).wait(function(){
        log('Закончили');
    });