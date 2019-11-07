const HOST = 'http://localhost:8080';
const $specificationTable = $('#specifications');
const $subcategorySelects = $('.subcategory_select');
const $subcategorySelectCreate = $('#create_form_subcategory_select');
const $subcategorySelectFilter = $('#subcategory_filter_select');
const $subcategoryList = $('#subcategories_names');
const $createButton = $('#submit-btn');
const $nameInput = $('#icon_name_create');
const $openCreateForm = $('#open_create_form');
const $update = $('#update');
const $modalName = $('#modal_header');
const $modalFooter = $('#footer');
const $nameSearch = $('#name_search');
const $pagination = $('.pagination');
let sortedField = 'name';
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
        $specificationTable.html('');
        appendSpecifications(res.data);
        clickOnUpdateButton();
        clickOnDeleteButton();
        clickOnSort();
        clickOnListButton();
        appendPages(res.totalPages, +page + 1);
        pages = res.totalPages;
    },
    ...error
};

//creating table
const appendSpecification = (specification) => {
    $specificationTable.append(`
    <tr>
        <td>${specification.id}</td>    
        <td>${specification.name}</td>
        <td><a class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${specification.subcategoriesIds}" data-target="modal_list" class="list-btn list-btn modal-trigger material-icons">menu</i></a></td>
        <td>
            <a class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${specification.id}" data-target="modal1" class="update-btn modal-trigger material-icons">edit</i></a>
            <a  class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${specification.id}" data-target="modal_delete" class="delete-btn modal-trigger material-icons">delete_forever</i></a>
        </td>                  
</tr>`);
};

const appendSpecifications = (specifications) => {
    for (const specification of specifications) {
        appendSpecification(specification);
    }
};

const getAllSpecification = () => {
    $.ajax({
        url: `${HOST}/specification/pages?page=${page}&size=${pageSize}`,
        ...get,
    })
};
//--------------------------------------------------------------------------------------------------
// form subcategories list for table

const clickOnListButton = () => {
    $('.list-btn').click( e => {
        $subcategoryList.html('');
        $.ajax({
            url: `${HOST}/subcategory/byIds/` + e.target.getAttribute('data-id'),
            type: 'GET',
            success: res => {
                $subcategoryList.append(`<li class="collection-header"><h5>Subcategories List:</h5></li>`);
                for (let subcategory of res) {
                    $subcategoryList.append(`<li class="collection-item">${subcategory.name}</li>`);
                }
            }
        })
    })
};
//--------------------------------------------------------------------------------------------------
// form select subcategories
const getSubcategories = () => {
    $.ajax({
        url: `${HOST}/subcategory`,
        type: 'GET',
        success: res => {
            $subcategorySelectFilter.formSelect().html(`<option disabled selected>Choose subcategory</option>`);
            $subcategorySelectCreate.formSelect().html(`<option disabled >Choose subcategory</option>`);
            for (const subcategory of res) {
                $subcategorySelects.append(`<option value="${subcategory.id}">${subcategory.name}</option>`);
            }
            $subcategorySelects.formSelect();
        },
        ...error
    });
};
//---------------------------------------------------------------------------------------------------
//sorting specifications
const getSortedBy = field => {
    $.ajax({
        url: `${HOST}/specification/pages?page=${page}&size=${pageSize}&direction=${asc ? 'ASC' : 'DESC'}&fieldName=${field}`,
        ...get,
    });
};

const clickOnSort = _ => {
    $('.sort').off().on('click', e => {
        sortedField = e.target.getAttribute('data-id');
        choice = sortedField;
        console.log(choice);
        asc = !asc;
        getSortedBy(sortedField);
    });
};
//-----------------------------------------------------------------------------------------------------
//creating specification
$createButton.click( e => {
    $.ajax({
        url: `${HOST}/specification`,
        type: 'POST',
        data: JSON.stringify({
            name: $nameInput.val(),
            subcategoriesIds: $subcategorySelectCreate.val()
        }),
        contentType: 'application/json',
        success: res => {
            $nameInput.val('');
            $subcategorySelectCreate.val('<option disabled selected>Choose category</option>');
            getAllSpecification();
        },
        ...error
    });
});

$openCreateForm.click( e => {
    $modalName.text('Create Specification:');
    $nameInput.val('');
    getSubcategories();
    $modalFooter.hide();
    $createButton.show();
});
//----------------------------------------------------------------------------------------------
//updating specifications
const clickOnUpdateButton = () => {
    $('.update-btn').click( e => {
        let id = e.target.getAttribute('data-id');
        $modalName.text('Specification id: ' + id);
        initUpdateForm(id);
    })
};

const initUpdateForm = (id) => {
    $.ajax({
        url: `${HOST}/specification/one/` + id,
        type: 'GET',
        success: res => {
            $nameInput.val(res.name).focus();
            $subcategorySelectCreate.val(res.subcategoriesIds).formSelect();
            $createButton.hide();
            $modalFooter.show();
            $update.attr('data-id', id);
        }
    })
};

$update.click( e => {
    $.ajax({
        url: `${HOST}/specification?id=` + $update.attr('data-id'),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({name: $nameInput.val(),
            subcategoriesIds: $subcategorySelectCreate.val()}),
        success: res => {
            getAllSpecification();
        },
        ...error
    });
});
//------------------------------------------------------------------------------------------------------------------
//delete specification
const deleteRequest = id => {
    $.ajax({
        url: `${HOST}/specification?id=` + id,
        type: 'DELETE',
        success: res => {
            getAllSpecification();
        },
        ...error
    });
};

const clickOnDeleteButton = _ => {
    $('.delete-btn').on('click', e => {
        let id = e.target.getAttribute('data-id');
        $('#delete-text').text('Do you want to delete specification with id: ' + id + ' ?');
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
        url: `${HOST}/specification/byName?value=${filterName}&page=${page}&size=${pageSize}`,
        ...get
    });
};

const findBySubcategory = () => {
    $specificationTable.html('');
    $.ajax({
        url: `${HOST}/specification/bySubcategory/${$subcategorySelectFilter.val()}`,
        // ...get
        type: 'GET',
        success: res => {
            $pagination.html('');
            appendSpecifications(res);
            clickOnUpdateButton();
            clickOnDeleteButton();
            clickOnSort();
            clickOnListButton();
        },
        ...error
    });
};

const onSubcategorySelect = () => {
    findBySubcategory();
};

$nameSearch.keyup( e => {
    choice = 'filter';
    getSubcategories();
    $specificationTable.html('');
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
                getAllSpecification();
                break;
            case 'filter':
                findByName();
                break;
            case sortedField:
                getSortedBy(sortedField);
                break;
        }
    }
});


getAllSpecification();
getSubcategories();
$subcategorySelectFilter.change(onSubcategorySelect);