var socket = io.connect('http://127.0.0.1:5000') // this is default flask server
$(document).ready(function () {
	// Отправляем сообщение при успешном соединении
	socket.on('connect', function () {
		socket.send('User connected!')
	})


	socket.on('card_created', function(data){
		console.log(data)
		updateCards(data)
		
		// Функция для обновления содержимого HTML-элемента с классом "cards"
		function updateCards(data) {
			// Получаем элемент с классом "cards"
			var cardsElement = document.getElementById('list1')
			var current_name = document.querySelector('a.nav-link').textContent.trim()
			var task = data
			if (current_name != task.user_name){
				var card = document.createElement('div')
				card.className = 'card'
				card.draggable = false
				card.id = task.card_id
				card.setAttribute('name', 'task_name')
				card.style.cursor = 'no-drop'
				var descriptionDiv = document.createElement('div')
				descriptionDiv.setAttribute('name', 'task_description')
				descriptionDiv.innerHTML = task.task_description
				card.appendChild(descriptionDiv)
				cardsElement.appendChild(card)
			}
		}
	})


	socket.on('delete_card', function(data){
		console.log(data)
		var elementToRemove = document.getElementById(data)
		elementToRemove.remove()
	})


	socket.on('task_edit', function (data) {
		console.log(data)
		var editElement = document.getElementById(data.card_id)
		var descriptionDiv = editElement.querySelector('[name="task_description"]')
		descriptionDiv.innerHTML = data.text
	});


	socket.on('task_drop', function (data) {
		// Обновить положение карточки на основе данных socket_request
		var targetList = document.getElementById(data.target_list)
		targetList.appendChild(document.getElementById(data.card_id))
	})

	
	socket.on('message', function (message) {
		// Распаковываем данные сообщения
		var msg_obj = JSON.parse(message)
		if (msg_obj.message_id) {
			console.log(typeof msg_obj.message_id)
			var element = document.querySelector(
				'[data-your-messageid="' + msg_obj.message_id + '"]'
			)
			element.parentNode.removeChild(element)
		} else {
			console.log('NORMAL')
			var user_name = msg_obj.user_name
			var data_msg_id = msg_obj.data_msg_id
			var message_body = msg_obj.message
			var message_time = msg_obj.time
			var current_name = document.querySelector('a.nav-link').textContent.trim()
			if (current_name != user_name) {
				// Создаем новый элемент для сообщения
				var newMessage = $('<div class="your-message"></div>')
				newMessage.attr('data-your-messageid', data_msg_id)
				// Добавляем имя пользователя
				var userName = $('<span class="user_name"></span>')
				userName.text(user_name)
				newMessage.append(userName)
				// Добавляем текст сообщения
				var messageContent = $('<div class="message"></div>')
				messageContent.text(message_body)
				newMessage.append(messageContent)
				// Добавляем время сообщения
				var timeMessage = $('<span class="time-message"></span>')
				timeMessage.text(message_time)
				newMessage.append(timeMessage)
				// Добавляем новое сообщение в блок сообщений
				$('.messages').append(newMessage)
			}
		}
	})
})

const chatBtn = document.querySelector('#chat')
const taskBtn = document.querySelector('#task')
const leaveBtn = document.querySelector('#leave-project')
const optionBtn = document.querySelector('#option-project')
const taskBlock = document.querySelector('#task-block')
const chatBlock = document.querySelector('#chat-block')

document.addEventListener('DOMContentLoaded', function () {
	// Получаем кнопку "Покинуть проект"
	var leaveProjectBtn = document.getElementById('leave-project')

	// Добавляем обработчик события для кнопки "Покинуть проект"
	leaveProjectBtn.addEventListener('click', function () {
		leaveProject()
	})

	// Функция для отправки запроса на сервер о покидании проекта
	function leaveProject() {
		// Определяем URL для отправки запроса
		var url = '/home/leave_project' // Замените '/leave_project' на реальный URL вашего серверного обработчика

		// Определяем параметры запроса
		var requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			// Если нужно передать дополнительные данные, добавьте их сюда
		}

		// Отправляем POST-запрос на сервер
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestOptions),
		})
			.then(() => {
				// Перенаправление пользователя
				window.location.href = '/home'
			})
			.catch(error => console.error('Ошибка при отправке запроса:', error))	
	}
})


