const HOST = 'http://localhost:8080';
const searchParams = new URLSearchParams(window.location.search);
const $catalogNav = $('#catalog-ul');

const error = {
    error: err => {
        console.log(err);
        alert('Something went wrong!')
    }
};
// form sidenav menu ------------------------------------------------------------------------------
const appendCategory = (category) => {
    $catalogNav.append(`
    <li>
        <a class="collapsible-header indigo-text text-darken-4">${category.name}</a>
        <div class="collapsible-body">
            <ul id=${category.id} class="collection green lighten-5">
                <li><a href="/catalog?categoryId=${category.id}" class="open-catalog-by-category indigo-text text-lighten-1" 
                data-id="${category.id}">See All</a></li>
            </ul>
        </div>
    </li>`);
};
const formCatalog =(categories) => {
    for (const category of categories) {
        appendCategory(category)
    }
};
const appendSubcategories = (subcategories) => {
    for (const subcategory of subcategories) {
        $(`#${subcategory.categoryId}`).append(`<li ><a class="open-catalog-by-subcategory indigo-text text-lighten-1" 
            href="/catalog?subcategoryId=${subcategory.id}" data-id="${subcategory.id}">${subcategory.name}</a>`)
    }
};
const getCategories = () => {
    $.ajax({
        url: `${HOST}/category`,
        type: 'GET',
        success: res => {
            formCatalog(res);
        },
        ...error
    });
};
//----------------------------------------------------------------------------------------------
const getSubcategory = () => {
    $.ajax({
        url: `${HOST}/subcategory`,
        type: 'GET',
        success: res => {
            appendSubcategories(res);
        }
    })
};
