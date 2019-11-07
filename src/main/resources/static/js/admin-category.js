const HOST = 'http://localhost:8080';
const $categoryTable = $('#categories');
const $createButton = $('#submit-btn');
const $nameInput = $('#icon_name_create');
const $openCreateForm = $('#open_create_form');
const $update = $('#update');
const $modalName = $('#modal_header');
const $modalFooter = $('#footer');
var $asc = true;

// creating table
const appendCategory = (category) => {
    $categoryTable.append(`
        <tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>
                <a class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                    <i data-id="${category.id}" data-target="modal1" class="update-btn modal-trigger material-icons">edit</i></a>
                <a  class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                    <i data-id="${category.id}" data-target="modal2" class="delete-btn modal-trigger material-icons">delete_forever</i></a>
            </td>             
        </tr>
    `)
};

const error = {
    error: err => {
        console.log(err);
        alert('Something went wrong!')
    }
};

const get = {
    type: 'GET',
    success: res => {
        $categoryTable.html('');
        appendCategories(res);
        clickOnSort();
        clickOnDeleteButton();
        clickOnUpdateButton();
    },
    ...error
};

const appendCategories = (categories) => {
    for (const category of categories) {
        appendCategory(category);
    }
};

const getAllCategories = () => {
    $.ajax({
        url: `${HOST}/category`,
        ...get
    });
};
//sorting category
const getSortedBy = field => {
    $.ajax({
        url: `${HOST}/category?direction=${$asc ? 'ASC' : 'DESC'}&fieldName=${field}`,
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
//---------------------------------------------------------------------------------------------------------------
// creating new category
$createButton.click( e => {
    const request = {
        name: $nameInput.val()
    };
    $.ajax({
        url: `${HOST}/category`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(request),
        success: res => {
            $nameInput.val('');
            getAllCategories();
        },
        ...error
    });
});

$openCreateForm.click( () => {
    $modalName.text('Create category');
    $nameInput.val('');
    $modalFooter.hide();
    $createButton.show();
});
//------------------------------------------------------------------------------------------------------
//updating category
const clickOnUpdateButton = _ => {
    $('.update-btn').click( e => {
        let id = e.target.getAttribute('data-id');
        $modalName.text('Category id: ' + id);
        initUpdateForm(id);
    })
};

const initUpdateForm = (id) => {
    $.ajax({
        url: `${HOST}/category/one/` + id,
        type: 'GET',
        success: res => {
            $nameInput.val(res.name).focus();
            $modalFooter.show();
            $createButton.hide();
            $update.attr('data-id', id);
        }
    })
};

$update.click( e => {
    $.ajax({
        url: `${HOST}/category?id=` + $update.attr('data-id'),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            name: $nameInput.val()
        }),
        success: res => {
            getAllCategories();
        },
        ...error
    });
});
//--------------------------------------------------------------------------------------------------

//delete category
const deleteRequest = id => {
    $.ajax({
        url: `${HOST}/category?id=` + id,
        type: 'DELETE',
        success: res => {
            getAllCategories();
        },
        ...error
    });
};

const clickOnDeleteButton = _ => {
    $('.delete-btn').on('click', e => {
        let id = e.target.getAttribute('data-id');
        $('#delete-text').text('Do you want to delete category with id: ' + id + ' ?');
        confirmDelete(id);
    });
};

const confirmDelete = (id) => {
    $('#delete').off().on('click', e => {
        deleteRequest(id);
    });
};
//-----------------------------------------------------------------------------------------------------------
$(document).ready(function(){
    $('.modal').modal();
});

getAllCategories();