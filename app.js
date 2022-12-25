window.addEventListener('DOMContentLoaded', () => {
	const cart = document.getElementById('cart')
	const closeBtn = document.getElementById('close-btn')
	const showBtn = document.getElementById('show-btn')
	const pizzas = document.getElementById('pizzas')
	const cartList = document.getElementById('cart-list')
	const cartCount = document.getElementById('cart-count')
	const cartPrice = document.getElementById('price-value')
	const modal = document.getElementById('modal')
	const showModalBtn = document.getElementById('show-modal')
	const modalCloseBtn = document.getElementById('modal-close')
	const form = document.getElementById('form')
	const nameInput = document.getElementById('name-input')
	const telInput = document.getElementById('tel-input')

	let pizzaId = 1
	let countPizza = 1

	loadCart() // Load cart pizzas from LocalStorage

	// Show/Hide cart
	showBtn.addEventListener('click', () => {
		cart.classList.add('show')
		document.body.style.overflow = 'hidden'
	})

	closeBtn.addEventListener('click', () => {
		cart.classList.remove('show')
		document.body.style.overflow = 'auto'
	})

	// Show/Hide modal
	showModalBtn.addEventListener('click', () => {
		modal.classList.add('show')
	})

	modalCloseBtn.addEventListener('click', () => {
		modal.classList.remove('show')
	})

	// Add pizza to cart
	pizzas.addEventListener('click', purchasePizza)

	// Removing pizzas
	cartList.addEventListener('click', deletePizza)

	// Form
	form.addEventListener('submit', formHandler)

	// Update cart info
	function updateInfoCart() {
		let cartInfo = findToCart()

		cartCount.textContent = cartInfo.count
		cartPrice.textContent = cartInfo.total
	}

	updateInfoCart()

	// Pizza
	function purchasePizza(e) {
		if (e.target.classList.contains('btn--pizza')) {
			let pizza = e.target.parentElement.parentElement

			pizzaInfo(pizza)
		}
	}

	// Object pizza info
	function pizzaInfo(pizza) {
		let pizzaObj = {
			id: pizzaId,
			img: pizza.querySelector('img').src,
			title: pizza.querySelector('.pizza__item-title').textContent,
			price: pizza.querySelector('.pizza__item-price').textContent,
		}
		pizzaId++

		addToCart(pizzaObj)
		saveToPizzaInStorage(pizzaObj)
	}

	// Pizza to cart
	function addToCart(pizza) {
		const cartItem = document.createElement('div')
		cartItem.setAttribute('data-id', `${pizza.id}`)
		cartItem.classList.add('cart__list-item')

		cartItem.innerHTML = `
			<div class="cart__item-img">
				<img src="${pizza.img}" alt="pizza" />
				<p class="cart__item-title">${pizza.title}</p>
			</div>
			<div class="cart__item-counter" id="counter-wrap">
				<button class="btn plus">+</button>
				<span id="count-val">${countPizza}</span>
				<button class="btn minus">-</button>
			</div>
			<div class="cart__item-price">${pizza.price}</div>
			<button class="cart__item-close" type="button">&times;</button>
		`
		cartList.append(cartItem)
	}

	const plusBtn = document.querySelector('.plus')
	const minusBtn = document.querySelector('.minus')

	// Plus/Minus
	plusBtn.addEventListener('click', plusHandler)
	minusBtn.addEventListener('click', minusHandler)

	// Saving pizzas to LocalStorage
	function saveToPizzaInStorage(item) {
		let pizzas = getPizzaFromStorage()
		pizzas.push(item)
		localStorage.setItem('pizzas', JSON.stringify(pizzas))

		updateInfoCart()
	}

	// Getting pizzas from LocalStorage
	function getPizzaFromStorage() {
		return localStorage.getItem('pizzas')
			? JSON.parse(localStorage.getItem('pizzas'))
			: []
	}

	// Cart load in refresh
	function loadCart() {
		let pizzas = getPizzaFromStorage()

		if (pizzas.length < 1) {
			pizzaId = 1
		} else {
			pizzaId = pizzas[pizzas.length - 1].id
			pizzaId++
		}
		pizzas.forEach(pizza => addToCart(pizza))
	}

	// Calculate pizzas in cart
	function findToCart() {
		let products = getPizzaFromStorage()
		let sum = products.reduce((total, product) => {
			let price = parseFloat(product.price)

			return (total += price)
		}, 0)

		return {
			total: sum,
			count: products.length,
		}
	}

	// Delete pizza DOM and LocalStorage
	function deletePizza(e) {
		if (e.target.classList.contains('cart__item-close')) {
			const pizza = e.target.parentElement
			pizza.remove()

			let products = getPizzaFromStorage()
			let updateProduct = products.filter(product => {
				return product.id !== parseInt(pizza.dataset.id)
			})

			localStorage.setItem('pizzas', JSON.stringify(updateProduct))
			updateInfoCart()
		}
	}

	let countValue = document.getElementById('count-val')

	// Plus price
	function plusHandler() {
		countPizza++
		countValue.textContent = countPizza.toString()

		let products = getPizzaFromStorage()
		let sum = products.reduce((total, product) => {
			return parseFloat(product.price) * countPizza + total
		}, 0)
		cartPrice.textContent = sum
	}

	// Minus price
	function minusHandler() {
		if (countPizza === 1) {
			return null
		}
		countPizza--
		countValue.textContent = countPizza.toString()

		let products = getPizzaFromStorage()
		let sum = products.reduce((total, product) => {
			return parseFloat(product.price) / countPizza + total
		}, 0)

		cartPrice.textContent = sum
	}

	// Post request from API
	async function formHandler(e) {
		e.preventDefault()

		const data = {
			service_id: 'service_zil4kuu',
			template_id: 'template_w90wgmh',
			user_id: 'taFhPA5iHAoG8HgJJ',
			template_params: {
				name: nameInput.value,
				tel: telInput.value,
			},
		}

		const options = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const response = await fetch(
			'https://api.emailjs.com/api/v1.0/email/send',
			options
		)

		alert('Zakaz qabul qilindi')
		modal.classList.remove('show')
	}
})
