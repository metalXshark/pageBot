let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product');
        if (!cart.includes(productId)) {
            cart.push(productId);
            alert('Товар добавлен в корзину');
        }
    });
});

function viewCart() {
    if (cart.length === 0) {
        alert('Ваша корзина пуста');
    } else {
        let orderDetails = 'Ваш заказ:\n';
        cart.forEach(item => {
            switch(item) {
                case '1':
                    orderDetails += 'Лимонад с клубникой\n';
                    break;
                case '2':
                    orderDetails += 'Лимонад с лимоном\n';
                    break;
                case '3':
                    orderDetails += 'Лимонад с мятой\n';
                    break;
            }
        });
        orderDetails += '\nОформить заказ?';
        if (confirm(orderDetails)) {
            alert('Заказ оформлен!');
            cart = []; // Очистка корзины после оформления заказа
        }
    }
}
