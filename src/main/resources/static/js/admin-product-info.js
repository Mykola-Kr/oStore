// form modal info for product
const onInfoName = () => {
    $('.full_info').click( e => {
        let id = e.target.getAttribute('data-id');
        initInfoForm(id);
    });
};

const initInfoForm = (id) => {
    $.ajax({
        url: `${HOST}/product/oneFullInfo/${id}`,
        type: 'GET',
        success: res => {
            console.log(res);
            $('#name_info').text(`NAME: ${res.name}`);
            $('#price_info').text(`PRICE: ${res.price}`);
            $('#quantity_info').text(`QUANTITY: ${res.quantity}`);
            if (res.img === null) {
                $('#img_info').attr('src', 'files/no_foto.png');
            } else {
                $('#img_info').attr('src', `${HOST}/images/${res.img}`);
            }
            if (res.rating === null) {
                $('#rating_info').text('RATING: No rating yet');
            } else {
                $('#rating_info').text(`RATING: ${res.rating}`);
            }
            $('#category_info').text(`CATEGORY: ${res.categoryName}`);
            $('#subcategory_info').text(`SUBCATEGORY: ${res.subcategoryRespond.name}`);
            $('#label_info').text(`PRODUCT LABEL: ${res.productLabelRespond.name}`);
            $('#description_info').html(`<p>${res.description}</p>`);
            if (res.specificationValueResponds === null) {
                $('#specification_info').html(`<h6>There is not any chosen specification</h6>`)
            } else {
                $('#specification_list').html(``);
                res.specificationValueResponds.forEach(value => $('#specification_list')
                    .append(`<li class="collection-item"><div>${value.specificationName}:<a class="secondary-content">${value.value}</a></div></li>`));
            }
        },
        ...error
    })
};