const HOST = 'http://localhost:8080';
const $productTable = $('#products');
const $categorySelects = $('.category_select');
const $categorySelectCreate = $('#create_form_category_select');
const $categorySelectFilter = $('#category_filter_select');
const $subcategorySelects = $('.subcategory_select');
const $subcategorySelectCreate = $('#create_form_subcategory_select');
const $subcategoryFilterSelect = $('#subcategory_filter_select');
const $labelSelects = $('.product_label_select');
const $labelCreateSelect = $('#create_form_product_label_select');
const $labelFilterSelect = $('#product_label_filter_select');
const $minPriceFilter = $('#icon_min_price_filter');
const $maxPriceFilter = $('#icon_max_price_filter');
const $minQuantityFilter = $('#icon_min_quantity_filter');
const $maxQuantityFilter = $('#icon_max_quantity_filter');
const $createButton = $('#submit-btn');
const $nameInput = $('#icon_name_create');
const $priceInputCreate = $('#icon_price_create');
const $quantityInputCreate = $('#icon_quantity_create');
const $descriptionInputCreate = $('#icon_description_create');
const $imgInput = $('.create-form_img-input');
const $imgPath = $('.file-path');
const $openCreateForm = $('#open_create_form');
const $update = $('#update');
const $modalName = $('#modal_header');
const $modalFooter = $('#footer');
const $nameSearch = $('#name_search');
const $pagination = $('.pagination');
let sortedField = 'name';
let asc = true;
let pageSize = 2;
let page = 0;
let pages = 0;

const error = {
    error: err => {
        console.log(err);
        alert('Something went wrong!')
    }
};

const get = {
    type: 'GET',
    success: res => {
        $pagination.html('');
        $productTable.html('');
        appendProducts(res.data);
        clickOnUpdateButton();
        clickOnDeleteButton();
        onInfoName();
        appendPages(res.totalPages, +page + 1);
        pages = res.totalPages;
    },
    ...error
};

const clearFields = () => {
    $nameInput.val('');
    $priceInputCreate.val('');
    $quantityInputCreate.val('');
    $descriptionInputCreate.val('');
    $imgInput.val('');
    $imgPath.val('');
    $('#specification_selects').html('');
    $('#specification_note').show();
    getCategory();
    getSubcategory();
    getProductLabel();
    $modalFooter.hide();
    $createButton.show();
};

//creating table
const appendProduct = (product) => {
    $productTable.append(`
    <tr>
        <td>${product.id}</td>    
        <td><a href="#!" data-target="modal_details" class="full_info modal-trigger " data-id="${product.id}">${product.name}</a></td>
        <td>${product.price}</td>
        <td>${product.quantity}</td>
        <td><img id="product_img${product.id}" width="100" src="${HOST}/images/${product.img}"></td>
        <td>
            <a class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${product.id}" data-target="modal1" class="update-btn modal-trigger material-icons">edit</i></a>
            <a  class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${product.id}" data-target="modal_delete" class="delete-btn modal-trigger material-icons">delete_forever</i></a>
        </td>                  
</tr>`);
    if (product.img === null) {
        $(`#product_img${product.id}`).attr('src', 'files/no_foto.png');
    };
};

const appendProducts = (products) => {
    for (const product of products) {
        appendProduct(product);
    }
};

