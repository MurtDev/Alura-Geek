document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search-input');
    const apiUrl = 'http://localhost:3000/products';

  
    async function fetchProducts() {
        try {
            const response = await fetch(apiUrl);
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }


    function renderProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach((product) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${parseFloat(product.price).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</div>
                    <button class="delete-btn" data-id="${product.id}">
                    <i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
    }


    async function addProduct(product) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (response.ok) {
                fetchProducts();
                form.reset(); 
            } else {
                alert('Error adding product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }

    async function deleteProduct(id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchProducts(); 
            } else {
                alert('Error deleting product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    async function searchProducts(searchTerm) {
        try {
            const response = await fetch(apiUrl);
            const products = await response.json();
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            renderProducts(filteredProducts);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    }

   
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const image = document.getElementById('product-image').value;

        if (name && !isNaN(price) && image) {
            const product = { name, price, image };
            addProduct(product);
        } else {
            alert('Por favor, complete todos los campos correctamente.');
        }
    });


    productsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const id = e.target.closest('.delete-btn').dataset.id;
            deleteProduct(id);
        }
    });

   
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        searchProducts(searchTerm);
    });

    
    fetchProducts();
});

document.addEventListener("DOMContentLoaded", function () {
  
    const productsContainer = document.getElementById("products-container");
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modal-image");
    const modalInfo = document.getElementById("modal-info");
    const closeModalBtn = document.querySelector(".close-btn");

 
    function openModal(product) {
        modalImage.src = product.imageUrl;
        modalInfo.innerHTML = `
            <h3>${product.name}</h3>
            <p>Precio: ${product.price}</p>
        `;
        modal.style.display = "flex";
    }

 
    productsContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("product-image")) {
            const productCard = e.target.closest(".product-card");
            const productName = productCard.querySelector(".product-name").textContent;
            const productPrice = productCard.querySelector(".product-price").textContent;
            const productImageSrc = e.target.src;
            
            const product = {
                name: productName,
                price: productPrice,
                imageUrl: productImageSrc,
            };
            openModal(product);
        }
    });

   
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

   
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
