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

	let pizzaId = 1
	let countPizza = 1

	loadPizzas() // Pizzas load from JSON file
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

	// Fetching pizzas from JSON File
	function loadPizzas() {
		fetch('./pizza.json')
			.then(response => response.json())
			.then(data => {
				let html = ''
				data.forEach(pizza => {
					html += `
						<div class="pizza__item">
							<img src="${pizza.img}" alt="pizza" />
							<h5 class="pizza__item-title">${pizza.title}</h5>
							<p class="pizza__item-desc">${pizza.desc}</p>
							<div class="pizza__item-info">
								<h4 class="pizza__item-price">${pizza.price}</h4>
								<button class="btn btn--pizza">Заказать</button>
							</div>
						</div>
					`
				})

				pizzas.innerHTML = html
			})
			.catch(err => {
				console.log('Error', err)
			})
	}

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

		const counterWrap = document.getElementById('counter-wrap')

		// Plus/Minus
		counterWrap.addEventListener('click', counterVal)
	}

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

	function counterVal(e) {
		if (e.target.classList.contains('plus')) {
			countPizza++
			countValue.textContent = countPizza
		} else if (e.target.classList.contains('minus')) {
			if (countPizza >= 1) {
				countPizza--
				countValue.innerHTML = countPizza
			}
		}
	}

	// Post request from API
	async function formHandler(e) {
		e.preventDefault()

		const formData = new FormData(form)
		formData.append('service_id', 'service_zil4kuu')
		formData.append('template_id', 'template_0etxua8')
		formData.append('user_id', 'taFhPA5iHAoG8HgJJ')

		let obj = {}
		formData.forEach((value, key) => {
			obj[key] = value
		})
		console.log(obj)

		try {
			const options = {
				method: 'POST',
				body: JSON.stringify(obj),
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}

			const response = await fetch(
				'https://api.emailjs.com/api/v1.0/email/send-form',
				options
			)
			const data = await response.json()
			console.log(data)
		} catch (error) {
			console.error('Error', error)
		}
	}
})
