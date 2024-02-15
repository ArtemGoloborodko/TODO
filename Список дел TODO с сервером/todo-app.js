
(function () {

    let listArray = [],
        listName = "";

    //Создаем и возвращаем заголовок приложания 
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //Создаем и возвращаем форму для создания тела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = ('Новое дело');
        input.style.borderRadius = '20px 0 0 20px'
        input.style.padding = '25px'
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = ('Добавить дело');
        document.body.style.backgroundColor = 'rgb(237 237 237)'

        button.disabled = true;

        input.addEventListener('input', function () {
            if (input.value != "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };

    }

    //Создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }



    //Сoздаем список дел который будет добавляться 

    function createTodoItemElement(todoItem, { onDone, onDelite }) {

        const doneClass = 'list-group-item-success'

        let item = document.createElement('li')
        //Помещаем кнопки в список, которые будут там лежать в одной группе
        let buttunGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        //Устанавливаем стили для элементов с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        if (todoItem.done) {
            item.classList.add(doneClass)
        }
        item.textContent = todoItem.name;

        item.classList.add('text-break')
        buttunGroup.classList.add('btn-group', 'btn-group-sm', 'text-nowrap');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';
        deleteButton.style.marginLeft = '10px';
        buttunGroup.style.marginLeft = '10px';
        item.style.marginBottom = '10px';
        item.style.borderRadius = '20px'




        //item.id = todoItem.id

        //добавляем обработчик кнопок 
        doneButton.addEventListener('click', () => {
            onDone({ todoItem, element: item })
            item.classList.toggle(doneClass, todoItem.done);
        });
        // if (onDone) item.classList.add(doneClass);

        deleteButton.addEventListener('click', () => {
            onDelite({ todoItem, element: item })
        });



        //Вкладываем кнопки чтобы они вложились в один элеммент и обьеденились в блок
        buttunGroup.append(doneButton);
        buttunGroup.append(deleteButton);
        item.append(buttunGroup);


        return item;


    }

    // Часть кода для сохранения списка в localStorage
    /*   function saveList(arr, nameList) {
          window.localStorage.setItem(nameList, JSON.stringify(arr))
      } */

    async function createTodoApp(container, title, owner) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        const handlers = {
            onDone({ todoItem }) {
                todoItem.done = !todoItem.done
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ done: todoItem.done }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            },
            onDelite({ todoItem, element }) {
                if (!confirm('Вы уверены?')) {
                    return;
                }
                element.remove();
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'DELETE',
                });
            },
        };

        //создаем контейнер для кнопок фильтра
        const divBtn = document.createElement('div')
        divBtn.style.paddingBottom = '20px'

        // Создаем кнопку для отображения выполненных дел
        const completedButton = document.createElement('button');
        completedButton.classList.add('btn', 'btn-info', 'mr-2');
        completedButton.textContent = 'Выполненные';
        completedButton.addEventListener('click', showCompleted);

        // Создаем кнопку для отображения невыполненных дел
        const incompleteButton = document.createElement('button');
        incompleteButton.classList.add('btn', 'btn-warning');
        incompleteButton.textContent = 'Невыполненные';
        incompleteButton.addEventListener('click', showIncomplete);

        // Создаем кнопку сброса для отображения невыполненных дел
        const resetleteButton = document.createElement('button');
        resetleteButton.classList.add('btn', 'btn');
        resetleteButton.textContent = 'Сброс';
        resetleteButton.addEventListener('click', showIncompleteReset);

        // Добавляем кнопки на страницу
        container.append(divBtn)
        divBtn.append(completedButton);
        divBtn.append(incompleteButton);
        divBtn.append(resetleteButton);

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        //запрос на список всех дел
        const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
        const todoItemList = await response.json();

        todoItemList.forEach(todoItem => {
            const todoItemElement = createTodoItemElement(todoItem, handlers);
            todoList.append(todoItemElement);

        });


        // Часть кода для сохранения списка в localStorage
        /* 
                listName = nameList;
                listArray = def;
        
        
                let localData = localStorage.getItem(listName)
        
                if (def.length > 0) {
                    listArray = def
                    saveList(listArray, listName)
                }
        
                if (localData !== "" && localData !== null) {
                    listArray = JSON.parse(localData)
                }
        
                if (listArray.length > 0) {
                    for (let oneObj of listArray) {
                        let todoItemElement = createTodoItemElement(oneObj);
                        todoList.append(todoItemElement);
        
                    }
                } */


        //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', async e => {
            e.preventDefault();

            //игнорируем создание элемента если пользователь ничего не ввел в поле для ввода
            if (!todoItemForm.input.value) {
                return;
            }

            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                body: JSON.stringify({
                    name: todoItemForm.input.value.trim(),
                    owner,
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const todoItem = await response.json();

            let todoItemElement = createTodoItemElement(todoItem, handlers);

            //создаем и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItemElement);

            function getNewId(arr) {
                let max = 0;

                for (let item of arr) {
                    if (item.id > max) max = item.id
                }
                return max + 1
            }


            let obj = {
                id: getNewId(listArray),
                name: todoItemForm.input.value,
                done: false,
            }

            listArray.push(obj)

            //обнуляем значение в поле после того как ввели название дела, чтобы не стирать в ручную 
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;

           // saveList(listArray, listName)
        });

        // Функция для отображения только выполненных дел
        function showCompleted() {
            const todoItems = todoList.querySelectorAll('.list-group-item');
            todoItems.forEach(item => {
                if (!item.classList.contains('list-group-item-success')) {
                    item.classList.add('cloce') 
                } else {
                    item.classList.remove('cloce') 
                }
            });
        }

        // Функция для отображения только невыполненных дел
        function showIncomplete() {
            const todoItems = todoList.querySelectorAll('.list-group-item');
            todoItems.forEach(item => {
                if (item.classList.contains('list-group-item-success')) {
                    item.classList.add('cloce') 
                } else {
                    item.classList.remove('cloce') 
                }
            });
        }

        function showIncompleteReset() {
            const todoItems = todoList.querySelectorAll('.list-group-item');
            todoItems.forEach(item => {
                if (item.classList.contains('list-group-item-success')) {
                    item.classList.remove('cloce') 
                } else {
                    item.classList.remove('cloce') 
                }
            });
        }
    }


    window.createTodoApp = createTodoApp;


})();