const $productTable = $('#products');
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
    getCategories();
    getSubcategoryForSelect();
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
const getSubcategoryForSelect = () => {
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
            $('#specification_selects').html('');
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

const formSpecificationUpdateSelects = (id, array) => {
    $.ajax({
        url: `${HOST}/specification/bySubcategory/${id}`,
        type: 'GET',
        success: res => {
            $('#specification_note').hide();
            // $('#specification_selects').html('');
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
                            for (const x of array) {
                                if (x===specificationValue.id) {
                                    $(`#create_form_specification_select${specification.id}`).append(
                                        `<option class="specification" selected value="${specificationValue.id}">${specificationValue.value}</option>`
                                    );
                                }
                            }
                            $(`#create_form_specification_select${specification.id}`).append(
                                `<option class="specification" value="${specificationValue.id}">${specificationValue.value}</option>`
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
            $createButton.hide();
            $modalFooter.show();
            $update.attr('data-id', id);
            $('#specification_selects').html('');
            formSpecificationUpdateSelects(res.subcategoryId, res.specificationsValuesIds);
        }
    })
};

$update.click( e => {
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
    };
    appGetBase64($imgInput[0].files[0]).then(photo => data.img = photo)
        .catch()
        .finally(_ => {
            $.ajax({
                url: `${HOST}/product?id=` + $update.attr('data-id'),
                type: 'PUT',
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
//---------------------------------------------------------------------------------------------------

// pagination-------------------------------------

$pagination.on('click',e => {
    page = e.target.getAttribute('data-id');
    if (page >= 0 && page < pages ) {
        getAllProducts();
    }
});
//-----------------------------------------------------------------------------------------------


getAllProducts();
getCategories();
getSubcategoryForSelect();
getProductLabel();
$categorySelectCreate.change(onCategoryCreateSelect);
$categorySelectFilter.change(onCategoryFilterSelect);
$subcategorySelectCreate.change(onSubcategoryCreateSelect);