document.addEventListener('DOMContentLoaded', function () {
	// Получаем кнопку "Покинуть проект"
	var leaveProjectBtn = document.getElementById('option-project')


	leaveProjectBtn.addEventListener('click', function () {
		leaveProject()
	})

	// Функция для отправки запроса на сервер о покидании проекта
	function leaveProject() {
		// Определяем URL для отправки запроса
		var url = '/home/option_project' 

		// Определяем параметры запроса
		var requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			// Если нужно передать дополнительные данные, добавьте их сюда
		}

		// Отправляем POST-запрос на сервер
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestOptions),
		})
			.then(() => {
				// Перенаправление пользователя
				window.location.href = '/home/option_project'
			})
			.catch(error => console.error('Ошибка при отправке запроса:', error))
	}
})

// По умолчанию делаем активной кнопку "Чат" и соответствующий блок
chatBtn.classList.add('active')
chatBlock.style.display = 'flex'
taskBlock.style.display = 'none'

// Обработчик события для кнопки "Чат"
chatBtn.addEventListener('click', () => {
	// Показываем блок чата и скрываем блок задач
	chatBlock.style.display = 'flex'
	taskBlock.style.display = 'none'

	// Делаем кнопку "Чат" активной, а кнопку "Задачи" неактивной
	chatBtn.classList.add('active')
	taskBtn.classList.remove('active')
})

// Обработчик события для кнопки "Задачи"
taskBtn.addEventListener('click', () => {
	// Показываем блок задач и скрываем блок чата
	taskBlock.style.display = 'flex'
	chatBlock.style.display = 'none'

	// Делаем кнопку "Задачи" активной, а кнопку "Чат" неактивной
	taskBtn.classList.add('active')
	chatBtn.classList.remove('active')
})

function allowDrop(ev) {
	ev.preventDefault()
}

function drag(ev) {
	ev.dataTransfer.setData('text', ev.target.id)
}

function drop(ev) {
	ev.preventDefault()
	var cardId = ev.dataTransfer.getData('text')
	var targetList = ev.target // Получаем элемент списка, на который была брошена карточка
	var parentId = ev.target.id
	targetList.appendChild(document.getElementById(cardId)) // Перемещаем карточку в этот список
	console.log(parentId)
	var listName = targetList.getAttribute('name')
	// Создаем объект данных для отправки на сервер
	var requestData = {
		card_id: cardId,
		list_name: listName,
		parent_id: parentId,
	}

	var socket_request = {
		card_id: cardId,
		list_name: listName,
		parent_id: parentId,
		target_list: targetList.id,
	}

	socket.emit('drop_task', socket_request)


	// Определяем URL для отправки запроса
	var url = '/home/' + projectId + '/' + projectName + '/' + cardId // Замените на ваш URL обработчика на сервере

	// Определяем параметры запроса
	var requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestData),
	}

	// Отправляем POST-запрос на сервер
	fetch(url, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Ошибка при отправке запроса: ' + response.status)
			}
			return response.json()
		})
		.then(data => {
			// Обработка успешного ответа от сервера
			console.log(data)
		})
		.catch(error => {
			// Обработка ошибок
			console.error('Произошла ошибка:', error)
		})
}

// Функция для создания новой карточки
function createCard(cardName) {
	const newCard = document.createElement('div')
	newCard.classList.add('card')
	newCard.draggable = true

	const cardContent = document.createElement('div')
	cardContent.setAttribute('name', 'task_description')
	cardContent.textContent = cardName
	newCard.appendChild(cardContent)

	// Присваиваем уникальный идентификатор карточке
	const cardId = '' + (document.querySelectorAll('.card').length + 1)
	newCard.id = cardId
	newCard.setAttribute('name', 'task_name')
	newCard.addEventListener('dragstart', drag)
	var current_name = document.querySelector('a.nav-link').textContent.trim()
	const formData = {
		card_id: cardId,
		task_description: cardName,
		task_status: 'Execute', // Значение по умолчанию для статуса, если нужно
		user_name: current_name,
		parent_id: 'list1', // Идентификатор родительского элемента, если нужно			user_name: current_name,
	}
		socket.emit('create_task', formData)

	return newCard
}

