const HOST = 'http://localhost:8080';
const $deliveryTable = $('#delivery');
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
        $deliveryTable.html('');
        appendDeliveries(res);
        clickOnUpdateButton();
        clickOnDeleteButton();
        clickOnSort();
    },
    ...error
};

//creating table
const appendDelivery = (delivery) => {
    $deliveryTable.append(`
    <tr>
        <td>${delivery.id}</td>    
        <td>${delivery.name}</td>
        <td>
            <a class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${delivery.id}" data-target="modal1" class="update-btn modal-trigger material-icons">edit</i></a>
            <a  class="btn-floating btn-small waves-effect waves-light teal lighten-2">
                <i data-id="${delivery.id}" data-target="modal_delete" class="delete-btn modal-trigger material-icons">delete_forever</i></a>
        </td>                  
</tr>`);
};

const appendDeliveries = (list) => {
    for (const delivery of list) {
        appendDelivery(delivery);
    }
};

const getAllDeliveries = () => {
    $.ajax({
        url: `${HOST}/delivery`,
        ...get,
    })
};

//sorting productLabel
const getSortedBy = field => {
    $.ajax({
        url: `${HOST}/delivery?direction=${asc ? 'ASC' : 'DESC'}&fieldName=${field}`,
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
// creating new delivery
$createButton.click( e => {
    console.log($nameInput.val());
    const request = {
        name: $nameInput.val()
    };
    $.ajax({
        url: `${HOST}/delivery`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(request),
        success: res => {
            $nameInput.val('');
            getAllDeliveries();
        },
        ...error
    });
});

$openCreateForm.click( () => {
    $modalName.text('Create delivery');
    $nameInput.val('');
    $modalFooter.hide();
    $createButton.show();
});
//------------------------------------------------------------------------------------------------------
//updating delivery
const clickOnUpdateButton = _ => {
    $('.update-btn').click( e => {
        let id = e.target.getAttribute('data-id');
        $modalName.text('Delivery id: ' + id);
        initUpdateForm(id);
    })
};

const initUpdateForm = (id) => {
    $.ajax({
        url: `${HOST}/delivery/one/` + id,
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
        url: `${HOST}/delivery?id=` + $update.attr('data-id'),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            name: $nameInput.val()
        }),
        success: res => {
            getAllDeliveries();
        },
        ...error
    });
});
//--------------------------------------------------------------------------------------------------

//delete delivery
const deleteRequest = id => {
    $.ajax({
        url: `${HOST}/delivery?id=` + id,
        type: 'DELETE',
        success: res => {
            getAllDeliveries();
        },
        ...error
    });
};

const clickOnDeleteButton = _ => {
    $('.delete-btn').on('click', e => {
        let id = e.target.getAttribute('data-id');
        $('#delete-text').text('Do you want to delete Delivery with id: ' + id + ' ?');
        confirmDelete(id);
    });
};

const confirmDelete = (id) => {
    $('#delete').off().on('click', e => {
        deleteRequest(id);
    });
};
//-----------------------------------------------------------------------------------------------------------

getAllDeliveries();