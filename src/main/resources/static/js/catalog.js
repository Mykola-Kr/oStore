
const $nameSearch = $('#name_search');
const $labelFilterSelect = $('#product_label_filter_select');
const $minPriceFilter = $('#icon_min_price_filter');
const $maxPriceFilter = $('#icon_max_price_filter');
const $productCatalog = $('#products-catalog');
const $pagination = $('.pagination');
let sortedField = 'name';
let asc = true;
let pageSize = 6;
let page = 0;
let pages = 0;

const get = {
    type: 'GET',
    success: res => {
        $pagination.html('');
        $productCatalog.html('');
        appendProductsToCatalog(res.data);
        appendPages(res.totalPages, +page + 1);
        addProductToCart();
        pages = res.totalPages;
    },
    ...error
};


// form product label selects----------------------------------------------------------------------
const getProductLabel = () => {
    $.ajax({
        url: `${HOST}/productLabel`,
        type: 'GET',
        success: res => {
            $labelFilterSelect.formSelect().html(`<option disabled selected>Choose label</option>`);
            for (const label of res) {
                $labelFilterSelect.append(`<option value="${label.id}">${label.name}</option>`);
            }
            $labelFilterSelect.formSelect();
        },
        ...error
    });
};

// add product to catalog----------------------------------------------------------------------
const appendProductToCard =(product) => {
    $productCatalog.append(`<div class="col s12 m6 l4">
            <div class="card sticky-action medium">
                <div class="card-image waves-effect waves-block waves-light">
                    <img id="product_img${product.id}" class="activator" src="${HOST}/images/${product.img}">
                </div>
                <div class="card-content">
                    <span id="product-name" class="card-title activator grey-text text-darken-4">${product.name}
                    <i class="material-icons right">more_vert</i></span>
                    <p id="price" class="indigo-text">₴ ${product.price}</p>
                </div>
                <div class="card-action">
                    <a href="#" data-id="${product.id}" class="buy">Buy</a>
                    <a class="view-details" href="/item?id=${product.id}">Details</a>
                </div>
                <div id="product-description" class="card-reveal">
                    <span class="card-title grey-text text-darken-4">Description:<i class="material-icons right">close</i></span>
                    <p>${product.description}</p>
                </div>
            </div>
        </div>`);
    if (product.img === null) {
        $(`#product_img${product.id}`).attr('src', 'files/no_foto.png');
    };
};

const appendProductsToCatalog = (products) => {
    for (const product of products) {
        appendProductToCard(product);
    }
};

const getAllProducts = () => {
    let address = `${HOST}/product/byCriteria?&name=${$nameSearch.val()}&maxPrice=${$maxPriceFilter.val()}
        &minPrice=${$minPriceFilter.val()}&page=${page}&size=${pageSize}&direction=${asc ? 'ASC' : 'DESC'}&fieldName=${sortedField}`;

    if (searchParams.get('subcategoryId') != null && $labelFilterSelect.val() != null) {
        $.ajax({
            url: `${address}&subcategoryId=${searchParams.get('subcategoryId')}&productLabelId=${$labelFilterSelect.val()}`,
            ...get,
        });
    } else if (searchParams.get('subcategoryId') != null && $labelFilterSelect.val() === null) {
        $.ajax({
            url: `${address}&subcategoryId=${searchParams.get('subcategoryId')}`,
            ...get,
        });
    } else if (searchParams.get('categoryId') != null && searchParams.get('subcategoryId') === null && $labelFilterSelect.val() != null ) {
        $.ajax({
            url: `${address}&categoryId=${searchParams.get('categoryId')}&productLabelId=${$labelFilterSelect.val()}`,
            ...get,
        });
    } else if (searchParams.get('categoryId') != null && searchParams.get('subcategoryId') === null && $labelFilterSelect.val() === null) {
        $.ajax({
            url: `${address}&categoryId=${searchParams.get('categoryId')}`,
            ...get,
        });
    } else if (searchParams.get('categoryId') && searchParams.get('subcategoryId') === null && $labelFilterSelect.val() != null) {
        $.ajax({
            url: `${address}&productLabelId=${$labelFilterSelect.val()}`,
            ...get,
        });
    } else {
        $.ajax({
            url: `${address}`,
            ...get,
        });
    }
};
// pagination---------------------------------------------------------------------------------------------
const appendPages =(number, selectedPage) => {
    $pagination.append(`<li class="waves-effect"><a data-id="${selectedPage} href="#!"><i data-id="${selectedPage-2}" class="material-icons">chevron_left</i></a></li>`);
    for (i = 1; i<= number; i++) {
        if (i == selectedPage) {
            $pagination.append(`<li class="active"><a data-id="${i-1}" class="page" href="#!">${i}</a></li>`)
        } else {
            $pagination.append(`<li class="waves-effect"><a data-id="${i-1}" class="page" href="#!">${i}</a></li>`)
        }
    }
    $pagination.append(`<li class="waves-effect" ><a data-id="${selectedPage} href="#!"><i data-id="${selectedPage}" class="material-icons">chevron_right</i></a></li>`)
};
$pagination.on('click',e => {
    page = e.target.getAttribute('data-id');
    if (page >= 0 && page < pages ) {
        getAllProducts();
    }
});
//select page size--------------------------------------------------------------------------------------------
const selectPageSize = () => {
    $('#myForm input[type=radio]').change(function() {
        page = 0;
        pageSize = this.value;
        getAllProducts();
    });
};

// filter-----------------------------------------------------------------------------------------------------
const onCategoryFilterSelect = () => {
    $.ajax({
        url: `${HOST}/subcategory/byCategoryId/${$categorySelectFilter.val()}?page=0&size=1000`,
        type: 'GET',
        success: res => {
            $subcategoryFilterSelect.formSelect().html(`<option disabled selected>Choose subcategory</option>`);
            for (const subcategory of res.data) {
                $subcategoryFilterSelect.append(`<option value="${subcategory.id}">${subcategory.name}</option>`);
            }
            $subcategoryFilterSelect.formSelect();
        },
        ...error
    })
};

$nameSearch.keyup( e => {
    page = 0;
    getAllProducts();
});
$minPriceFilter.keyup( e => {
    page = 0;
    getAllProducts();
});
$maxPriceFilter.keyup( e => {
    page = 0;
    getAllProducts();
});
$labelFilterSelect.change(() => {
    page = 0;
    getAllProducts();
});

const addProductToCart = () => {
    $('.buy').click((e) => {
        const cart = JSON.parse(window.localStorage.getItem('cart')) || [];
        const item = cart.filter(t => e.target.getAttribute('data-id') == t.productId);
        if (item.length > 0) {
            item[0].count++;
        } else {
            cart.push({
                productId: e.target.getAttribute('data-id'),
                count: 1
            });
        }
        window.localStorage.setItem('cart', JSON.stringify(cart));
        $('#cart-badge').text(cart.length);
    })
};


getAllProducts();
getCategories();
getSubcategory();
getProductLabel();
selectPageSize();