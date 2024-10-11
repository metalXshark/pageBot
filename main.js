let cart = {};

const productDetails = {
    '1': {
        name: 'Круазье',
        price: 800,
        description: 'Настоено на травах. Состав: Хранится в строжайсем секрете. Alc. 38-42%'
    },
    '2': {
        name: 'Имбирь/лимон',
        price: 800,
        description: 'Настоено на свежайшем продукте - Имбирь/Цедер лимона . Состав: Хранится в строжайсем секрете. Alc. 38-42%'
    },
    '3': {
        name: 'Хреновуха',
        price: 800,
        description: 'В разработаке'
    }
};

function initializeApp() {
    document.querySelectorAll('.product').forEach(product => {
        product.addEventListener('click', handleProductClick);
    });

    document.getElementById('close-overlay').addEventListener('click', closeOverlay);
    document.getElementById('add-to-cart').addEventListener('click', addToCart);
    document.getElementById('increase-quantity').addEventListener('click', increaseQuantity);
    document.getElementById('decrease-quantity').addEventListener('click', decreaseQuantity);
    document.getElementById('view-cart').addEventListener('click', viewCart);
    document.getElementById('close-cart-overlay').addEventListener('click', closeCartOverlay);
    document.getElementById('checkout').addEventListener('click', checkout);
}

function handleProductClick(event) {
    const product = event.currentTarget;
    const productId = product.getAttribute('data-product');
    if (product.getAttribute('aria-disabled') === 'true') return;

    const details = productDetails[productId];

    document.getElementById('overlay-img').src = product.querySelector('img').src;
    document.getElementById('overlay-name').innerText = details.name;
    document.getElementById('overlay-price').innerText = `${details.price}₽`;
    document.getElementById('overlay-description').innerText = details.description || "Описание напитка";

    const quantityInput = document.getElementById('quantity-input');
    quantityInput.value = cart[productId] || 1;

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('add-to-cart').setAttribute('data-product', productId);
}

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

function addToCart() {
    const productId = document.getElementById('add-to-cart').getAttribute('data-product');
    const quantity = parseInt(document.getElementById('quantity-input').value);

    if (quantity > 0) {
        cart[productId] = quantity;
    } else {
        alert('Количество товара должно быть больше 0!');
    }

    closeOverlay();
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity-input');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity-input');
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

function viewCart() {
    updateCartDisplay();
    document.getElementById('cart-overlay').style.display = 'block';
}

function closeCartOverlay() {
    document.getElementById('cart-overlay').style.display = 'none';
}

function checkout() {
    if (Object.keys(cart).length === 0) {
        alert('Ваша корзина пуста');
    } else {
        // Запрашиваем имя пользователя
        const userName = prompt('Введите ваше имя:');

        let orderDetails = '';
        let total = 0;

        Object.keys(cart).forEach(itemId => {
            const details = productDetails[itemId];
            const quantity = cart[itemId];
            orderDetails += `${details.name} - ${quantity} шт.\n`; // Убираем цену из деталей заказа
            total += details.price * quantity;
        });

        // Формируем текст сообщения
        const messageText = `Новый заказ:\n${userName}\n${orderDetails}\nИтого: ${total}₽`;

        // Отправляем POST-запрос в Telegram API
        fetch('https://api.telegram.org/bot' + '7324883600:AAGAte1fdWr-yTTwH1dsMDIn5Ze4DII-JBY' + '/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: 1031182339,
                text: messageText
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));

        alert('Заказ оформлен!\nСкоро бухнешь.\nЯ перезвоню.');
        cart = {}; // Очищаем корзину после оформления заказа
        document.getElementById('cart-overlay').style.display = 'none'; // Закрываем оверлей с корзиной
    }
}


function updateCartDisplay() {
    const cartItemsBody = document.getElementById('cart-items-body');
    cartItemsBody.innerHTML = '';
    let total = 0;

    Object.keys(cart).forEach(itemId => {
        const details = productDetails[itemId];
        const quantity = cart[itemId];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${details.name}</td>
            <td>
                <button class="decrease-quantity" data-id="${itemId}">-</button>
                <span class="item-quantity">${quantity}</span>
                <button class="increase-quantity" data-id="${itemId}">+</button>
            </td>
            <td>${details.price * quantity}₽</td>
        `;
        cartItemsBody.appendChild(row);
        total += details.price * quantity;
    });

    document.getElementById('cart-total').innerText = `Итого: ${total}₽`;
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Обработчик для кнопок + и - в корзине
document.getElementById('cart-items-body').addEventListener('click', (event) => {
    if (event.target.classList.contains('increase-quantity') ||
        event.target.classList.contains('decrease-quantity')) {
        const itemId = event.target.getAttribute('data-id');
        if (event.target.classList.contains('increase-quantity')) {
            cart[itemId]++;
        } else {
            cart[itemId]--;
            if (cart[itemId] === 0) {
                delete cart[itemId];
            }
        }
        updateCartDisplay();
    }
});
