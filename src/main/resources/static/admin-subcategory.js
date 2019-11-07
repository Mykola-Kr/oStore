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
const $pagination = $('.pagination');
let sortedFild = 'name';
let filterName = '';
let choice = 'all';
let asc = true;
let pageSize = 10;
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
        $subcategoryTable.html('');
        appendSubcategories(res.data);
        clickOnUpdateButton();
        clickOnDeleteButton();
        clickOnSort();
        appendPages(res.totalPages, +page + 1);
        pages = res.totalPages;
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
        url: `${HOST}/subcategory/pages?page=${page}&size=${pageSize}`,
        ...get,
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
        url: `${HOST}/subcategory/pages?page=${page}&size=${pageSize}&direction=${asc ? 'ASC' : 'DESC'}&fieldName=${field}`,
        ...get,
    });
};

const clickOnSort = _ => {
    $('.sort').off().on('click', e => {
        sortedFild = e.target.getAttribute('data-id');
        choice = sortedFild;
        console.log(choice);
        asc = !asc;
        getSortedBy(sortedFild);
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
const findByName = () => {
    $.ajax({
        url: `${HOST}/subcategory/byName?value=${filterName}&page=${page}&size=${pageSize}`,
        ...get
    });
};

const findByCategory = () => {
    $.ajax({
        url: `${HOST}/subcategory/byCategoryId/${$categorySelectFilter.val()}?page=${page}&size=${pageSize}`,
        ...get
    });
};

const onCategorySelect = () => {
    choice = 'category';
    findByCategory();
};

$nameSearch.keyup( e => {
    choice = 'filter';
    $subcategoryTable.html('');
    filterName = e.target.value;
    findByName();
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
    console.log('hi');
    if (page >= 0 && page < pages ) {
        switch (choice) {
            case 'all':
                getAllSubcategories();
                console.log('all');
                break;
            case 'filter':
                findByName();
                break;
            case 'category':
                findByCategory();
                break;
            case sortedFild:
                getSortedBy(sortedFild);
                console.log(sortedFild);
                break;
        }
    }
});


getAllSubcategories();
getCategories();
$categorySelectFilter.change(onCategorySelect);
