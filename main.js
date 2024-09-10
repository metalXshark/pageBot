let cart = [];
const productDetails = {
    '1': { name: 'Лимонад с клубникой', description: 'Освежающий лимонад с ароматной клубникой.', price: '800 р.', image: 'icon3.jpg' },
    '2': { name: 'Лимонад с лимоном', description: 'Классический лимонад с добавлением лимона.', price: '800 р.', image: 'icon1.jpg' },
    '3': { name: 'Лимонад с мятой', description: 'Лимонад с мятой для освежения.', price: '800 р.', image: 'icon2.jpg' }
};

document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', () => {
        const productId = product.getAttribute('data-product');
        const details = productDetails[productId];
        document.getElementById('overlay-icon').src = details.image;
        document.getElementById('overlay-title').innerText = details.name;
        document.getElementById('overlay-description').innerText = details.description;
        document.getElementById('overlay-price').innerText = details.price;
        document.getElementById('add-to-cart').setAttribute('data-product', productId);
        document.getElementById('overlay').style.display = 'block';
    });
});

document.getElementById('add-to-cart').addEventListener('click', () => {
    const productId = document.getElementById('add-to-cart').getAttribute('data-product');
    if (!cart.includes(productId)) {
        cart.push(productId);
        alert('Товар добавлен в корзину');
        closeOverlay();
    }
});

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

document.getElementById('view-cart').addEventListener('click', () => {
    let orderDetails = '';
    let total = 0;
    cart.forEach(item => {
        const details = productDetails[item];
        orderDetails += `${details.name} - ${details.price}\n`;
        total += parseInt(details.price);
    });
    document.getElementById('cart-items').innerText = orderDetails || 'Корзина пуста';
    document.getElementById('cart-total').innerText = `Итого: ${total} р.`;
    document.getElementById('cart-overlay').style.display = 'block';
});

function closeCartOverlay() {
    document.getElementById('cart-overlay').style.display = 'none';
}

document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Ваша корзина пуста');
    } else {
        alert('Заказ оформлен!');
        cart = [];
        closeCartOverlay();
    }
});
