class Product {
	constructor(name, price, description, file, nameDescription) {
		this.name = name;
		this.price = price;
		this.description = description;
		this.file = file || '';
		this.nameDescription = nameDescription;
	}

	saveProduct(firebase, product ) {
		firebase.database().ref('tiendalima').child('products').push(product);
	}

	showAllProduct(firebase) {
		firebase.database().ref('tiendalima').child('products').on('child_added', function(snap) {
			let product = snap.val();
			product = {...product, key:snap.key};
			let ui = new UI();
			ui.showListProduct(product);
		});
	}

	searchProduct(firebase, valueSearch) {
		let ui = new UI();
		ui.clearListProduct();
		let product = new Product();

		if (valueSearch == '') {
			product.showAllProduct(firebase);
			return;
		}
		// firebase.database()
		// 		.ref('tiendalima')
		// 		.child('products')
		// 		.orderByChild('nameDescription')
		// 		.startAt(valueSearch.toLowerCase())
		// 		.on('value', function(snap) {
		// 	let productValue = snap.val();
		// 	console.table(productValue);
		// 	let ui = new UI();
		// 	ui.showListProduct(productValue);
		// });

		firebase.database()
				.ref('tiendalima')
				.child('products')
				.orderByChild('nameDescription')
				.on('value', function(snap) {
			let productValue = snap.val();
			productValue = Object.entries(productValue);
			productValue = productValue.map(e => e[1]);
			productValue = productValue.filter(e => e.nameDescription.search(valueSearch.toLowerCase()) > -1);
			let ui = new UI();
			productValue.forEach(function(e) {
				ui.showListProduct(e);
			});
		});
	}
}

class UI {
	showListProduct( {name, price, description, file, key} ) {
		const productList = document.getElementById('product-list');
		let productContainer = document.createElement('div');
		// productContainer.style.marginTop = '10px';
		productContainer.classList.add('product-item');

		let product = `
			<div class="fz-22">
				<strong>Nombre</strong>: ${name} <br/>
				<strong>Precio</strong>: ${price} bs<br/>
				<strong>Descripción</strong>: <div class="ws-prewrap">${description}</div>
			</div>
			<div class="text-center">
				<img src="${file}" class="img-fluid">
			</div>
			<div class="text-center mt-2 mb-2">
				<button id="button-edit" class="btn btn-danger" onClick="editProduct('${key}')">Editar ${key}</button>
			</div>`;
		productContainer.innerHTML = product;
		productList.appendChild(productContainer);
	}

	clearListProduct() {
		const productList = document.getElementById('product-list');
		productList.innerHTML = '';
	}

	converBase64(element) {
		let file = element.files[0];
		let reader = new FileReader();
		let result = '';
		reader.onloadend = function() {
			result = reader.result;
			let base64 = document.getElementById('base64').value = reader.result;
		}
		reader.readAsDataURL(file);
	}

	showMessage(message, cssClass) {
		const app = document.getElementById('App');
		const div = document.createElement('div');
		const container = document.querySelector('.container');
		div.className = 'alert mt-3 alert-' + cssClass;
		div.appendChild(document.createTextNode(message));
		container.insertBefore(div, app);

		setTimeout(function() {
			document.querySelector('.alert').remove();
		}, 3000);
	}
}

init();

// Dom Events
const saveButton = document.getElementById('button-save');
const searchText = document.getElementById('search-text');
const searchButton = document.getElementById('search-button');
const file = document.getElementById('file');
const buttonRegister = document.getElementById('button-register');
const buttonBacksearch = document.getElementById('button-backsearch');

saveButton.addEventListener('click', function(e) {
	e.preventDefault();
	e.stopPropagation();

	let name = document.getElementById('name').value;
	let price = document.getElementById('price').value;
	let description = document.getElementById('description').value;
	let base64 = document.getElementById('base64').value;

	if (name == '' || price == '') {
		alert('El nombre y el precio deben ser ingresados');
	}

	let product = new Product(name, price, description, base64, name.toLowerCase());
	product.saveProduct(firebase, product);
});

searchText.addEventListener('keyup', function(e) {
	let product = new Product();
	product.searchProduct(firebase, this.value);
});

searchButton.addEventListener('click', function(e) {
	let product = new Product();
	product.searchProduct(firebase, searchText.value);
});

file.addEventListener('change', function(e) {
	let ui = new UI();
	console.log(ui.converBase64(this));
});

buttonRegister.addEventListener('click', function(e) {
	e.preventDefault();
	e.preventDefault();
	let registerContainer = document.getElementById('register-container');
	let seachContainer = document.getElementById('search-container');

	seachContainer.style.display = 'none';
	registerContainer.style.display = 'block'
});

buttonBacksearch.addEventListener('click', function(e) {
	e.stopPropagation();
	e.preventDefault();
	let registerContainer = document.getElementById('register-container');
	let seachContainer = document.getElementById('search-container');

	seachContainer.style.display = 'block';
	registerContainer.style.display = 'none'
});

function defaultBase64(element) {
	element.innerHTML = 'data:image/png;base64,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';
}

function init() {
	let product = new Product();
	let base64 = document.getElementById('base64');

	let registerContainer = document.getElementById('register-container');
	let seachContainer = document.getElementById('search-container');

	registerContainer.style.display = 'none';

	product.showAllProduct(firebase);
	defaultBase64(base64);
}

function editProduct(key) {
	console.log(key);
}