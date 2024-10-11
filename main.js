let cart = {};

// Детали продуктов (название, цена и описание)
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
document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', () => {
        if (product.getAttribute('aria-disabled') !== 'true') {
            // Открыть окно с деталями продукта
            document.querySelectorAll('.product').forEach(product => {
                product.addEventListener('click', () => {
                    const productId = product.getAttribute('data-product');
                    const details = productDetails[productId];

                    // Устанавливаем детали выбранного продукта в оверлей
                    document.getElementById('overlay-img').src = product.querySelector('img').src;
                    document.getElementById('overlay-name').innerText = details.name;
                    document.getElementById('overlay-price').innerText = `${details.price}₽`;
                    document.getElementById('overlay-description').innerText = details.description || "Описание напитка";

                    // Обновляем количество товара в оверлее
                    const quantityInput = document.getElementById('quantity-input');
                    quantityInput.value = cart[productId] || 1; // Показываем количество, если оно уже в корзине

                    // Показываем оверлей
                    document.getElementById('overlay').style.display = 'block';

                    // Сохраняем текущее выбранное id продукта для использования при добавлении в корзину
                    document.getElementById('add-to-cart').setAttribute('data-product', productId);
                });
            });
        }
    });
});



// Закрыть окно с деталями продукта
document.getElementById('close-overlay').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
});

// Добавить в корзину
document.getElementById('add-to-cart').addEventListener('click', () => {
    const productId = document.getElementById('add-to-cart').getAttribute('data-product');
    const quantity = parseInt(document.getElementById('quantity-input').value);

    // Обновляем количество товара в корзине
    if (quantity > 0) {
        cart[productId] = quantity;
        alert(`${productDetails[productId].name} добавлен(о) в корзину!`);
    } else {
        alert('Количество товара должно быть больше 0!');
    }

    // Закрыть оверлей после добавления в корзину
    document.getElementById('overlay').style.display = 'none';
});

// Управление количеством товара (увеличение и уменьшение)
document.getElementById('increase-quantity').addEventListener('click', () => {
    const quantityInput = document.getElementById('quantity-input');
    quantityInput.value = parseInt(quantityInput.value) + 1;
});

document.getElementById('decrease-quantity').addEventListener('click', () => {
    const quantityInput = document.getElementById('quantity-input');
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
});

// Открытие корзины
document.getElementById('view-cart').addEventListener('click', () => {
    let orderDetails = '';
    let total = 0;

    Object.keys(cart).forEach(itemId => {
        const details = productDetails[itemId];
        const quantity = cart[itemId];
        orderDetails += `${details.name} - ${quantity} шт. - ${details.price * quantity}₽\n`;
        total += details.price * quantity;
    });

    const cartItemsBody = document.getElementById('cart-items-body');
    cartItemsBody.innerHTML = '';

    Object.keys(cart).forEach(itemId => {
        const details = productDetails[itemId];
        const quantity = cart[itemId];
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${details.name}</td>
        <td>${quantity} шт.</td>
        <td>${details.price * quantity}₽</td>
    `;
        cartItemsBody.appendChild(row);
    });
    document.getElementById('cart-total').innerText = `Итого: ${total}₽`;

    // Показываем оверлей с корзиной
    document.getElementById('cart-overlay').style.display = 'block';
});

// Закрытие корзины
document.getElementById('close-cart-overlay').addEventListener('click', () => {
    document.getElementById('cart-overlay').style.display = 'none';
});

// Оформление заказа
document.getElementById('checkout').addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
        alert('Ваша корзина пуста');
    } else {
        alert('Заказ оформлен!');
        cart = {}; // Очищаем корзину после оформления заказа
        document.getElementById('cart-overlay').style.display = 'none'; // Закрываем оверлей с корзиной
    }
});

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

// Обработчики кнопок + и -
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

// Изменим функцию открытия корзины
document.getElementById('view-cart').addEventListener('click', () => {
    updateCartDisplay();
    document.getElementById('cart-overlay').style.display = 'block';
});
