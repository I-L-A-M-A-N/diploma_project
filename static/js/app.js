const loginBtn = document.querySelector('#login')
const registerBtn = document.querySelector('#register')
const loginForm = document.querySelector('.login-form')
const registerForm = document.querySelector('.register-form')

const emailInput = document.getElementById('email')
const userNameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const submitBtn = document.getElementById('submitBtn')


emailInput.addEventListener('input', validateForm)
userNameInput.addEventListener('input', validateForm)
passwordInput.addEventListener('input', validateForm)


loginBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = '#013138'
    registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

    loginForm.style.left = '50%';
    registerForm.style.left = '-50%';

    loginForm.style.opacity = 1;
	registerForm.style.opacity = 0;
    
    document.querySelector('.left-box').style.borderRadius = '0 30% 20% 0'
})


registerBtn.addEventListener('click', () => {
	loginBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
	registerBtn.style.backgroundColor = '#013138'

        loginForm.style.left = '150%'
		registerForm.style.left = '50%'
        
        loginForm.style.opacity = 0;
        registerForm.style.opacity = 1;

        document.querySelector('.right-box').style.borderRadius = '0 20% 30% 0';
})

function validateForm() {
	const emailValue = emailInput.value
	const userNameValue = userNameInput.value
	const passwordValue = passwordInput.value

	// Проверяем условие для адреса электронной почты
	const isEmailValid = /\S+@\S+\.\S+/.test(emailValue)
	// Проверяем условие для длины логина
	const isUserNameValid = userNameValue.length >= 2   
	// Проверяем условие для длины пароля
	const isPasswordValid = passwordValue.length >= 8

	// Устанавливаем цвет рамки вокруг поля ввода в зависимости от выполнения условий
	emailInput.style.borderColor = isEmailValid ? '#0fff5f' : '#ff004c'
    userNameInput.style.borderColor = isUserNameValid ? '#0fff5f' : '#ff004c'
	passwordInput.style.borderColor = isPasswordValid ? '#0fff5f' : '#ff004c'

	// Если оба условия выполнены, разблокируем кнопку отправки формы, иначе блокируем её
	if (isEmailValid && isPasswordValid && isUserNameValid) {
		submitBtn.removeAttribute('disabled')
	} else {
		submitBtn.setAttribute('disabled', 'disabled')
	}
}