document.getElementById('addCard').addEventListener('click', function (event) {
	event.preventDefault() // Предотвращаем стандартное поведение кнопки "Добавить"

	// Получаем значение из поля ввода
	const cardName = document.getElementById('cardName').value.trim()
	if (!cardName) {
		alert('Пожалуйста, введите содержимое карточки.')
		return // Возвращаемся, если поле ввода пустое
	}
	var current_name = document
					.querySelector('a.nav-link')
					.textContent.trim()

	// Создаем объект данных для отправки на сервер
	const formData = {
		task_description: cardName,
		task_status: 'Execute', // Значение по умолчанию для статуса, если нужно
		parent_id: 'list1', // Идентификатор родительского элемента, если нужно
		
	}
	// Определяем URL для отправки POST-запроса
	const url = '/home/' + projectId + '/' + projectName

	// Определяем параметры запроса
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(formData),
	}

	// Отправляем POST-запрос на сервер
	fetch(url, requestOptions)
		.then(response => {
			// Проверяем статус ответа
			console.log(response.status)
			if (!response.ok) {
				throw new Error('Ошибка при отправке запроса: ' + response.status)
			}
			// Проверяем тип ответа
			const contentType = response.headers.get('content-type')
			console.log(contentType)
			if (contentType && contentType.includes('application/json')) {
				// Если тип ответа - JSON, парсим его и возвращаем
				return response.json()
			} else {
				// Иначе выбрасываем ошибку о некорректном типе ответа
				throw new Error('Некорректный тип ответа: ' + contentType)
			}
		})
		.then(data => {
			// Обработка успешного ответа от сервера
			console.log('Данные успешно отправлены:', data)

			// Создаем новую карточку на основе полученных данных
			const newCard = createCard(cardName)
			socket.on('card_created', function (data) {
				console.log('Received card created event:', data)
				// Добавьте здесь код для создания новой карточки на основе данных из события
			})
			// Добавляем созданную карточку на страницу
			const list = document.getElementById('list1') // Идентификатор списка
			// Кнопка удаления
			const deleteButton = document.createElement('button')
			deleteButton.classList.add('delete-btn')
			deleteButton.innerHTML =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" stroke-width="2.5" stroke="#ff0000" fill="none" class="duration-300 transform transition-all" style="width: 32px; height: 32px;"><path d="M45.49 54.87h-27a1 1 0 01-1-1l-2-36h32.97l-2 36a1 1 0 01-.97 1zM51 17.86H13c-.28 0-.5-.16-.5-.35l.93-4.35a.49.49 0 01.5-.3h36.14a.49.49 0 01.5.3l.93 4.35c0 .19-.22.35-.5.35zM24 23.44v25M32 23.44v25M40 23.44v25"></path><path d="M25.73 12.86V7.57a1 1 0 011-1h10.54a1 1 0 011 1v5.29"></path></svg>'
			deleteButton.addEventListener('click', function () {
				deleteCard(newCard) // Вызов функции удаления карточки
			})
			newCard.appendChild(deleteButton)

			// Кнопка редактирования
			const editButton = document.createElement('button')
			editButton.classList.add('edit-btn')
			editButton.innerHTML =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" stroke-width="2.5" stroke="#1bd07b" fill="none" class="duration-300 transform transition-all" style="width: 32px; height: 32px;"><path d="M53.16 46.18l.76 6.71A1 1 0 0152.81 54l-6.67-.77a1 1 0 01-.59-.29l-34.89-35a2 2 0 010-2.83l4.49-4.51a2 2 0 012.84 0l34.88 35a1 1 0 01.29.58zM22.69 15.31l-7.23 7.44"></path></svg>'
			editButton.addEventListener('click', function () {
				editCard(newCard) // Вызов функции редактирования карточки
			})
			newCard.appendChild(editButton)
			list.appendChild(newCard)

			// Очищаем поле ввода после добавления карточки
			document.getElementById('cardName').value = ''
			// Отправляем сообщение о создании карточки через сокеты
		})
		.catch(error => {
			// Обработка ошибок
			console.error('Произошла ошибка:', error)
		})
})

