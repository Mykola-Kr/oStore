const HOST = 'http://localhost:8080';
const $subcategoryTable = $('#subcategories');
const $categorySelects = $('.category_select');
const $categorySelectCreate = $('#create_form_category_select');
const $categorySelectFilter = $('#category_filter_select')
const $createButton = $('#submit-btn');
const $nameInput = $('#icon_name_create');
const $openCreateForm = $('#open_create_form');
const $update = $('#update');
const $modalName = $('#modal_header');
const $modalFooter = $('#footer');
const $nameSearch = $('#name_search');
var $asc = true;
var $page = 0;

const error = {
    error: err => {
        console.log(err);
        alert('Something went wrong!')
    }
};

const get = {
    type: 'GET',
    success: res => {
        $subcategoryTable.html('');
        appendSubcategories(res.data);
        clickOnUpdateButton();
        clickOnDeleteButton();
        clickOnSort();
    },
    ...error
};

//creating table
const appendSubcategory = (subcategory) => {
    $subcategoryTable.append(`
    <tr>
        <td>${subcategory.id}</td>    
        <td>${subcategory.name}</td>
        <td>${subcategory.categoryId}</td>
        <td>
            <a class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${subcategory.id}" data-target="modal1" class="update-btn modal-trigger material-icons">edit</i></a>
            <a  class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${subcategory.id}" data-target="modal_delete" class="delete-btn modal-trigger material-icons">delete_forever</i></a>
        </td>                  
</tr>`);
};

const appendSubcategories = (subcategories) => {
    for (const subcategory of subcategories) {
        appendSubcategory(subcategory);
    }
};

const getAllSubcategories = () => {
    $.ajax({
        url: `${HOST}/subcategory/pages?page=${$page}&size=2`,
        ...get
    })
};
//--------------------------------------------------------------------------------------------------
// form select categories
const getCategories = () => {
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
//sorting subcategories
const getSortedBy = field => {
    $.ajax({
        url: `${HOST}/subcategory/pages?page=0&size=10&direction=${$asc ? 'ASC' : 'DESC'}&fieldName=${field}`,
        ...get
    });
};

const clickOnSort = _ => {
    $('.sort').off().on('click', e => {
        let field = e.target.getAttribute('data-id');
        getSortedBy(field);
        $asc = !$asc;
    });
};
//-----------------------------------------------------------------------------------------------------
//creating subcategory
$createButton.click( e => {
    $.ajax({
        url: `${HOST}/subcategory`,
        type: 'POST',
        data: JSON.stringify({
            name: $nameInput.val(),
            categoryId: $categorySelectCreate.val()
        }),
        contentType: 'application/json',
        success: res => {
            $nameInput.val('');
            $categorySelectCreate.val('<option disabled selected>Choose category</option>');
            getAllSubcategories();
        },
        ...error
    });
});

$openCreateForm.click( e => {
    $modalName.text('Create Subcategory:');
    $nameInput.val('');
    getCategories();
    $modalFooter.hide();
    $createButton.show();
});
//----------------------------------------------------------------------------------------------
//updating subcategory
const clickOnUpdateButton = () => {
    $('.update-btn').click( e => {
        let id = e.target.getAttribute('data-id');
        $modalName.text('Subcategory id: ' + id);
        initUpdateForm(id);
    })
};

const initUpdateForm = (id) => {
    $.ajax({
        url: `${HOST}/subcategory/one/` + id,
        type: 'GET',
        success: res => {
            $nameInput.val(res.name).focus();
            $categorySelectCreate.val(res.categoryId).formSelect();
            $createButton.hide();
            $modalFooter.show();
            $update.attr('data-id', id);
        }
    })
};

$update.click( e => {
    $.ajax({
        url: `${HOST}/subcategory?id=` + $update.attr('data-id'),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({name: $nameInput.val(),
            categoryId: $categorySelectCreate.val()}),
        success: res => {
            getAllSubcategories();
        },
        ...error
    });
});
//------------------------------------------------------------------------------------------------------------------
//delete subcategories
const deleteRequest = id => {
    $.ajax({
        url: `${HOST}/subcategory?id=` + id,
        type: 'DELETE',
        success: res => {
            getAllSubcategories();
        },
        ...error
    });
};

const clickOnDeleteButton = _ => {
    $('.delete-btn').on('click', e => {
        let id = e.target.getAttribute('data-id');
        $('#delete-text').text('Do you want to delete subcategory with id: ' + id + ' ?');
        confirmDelete(id);
    });
};

const confirmDelete = (id) => {
    $('#delete').off().on('click', e => {
        deleteRequest(id);
    });
};
//---------------------------------------------------------------------------------------------
//filter-----------
const onCategorySelect = () => {
    $.ajax({
        url: `${HOST}/subcategory/byCategoryId/${$categorySelectFilter.val()}?page=0&size=10`,
        ...get
    })
};

$nameSearch.keyup( e => {
    $subcategoryTable.html('');
    $.ajax({
        url: `${HOST}/subcategory/byName?value=${e.target.value}&page=0&size=10`,
        ...get
    })
});
//---------------------------------------------------------------------------------------------------

getAllSubcategories();
getCategories();
$categorySelectFilter.change(onCategorySelect);
$(function() {
    $('#pagination-long').materializePagination({
        align: 'center',
        lastPage: 10,
        firstPage: 1,
        useUrlParameter: false,
        onClickCallback: function(requestedPage) {
            console.log('Requested page from #pagination-long: ' + requestedPage);
            $page = requestedPage-1;
            getAllSubcategories();
        }
    });
});