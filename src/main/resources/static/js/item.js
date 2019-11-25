let pageSize = 1;
let page = 0;

const getProductInfo = () => {
    $.ajax({
        url: `${HOST}/product/oneFullInfo/${searchParams.get('id')}`,
        type: 'GET',
        success: res => {
            console.log(res);
            if (res.img === null) {
                $('#product-img').append(`<img class="col s12 l8" src='files/no_foto.png' alt="">`)
            } else {
                $('#product-img').append(`<img class="responsive-img materialboxed col s12 l8" src='${HOST}/images/${res.img}' alt="">`);
            }
            $('#title').text(`${res.name}`);
            $('#price').text(`Price: ₴ ${res.price}`);
            if (res.rating === null) {
                $('#rating').text(`Rating: no marks yet`);
            } else {
                $('#rating').text(`Rating: ${res.rating}`);
            }
            $('.buy').attr('data-id', `${res.id}`);
            $('.buy').attr('id', `${res.price}`);
            $('#description').append(`<p>${res.description}</p>`);
            for (const specification of res.specificationValueResponds) {
                $('.specification-collection').append(`<li class="collection-item">
                                    <span class="secondary-content indigo-text text-darken-4">${specification.value}</span>
                                    ${specification.specificationName}</li>`)
            }
            $('.materialboxed').materialbox();
        },
        ...error
    });
};

const appendComments = () => {
    $.ajax({
        url: `${HOST}/comment/byProductAndIsAllowed?id=${searchParams.get('id')}&isAllowed=true&page=${page}&size=${pageSize}&fieldName=dateTime&direction=ASC`,
        type: 'GET',
        success: res => {
            if (res.data.length < 1) {
                $('.comments-collection').append(`<li class="collection-item indigo-text text-darken-4">No comment yet</li>`);
                $('.show-more').hide();
            } else {
                for (const comment of res.data) {
                    $('.comments-collection').append(`<li class="collection-item indigo-text text-darken-4">
                    <span class="secondary-content indigo-text text-darken-4">${comment.dateTime}</span>${comment.userName}</li>
                    <li class="collection-item"> Mark: ${comment.mark}<p>${comment.description}</p></li>`);
                }
            }
        },
        ...error
    });
};

const showNextCommentsPage = () => {
    $('.show-more').on('click', () => {
        page++;
        appendComments();
    });
};

addProductToCart();
getProductInfo();
getCategories();
getSubcategory();
appendComments();
showNextCommentsPage();
