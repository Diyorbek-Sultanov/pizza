window.addEventListener('DOMContentLoaded', () => {
	const cart = document.getElementById('cart')
	const closeBtn = document.getElementById('close-btn')
	const showBtn = document.getElementById('show-btn')

	// Show/Hide cart
	showBtn.addEventListener('click', () => {
		cart.classList.add('show')
		document.body.style.overflow = 'hidden'
	})

	closeBtn.addEventListener('click', () => {
		cart.classList.remove('show')
		document.body.style.overflow = 'auto'
	})
})
