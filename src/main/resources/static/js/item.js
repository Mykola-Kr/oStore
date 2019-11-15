

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
            $('#price').text(`Price: ${res.price}`);
            $('#rating').text(`Rating: ${res.rating}`);
            $('#buy-btn').attr('data-id', `${res.id}`);
            $('#description').append(`<p>${res.description}</p>`);
            for (const specification of res.specificationValueResponds) {
                $('.specification-collection').append(`<li class="collection-item"><span class="secondary-content indigo-text text-darken-4">${specification.value}</span>${specification.specificationName}</li>`)
            }
            $('.materialboxed').materialbox();
        },
        error: err => {
            console.log(err);
            alert('Something went wrong!');
        }
    });
};

// $.ajax({
//     url: `${HOST}/comment/byProduct?id=${searchParams.get('id')}&page=0&size=10&fieldName=dateTime&direction=ASC`,
//     type: 'GET',
//     success: res => {
//         for (const comment of res.data) {
//             $('.comments-collection').append(`<li class="collection-item indigo-text text-darken-4">
//                     <span class="secondary-content indigo-text text-darken-4">${comment.dateTime}</span>${comment.user.name}</li>
//                     <li class="collection-item"> Mark: ${comment.mark}<p>${comment.description}</p></li>`);
//         }
//     },
//     error: err => {
//         console.log(err);
//     }
// });
getProductInfo();
getCategories();
getSubcategory();