const getAllProducts = () => {
    let address = `${HOST}/product/byCriteria?&name=${$nameSearch.val()}&maxQuantity=${$maxQuantityFilter.val()}&maxPrice=${$maxPriceFilter.val()}
        &minPrice=${$minPriceFilter.val()}&minQuantity=${$minQuantityFilter.val()}
        &page=${page}&size=${pageSize}&direction=${asc ? 'ASC' : 'DESC'}&fieldName=${sortedField}`;

    if ($subcategoryFilterSelect.val() != null && $labelFilterSelect.val() != null) {
        $.ajax({
            url: `${address}&subcategoryId=${$subcategoryFilterSelect.val()}&productLabelId=${$labelFilterSelect.val()}`,
            ...get,
        });
    } else if ($subcategoryFilterSelect.val() != null && $labelFilterSelect.val() === null) {
        $.ajax({
            url: `${address}&subcategoryId=${$subcategoryFilterSelect.val()}`,
            ...get,
        });
    } else if ($categorySelectFilter.val() != null && $subcategoryFilterSelect.val() === null && $labelFilterSelect.val() != null ) {
        $.ajax({
            url: `${address}&categoryId=${$categorySelectFilter.val()}&productLabelId=${$labelFilterSelect.val()}`,
            ...get,
        });
    } else if ($categorySelectFilter.val() != null && $subcategoryFilterSelect.val() === null && $labelFilterSelect.val() === null) {
        $.ajax({
            url: `${address}&categoryId=${$categorySelectFilter.val()}`,
            ...get,
        });
    } else if ($categorySelectFilter.val() === null && $subcategoryFilterSelect.val() === null && $labelFilterSelect.val() != null) {
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

//--------------------------------------------------------------------------------------------------
// form select category
const getCategory = () => {
    $.ajax({
        url: `${HOST}/category`,
        type: 'GET',
        success: res => {
            $categorySelects.formSelect().html(`<option disabled selected>Choose category</option>`);
            for (const category of res) {
                $categorySelects.append(`<option value="${category.id}">${category.name}</option>`);
            }
            $categorySelects.formSelect();
        },
        ...error
    });
};
//---------------------------------------------------------------------------------------------------
// form product label selects
const getProductLabel = () => {
    $.ajax({
        url: `${HOST}/productLabel`,
        type: 'GET',
        success: res => {
            $labelSelects.formSelect().html(`<option disabled selected>Choose label</option>`);
            for (const label of res) {
                $labelSelects.append(`<option value="${label.id}">${label.name}</option>`);
            }
            $labelSelects.formSelect();
        },
        ...error
    });
};
//- form select subcategory
const getSubcategory = () => {
    $.ajax({
        url: `${HOST}/subcategory`,
        type: 'GET',
        success: res => {
            $subcategorySelects.formSelect().html(`<option disabled selected>Choose subcategory</option>`);
            for (const subcategory of res) {
                $subcategorySelects.append(`<option value="${subcategory.id}">${subcategory.name}</option>`);
            }
            $subcategorySelects.formSelect();
        }
    })
};
//-------------------------------------------------------------------------------------------------------
// on categorySelect : get subcategory by category id
const onCategoryCreateSelect = () => {
    $.ajax({
        url: `${HOST}/subcategory/byCategoryId/${$categorySelectCreate.val()}?page=0&size=1000`,
        type: 'GET',
        success: res => {
            $subcategorySelectCreate.formSelect().html(`<option disabled selected>Choose subcategory</option>`);
            for (const subcategory of res.data) {
                $subcategorySelectCreate.append(`<option value="${subcategory.id}">${subcategory.name}</option>`);
            }
            $subcategorySelectCreate.formSelect();
        },
        ...error
    })
};

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
//------------------------------------------------------------------------------------------------------
// on Subcategory Create Select form specification selects
const onSubcategoryCreateSelect = () => {
    $.ajax({
        url: `${HOST}/specification/bySubcategory/${$subcategorySelectCreate.val()}`,
        type: 'GET',
        success: res => {
            $('#specification_note').hide();
            for (const specification of res) {
                $('#specification_selects').append(`<div class="input-field col s12">
                <select multiple id="create_form_specification_select${specification.id}" class="specification_select">
                <option value="" disabled>Choose ${specification.name} specification</option>
                </select>
                </div>`);
                $('.specification_select').formSelect();
                $.ajax({
                    url: `${HOST}/specificationValue/bySpecificationId/${specification.id}?page=0&size=1000`,
                    type: 'GET',
                    success: res => {
                        for (const specificationValue of res.data) {
                            $(`#create_form_specification_select${specification.id}`).append(
                                `<option value="${specificationValue.id}">${specificationValue.value}</option>`
                            );
                            $(`#create_form_specification_select${specification.id}`).formSelect();
                        };
                    },
                    ...error
                })
            };
        },
        ...error
    })
};
//---------------------------------------------------------------------------------------------------------------------
//sorting products

$('.sort').off().on('click', e => {
    page = 0;
    sortedField = e.target.getAttribute('data-id');
    asc = !asc;
    getAllProducts();
});
//-----------------------------------------------------------------------------------------------------
//creating product
function appGetBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

$createButton.click( e => {
    let arraySpecificationValuesIds = new Array();
    $('.specification_select').each(function () {
        for(const id of $(this).val()) {
            arraySpecificationValuesIds.push(id);
        }
    });
    const data = {
        name: $nameInput.val(),
        price: $priceInputCreate.val(),
        quantity: $quantityInputCreate.val(),
        subcategoryId: $subcategorySelectCreate.val(),
        productLabelId: $labelCreateSelect.val(),
        description: $descriptionInputCreate.val(),
        specificationsValuesIds: arraySpecificationValuesIds
        // specificationId: $specificationSelectCreate.val()
    };
    appGetBase64($imgInput[0].files[0]).then(photo => data.img = photo)
        .catch()
        .finally(_ => {
            $.ajax({
                url: `${HOST}/product`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: res => {
                    clearFields();
                    getAllProducts();
                },
                ...error
            })
        });
});

$openCreateForm.click( e => {
    $modalName.text('Add Product:');
    clearFields();
});

//----------------------------------------------------------------------------------------------
//updating specification Value
const clickOnUpdateButton = () => {
    $('.update-btn').click( e => {
        let id = e.target.getAttribute('data-id');
        $modalName.text('Product id: ' + id);
        initUpdateForm(id);
    })
};

const initUpdateForm = (id) => {
    $.ajax({
        url: `${HOST}/product/one/` + id,
        type: 'GET',
        success: res => {
            $nameInput.val(res.name).focus();
            $subcategorySelectCreate.val(res.subcategoryId).formSelect();
            $labelCreateSelect.val(res.productLabelId).formSelect();
            $priceInputCreate.val(res.price).focus();
            $quantityInputCreate.val(res.quantity).focus();
            $descriptionInputCreate.val(res.description).focus();
            // $specificationSelectCreate.val(res.specificationId).formSelect();
            $createButton.hide();
            $modalFooter.show();
            $update.attr('data-id', id);
        }
    })
};

$update.click( e => {
    $.ajax({
        url: `${HOST}/specificationValue?id=` + $update.attr('data-id'),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({value: $nameInput.val(),
            specificationId: $specificationSelectCreate.val()}),
        success: res => {
            getAllSpecificationValues();
        },
        ...error
    });
});
//------------------------------------------------------------------------------------------------------------------
//delete product
const deleteRequest = id => {
    $.ajax({
        url: `${HOST}/product?id=` + id,
        type: 'DELETE',
        success: res => {
            getAllProducts();
        },
        ...error
    });
};

const clickOnDeleteButton = _ => {
    $('.delete-btn').on('click', e => {
        let id = e.target.getAttribute('data-id');
        $('#delete-text').text('Do you want to delete Product with id: ' + id + ' ?');
        confirmDelete(id);
    });
};

const confirmDelete = (id) => {
    $('#delete').off().on('click', e => {
        deleteRequest(id);
    });
};
//---------------------------------------------------------------------------------------------
//filter---------------------------------------------------------------------

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
$minQuantityFilter.keyup( e => {
    page = 0;
    getAllProducts();
});
$maxQuantityFilter.keyup( e => {
    page = 0;
    getAllProducts();
});
//---------------------------------------------------------------------------------------------------

// pagination-------------------------------------
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
//-----------------------------------------------------------------------------------------------
// form modal info for product
const onInfoName = () => {
    $('.full_info').click( e => {
        console.log('hi');
        let id = e.target.getAttribute('data-id');
        console.log(id);
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

getAllProducts();
getCategory();
getSubcategory();
getProductLabel();
$categorySelectCreate.change(onCategoryCreateSelect);
$categorySelectFilter.change(onCategoryFilterSelect);
$subcategorySelectCreate.change(onSubcategoryCreateSelect);

$labelFilterSelect.change(() => {
    page = 0;
    getAllProducts();
});
$categorySelectFilter.change(() => {
    page = 0;
    getAllProducts();
});
$subcategoryFilterSelect.change(() => {
    page = 0;
    getAllProducts();
});


