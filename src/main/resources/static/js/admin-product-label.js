const HOST = 'http://localhost:8080';
const $productLabelTable = $('#product_label');
const $createButton = $('#submit-btn');
const $nameInput = $('#icon_name_create');
const $openCreateForm = $('#open_create_form');
const $update = $('#update');
const $modalName = $('#modal_header');
const $modalFooter = $('#footer');
let asc = true;

const error = {
    error: err => {
        console.log(err);
        alert('Something went wrong!')
    }
};

const get = {
    type: 'GET',
    success: res => {
        $productLabelTable.html('');
        appendProductLabels(res);
        clickOnUpdateButton();
        clickOnDeleteButton();
        clickOnSort();
    },
    ...error
};

//creating table
const appendProductLabel = (productLabel) => {
    $productLabelTable.append(`
    <tr>
        <td>${productLabel.id}</td>    
        <td>${productLabel.name}</td>
        <td>
            <a class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${productLabel.id}" data-target="modal1" class="update-btn modal-trigger material-icons">edit</i></a>
            <a  class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${productLabel.id}" data-target="modal_delete" class="delete-btn modal-trigger material-icons">delete_forever</i></a>
        </td>                  
</tr>`);
};

const appendProductLabels = (productLabels) => {
    for (const productLabel of productLabels) {
        appendProductLabel(productLabel);
    }
};

const getAllProductLabels = () => {
    $.ajax({
        url: `${HOST}/productLabel`,
        ...get,
    })
};

//sorting productLabel
const getSortedBy = field => {
    $.ajax({
        url: `${HOST}/productLabel?direction=${asc ? 'ASC' : 'DESC'}&fieldName=${field}`,
        ...get
    });
};

const clickOnSort = _ => {
    $('.sort').off().on('click', e => {
        let field = e.target.getAttribute('data-id');
        asc = !asc;
        getSortedBy(field);
    });
};
//---------------------------------------------------------------------------------------------------------------
// creating new productLabel
$createButton.click( e => {
    console.log($nameInput.val());
    const request = {
        name: $nameInput.val()
    };
    $.ajax({
        url: `${HOST}/productLabel`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(request),
        success: res => {
            $nameInput.val('');
            getAllProductLabels();
        },
        ...error
    });
});

$openCreateForm.click( () => {
    $modalName.text('Create product label');
    $nameInput.val('');
    $modalFooter.hide();
    $createButton.show();
});
//------------------------------------------------------------------------------------------------------
//updating productLabels
const clickOnUpdateButton = _ => {
    $('.update-btn').click( e => {
        let id = e.target.getAttribute('data-id');
        $modalName.text('Product Label id: ' + id);
        initUpdateForm(id);
    })
};

const initUpdateForm = (id) => {
    $.ajax({
        url: `${HOST}/productLabel/one/` + id,
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
        url: `${HOST}/productLabel?id=` + $update.attr('data-id'),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            name: $nameInput.val()
        }),
        success: res => {
            getAllProductLabels();
        },
        ...error
    });
});
//--------------------------------------------------------------------------------------------------

//delete productLabel
const deleteRequest = id => {
    $.ajax({
        url: `${HOST}/productLabel?id=` + id,
        type: 'DELETE',
        success: res => {
            getAllProductLabels();
        },
        ...error
    });
};

const clickOnDeleteButton = _ => {
    $('.delete-btn').on('click', e => {
        let id = e.target.getAttribute('data-id');
        $('#delete-text').text('Do you want to delete Product Label with id: ' + id + ' ?');
        confirmDelete(id);
    });
};

const confirmDelete = (id) => {
    $('#delete').off().on('click', e => {
        deleteRequest(id);
    });
};
//-----------------------------------------------------------------------------------------------------------
getAllProductLabels();