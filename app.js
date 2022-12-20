window.addEventListener('DOMContentLoaded', () => {
	const cart = document.getElementById('cart')
	const closeBtn = document.getElementById('close-btn')
	const showBtn = document.getElementById('show-btn')
	const pizzas = document.getElementById('pizzas')
	const cartList = document.getElementById('cart-list')
	const cartCount = document.getElementById('cart-count')

	let pizzaId = 1

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

	pizzas.addEventListener('click', purchasePizza)

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

	function purchasePizza(e) {
		if (e.target.classList.contains('btn--pizza')) {
			let pizza = e.target.parentElement.parentElement

			pizzaInfo(pizza)
		}
	}

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

	function addToCart(pizza) {
		const cartItem = document.createElement('div')
		cartItem.setAttribute('data-id', `${pizza.id}`)
		cartItem.classList.add('cart__list-item')

		cartItem.innerHTML = `
			<div class="cart__item-img">
				<img src="${pizza.img}" alt="pizza" />
				<p class="cart__item-title">${pizza.title}</p>
			</div>
			<div class="cart__item-counter">
				<button class="btn">+</button>
				<span>1</span>
				<button class="btn">-</button>
			</div>
			<div class="cart__item-price">${pizza.price}</div>
			<button class="cart__item-close" type="button">&times;</button>
		`

		cartList.append(cartItem)
	}

	function saveToPizzaInStorage(item) {
		let pizzas = getPizzaFromStorage()
		pizzas.push(item)
		localStorage.setItem('pizzas', JSON.stringify(pizzas))
	}

	function getPizzaFromStorage() {
		return localStorage.getItem('pizzas')
			? JSON.parse(localStorage.getItem('pizzas'))
			: []
	}

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
})
