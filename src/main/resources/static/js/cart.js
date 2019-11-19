const $productsToCart = $('.product-to-order');

const addActionToCountDown = () => {
    $('.count-down').click((e) => {
        const $count = $(e.target).siblings('.product-count').first();
        const id = $count.attr('data-id');
        let cart = JSON.parse(window.localStorage.getItem('cart'));
        let count = $count.html();
        console.log(count);
        if (count > 1) {
            count--;
            $count.html(count);
            $.ajax({
                url: `${HOST}/product/one/${id}`,
                type: 'GET',
                success: res => {
                    $(`#product-price${id}`).html('₴' + res.price*count);
                },
                error: err => {
                    console.log(err);
                }
            });
            const el = cart.filter(t => t.productId == id).shift();
            el.count = count;
        } else {
            cart = cart.filter(t => t.productId != id);
            $count.closest('.item-in-cart').fadeOut();
        }
        window.localStorage.setItem('cart', JSON.stringify(cart));
    });
};

const addActionToCountUp = () => {
    $('.count-up').click((e) => {
        const $count = $(e.target).siblings('.product-count').first();
        const id = $count.attr('data-id');
        let cart = JSON.parse(window.localStorage.getItem('cart'));
        let count = $count.html();
        count++;
        $count.html(count);
        $.ajax({
            url: `${HOST}/product/one/${id}`,
            type: 'GET',
            success: res => {
                $(`#product-price${id}`).html('₴' + res.price*count);
            },
            error: err => {
                console.log(err);
            }
        });
        const el = cart.filter(t => t.productId == id).shift();
        el.count = count;
        window.localStorage.setItem('cart', JSON.stringify(cart));
    });
};

const appendItem = (product) => {
    $productsToCart.append(`<tr class="item-in-cart"><td><img id="img${product.id}" src="${HOST}/images/${product.img}" width="100px" alt=""></td>
                                        <td><a href="/item?id=${product.id}">${product.name}</a></td>
                                        <td id="product-price${product.id}" class="product-price">₴ ${product.price*product.count}</td>
                                        <td><button class="count-down"> - </button><span data-id="${product.id}" class="product-count">${product.count}</span>
                                        <button class="count-up">+</button></td></tr>`)
    if (product.img === null) {
        $(`#img${product.id}`).attr('src', 'files/no_foto.png');
    }
};

const appendItems = (items) => {
    for (let i = 0; i < items.length; i++) {
        $.ajax({
            url: `${HOST}/product/one/${items[i].productId}`,
            type: 'GET',
            success: res => {
                appendItem({
                    ...res,
                    count: items[i].count
                });
                items[i].productPrice = res.price;
                if (items.length == (i +1)) {
                    addActionToCountDown();
                    addActionToCountUp();
                }
            },
            error: err => {
                console.log(err);
            }
        });
    }
};
appendItems(JSON.parse(window.localStorage.getItem('cart')));
getCategories();
getSubcategory();