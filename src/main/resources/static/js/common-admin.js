const HOST = 'http://localhost:8080';
const $categorySelects = $('.category_select');
const $pagination = $('.pagination');

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
