const HOST = 'http://localhost:8080';
const $specificationValueTable = $('#specification_value');
const $specificationSelects = $('.specification_select');
const $specificationSelectCreate = $('#create_form_specification_select');
const $specificationSelectFilter = $('#specification_filter_select')
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
let choiceForPagination = 'all';
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
        $specificationValueTable.html('');
        appendSpecificationValues(res.data);
        clickOnUpdateButton();
        clickOnDeleteButton();
        clickOnSort();
        appendPages(res.totalPages, +page + 1);
        pages = res.totalPages;
    },
    ...error
};

//creating table
const appendSpecificationValue = (value) => {
    $specificationValueTable.append(`
    <tr>
        <td>${value.id}</td>    
        <td>${value.value}</td>
        <td>${value.specificationId}</td>
        <td>
            <a class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${value.id}" data-target="modal1" class="update-btn modal-trigger material-icons">edit</i></a>
            <a  class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${value.id}" data-target="modal_delete" class="delete-btn modal-trigger material-icons">delete_forever</i></a>
        </td>                  
</tr>`);
};

const appendSpecificationValues = (values) => {
    for (const value of values) {
        appendSpecificationValue(value);
    }
};

const getAllSpecificationValues = () => {
    $.ajax({
        url: `${HOST}/specificationValue/pages?page=${page}&size=${pageSize}`,
        ...get,
    })
};
//--------------------------------------------------------------------------------------------------
// form select specification
const getSpecification = () => {
    $.ajax({
        url: `${HOST}/specification`,
        type: 'GET',
        success: res => {
            $specificationSelects.formSelect().html(`<option disabled selected>Choose specification</option>`);
            for (const specification of res) {
                $specificationSelects.append(`<option value="${specification.id}">${specification.name}</option>`);
            }
            $specificationSelects.formSelect();
        },
        ...error
    });
};
//---------------------------------------------------------------------------------------------------
//sorting specification values
const getSortedBy = field => {
    $.ajax({
        url: `${HOST}/specificationValue/pages?page=${page}&size=${pageSize}&direction=${asc ? 'ASC' : 'DESC'}&fieldName=${field}`,
        ...get,
    });
};

const clickOnSort = _ => {
    $('.sort').off().on('click', e => {
        sortedField = e.target.getAttribute('data-id');
        choiceForPagination = sortedField;
        console.log(choiceForPagination);
        asc = !asc;
        getSortedBy(sortedField);
    });
};
//-----------------------------------------------------------------------------------------------------
//creating specification value
$createButton.click( e => {
    $.ajax({
        url: `${HOST}/specificationValue`,
        type: 'POST',
        data: JSON.stringify({
            value: $nameInput.val(),
            specificationId: $specificationSelectCreate.val()
        }),
        contentType: 'application/json',
        success: res => {
            $nameInput.val('');
            $specificationSelectCreate.val('<option disabled selected>Choose specification</option>');
            getAllSpecificationValues();
        },
        ...error
    });
});

$openCreateForm.click( e => {
    $modalName.text('Create Specification Value:');
    $nameInput.val('');
    getSpecification();
    $modalFooter.hide();
    $createButton.show();
});
//----------------------------------------------------------------------------------------------
//updating specification Value
const clickOnUpdateButton = () => {
    $('.update-btn').click( e => {
        let id = e.target.getAttribute('data-id');
        $modalName.text('Specification Value id: ' + id);
        initUpdateForm(id);
    })
};

const initUpdateForm = (id) => {
    $.ajax({
        url: `${HOST}/specificationValue/one/` + id,
        type: 'GET',
        success: res => {
            $nameInput.val(res.value).focus();
            $specificationSelectCreate.val(res.specificationId).formSelect();
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
//delete specificationValue
const deleteRequest = id => {
    $.ajax({
        url: `${HOST}/specificationValue?id=` + id,
        type: 'DELETE',
        success: res => {
            getAllSpecificationValues();
        },
        ...error
    });
};

const clickOnDeleteButton = _ => {
    $('.delete-btn').on('click', e => {
        let id = e.target.getAttribute('data-id');
        $('#delete-text').text('Do you want to delete Specification Value with id: ' + id + ' ?');
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
        url: `${HOST}/specificationValue/byName?value=${filterName}&page=${page}&size=${pageSize}`,
        ...get
    });
};

const findBySpecification = () => {
    $.ajax({
        url: `${HOST}/specificationValue/bySpecificationId/${$specificationSelectFilter.val()}?page=${page}&size=${pageSize}`,
        ...get
    });
};

const onSpecificationSelect = () => {
    choiceForPagination = 'specification';
    findBySpecification();
};

$nameSearch.keyup( e => {
    choiceForPagination = 'filter';
    getSpecification();
    $specificationValueTable.html('');
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
        switch (choiceForPagination) {
            case 'all':
                getAllSpecificationValues();
                console.log('all');
                break;
            case 'filter':
                findByName();
                break;
            case 'specification':
                findBySpecification();
                break;
            case sortedField:
                getSortedBy(sortedField);
                console.log(sortedField);
                break;
        }
    }
});


getAllSpecificationValues();
getSpecification();
$specificationSelectFilter.change(onSpecificationSelect);