var projectId = document.getElementById('project_id').value
var projectName = document.getElementById('project_name').value

function deleteCard(button) {
	// Получаем родительский элемент карточки (div.card)
	var card = button.closest('.card')
	// Опционально: получаем id карточки
	var cardId = card.id
	socket.emit('delete_task', cardId)


	// Отправляем запрос DELETE на сервер
	fetch(`/home/${projectId}/${projectName}/${cardId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		// Тело запроса (если необходимо)
		body: JSON.stringify({
			// Полезная нагрузка, если нужно передать дополнительные данные на сервер
		}),
	})
		.then(response => {
			if (response.ok) {
				throw new Error('Ошибка удаления карточки')
			}
			// Успешно удалено, удаляем карточку из DOM
			socket.on('delete_card', function (data) {
				console.log('Deleted card:', data)
				// Добавьте здесь код для создания новой карточки на основе данных из события
			})
			card.remove()
			
		})
		.catch(error => {
			console.error('Произошла ошибка:', error)
		})
}

function editCard(button) {
	// Получаем родительский элемент карточки (div.card)
	var card = button.closest('.card')

	// Получаем элемент с описанием задачи
	var descriptionElement = card.querySelector('[name="task_description"]')
	
	// Запрашиваем новое описание у пользователя
	var newDescription = prompt(
		'Введите новое описание задачи',
		descriptionElement.textContent
	)

	// Если пользователь ввёл новое описание
	if (newDescription !== null && newDescription.length > 0) {
		// Обновляем описание задачи на клиенте
		descriptionElement.textContent = newDescription
		var edit_data ={
			text: newDescription,
			card_id: card.id,
		}
		socket.emit('edit_task', edit_data)

		// Создаем объект данных для отправки на сервер
		var data = {
			task_description: newDescription,
		}

		// Определяем URL для отправки PATCH-запроса
		var url = '/home/' + projectId + '/' + projectName + '/' + card.id

		// Определяем параметры запроса
		var requestOptions = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}

		// Отправляем PATCH-запрос на сервер
		fetch(url, requestOptions)
			.then(response => {
				// Проверяем статус ответа
				if (!response.ok) {
					throw new Error('Ошибка при отправке запроса: ' + response.status)
				}
				// Возвращаем JSON-ответ
				return response.json()
			})
			.then(data => {
				// Обработка успешного ответа от сервера
				console.log(data)
			})
			.catch(error => {
				// Обработка ошибок
				console.error('Произошла ошибка:', error)
			})
	}
}













// CHAT

var messagesContainer = document.querySelector('.messages')
window.addEventListener('load', function () {
	messagesContainer.scrollTop = messagesContainer.scrollHeight
})

$('#msg').on('keypress', function (event) {
	// Проверяем, была ли нажата клавиша Enter
	if (event.which === 13) {
		// Вызываем функцию sendMessage()
		sendMessage()
	}
})

function sendMessage() {
	// Получить текст из поля ввода
	var messageText = document.getElementById('msg').value
	var user_name_msg = document.querySelector('a.nav-link').textContent.trim()
	var now = new Date()
	var time_msg = now.getHours() + ':' + now.getMinutes()
	// Проверить, что сообщение не пустое
	if (messageText.trim().length === 0) {
		// Сообщение пустое, ничего не делать
		return
	}

	// Создать новый элемент для сообщения
	var newMessage = document.createElement('div')
	newMessage.classList.add('my-message')
	var userName = document.createElement('span')
	userName.classList.add('user_name')
	userName.textContent = document.querySelector('a.nav-link').textContent.trim()
	// Создать кнопку удаления сообщения
	var deleteButton = document.createElement('button')
	deleteButton.classList.add('del-msg')
	deleteButton.textContent = 'X'
	deleteButton.title = 'Удалить'
	var messagesContainer = document.querySelector('.messages')
	// Добавить обработчик события для кнопки удаления
	// Добавить кнопку удаления в элемент-обертку
	userName.appendChild(deleteButton)
	var messageContent = document.createElement('div')
	messageContent.classList.add('message')
	messageContent.textContent = messageText
	var timeMessage = document.createElement('span')
	timeMessage.classList.add('time-message')

	timeMessage.textContent = now.getHours() + ':' + now.getMinutes()
	// Добавить элементы в новое сообщение
	newMessage.appendChild(userName)

	newMessage.appendChild(messageContent)
	newMessage.appendChild(timeMessage)
	// Добавить новое сообщение в блок сообщений
	var messagesContainer = document.querySelector('.messages')
	messagesContainer.appendChild(newMessage)
	// Очистить поле ввода
	document.getElementById('msg').value = ''
	// Отправить запрос на сервер для сохранения сообщения
	var url = '/home/' + projectId + '/' + projectName + '/' + 'chat'
	var requestData = {
		message: messageText,
	}
	var requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestData),
	}
	fetch(url, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Ошибка при отправке сообщения: ' + response.status)
			}
			return response.json()
		})
		.then(data => {
			console.log('Сообщение успешно отправлено:', data)
			// Получить messageId из ответа сервера
			var messageId = data.message_id

			socket.send(
				JSON.stringify({
					message: messageText,
					user_name: user_name_msg,
					time: time_msg,
					data_msg_id: messageId,
				})
			)
			// Присвоить messageId как атрибут к новому сообщению
			newMessage.setAttribute('data-my-messageid', messageId)
			console.log(messageId)
		})
		.catch(error => {
			console.error('Произошла ошибка:', error)
		})
}

messagesContainer.addEventListener('click', function (event) {
	// Проверяем, был ли клик на кнопке удаления
	if (event.target.classList.contains('del-msg')) {
		// Находим родительский элемент сообщения
		var message = event.target.closest('.my-message')
		// Получаем messageId из атрибута data-messageId
		var messageId = message.getAttribute('data-my-messageid')
		// Удаляем сообщение из DOM
		message.remove()
		socket.send(JSON.stringify({ message_id: messageId }))

		// Передаем messageId в функцию deleteMessage для удаления на сервере
		deleteMessage(messageId)
	}
})

function deleteMessage(messageId) {
	var requestData = {
		message_id: messageId,
	}

	fetch(`/home/${projectId}/${projectName}/chat`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestData),
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Ошибка при отправке запроса: ' + response.status)
			}
			return response.json()
		})
		.then(data => {
			console.log('Сообщение успешно удалено:', data)
		})
		.catch(error => {
			console.error('Произошла ошибка:', error)
		})
}

function sendGetRequest() {
	// Создать URL для GET-запроса
	var url = '/home/video/chat'
	// Перенаправить на новую страницу
	window.location.href = url
}








document.addEventListener('DOMContentLoaded', function () {
	// Получаем кнопки "Принять" и "Отклонить"
	var acceptBtn = document.getElementById('accept_btn')
	var rejectBtn = document.getElementById('reject_btn')

	// Добавляем обработчики событий
	acceptBtn.addEventListener('click', function () {
		sendQueryResponse('accept')
	})

	rejectBtn.addEventListener('click', function () {
		sendQueryResponse('reject')
	})

	// Функция для отправки запроса на сервер
	function sendQueryResponse(action) {
		// Получаем id вашего сообщения
		var queryId = document.querySelector('.your-message').getAttribute('id')

		// Определяем URL для отправки запроса
		var url = '/home/all_project/action'

		// Создаем объект данных для отправки на сервер
		var requestData = {
			action: action, // 'accept' или 'reject'
			query_id: queryId
		}

		// Определяем параметры запроса
		var requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestData),
		}

		document.getElementById(queryId).remove()
		// Отправляем POST-запрос на сервер
		fetch(url, requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error('Ошибка при отправке запроса: ' + response.status)
				}
				return response.json()
			})
			.then(data => {
				// Обработка успешного ответа от сервера
				console.log(data)
				// Возможно, вам нужно выполнить какие-то действия после успешного ответа от сервера
			})
			.catch(error => {
				// Обработка ошибок
				console.error('Произошла ошибка:', error)
			})
	}
})


