// -------------------------
// global variables
// -------------------------
let employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US';
const gridContainer = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const search = document.getElementById('search');
// -------------------------
// data calls
// -------------------------
fetchData(urlAPI)
    .then((res) => {
        employees = res.results
        displayEmployees(employees)
    })
// -------------------------
// helper functions
// -------------------------
function fetchData(url) {
    return fetch(url)
              .then(checkStatus)
              .then(res => res.json())
              .catch(error => console.log('Looks like there was a problem', error))
}

function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
}

function displayEmployees (list) {
    list.forEach((list, index) => {
        let name = list.name;
        let email = list.email;
        let city = list.location.city;
        let state = list.location.state;
        let picture = list.picture;

        const employeeHTML = `
            <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}" />
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}, ${state}</p>
                </div>
            </div>
        `;

        gridContainer.insertAdjacentHTML('beforeend', employeeHTML)
    });
}

function displayModal (index) {
    //deconstruct array to more simply write the HTML template
    let { name, dob, phone, email, location: { city, street, state, postcode}, picture } = employees[index];

    let date = new Date(dob.date);
    //template for overlay information
    const modalHTML =`
        <img class="avatar" src="${picture.large}" />
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr />
            <p>${fixPhoneNum(phone)}</p>
            <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
            <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
    `;

    overlay.classList.remove('hidden');
    modalContainer.insertAdjacentHTML('beforeend', modalHTML);
}

function fixPhoneNum (num) {
    if (num.charAt(5) === '-') {
        num = num.replace(num.charAt(5), ' ');
    }
    return num;
}

function filterAndDisplay () {
    const filterArray = employees.filter(employee => 
        `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`.includes(search.value.toLowerCase())
    )
    if (!/^\s*$/g.test(search.value)) {
        gridContainer.innerHTML = '';
        if (filterArray.length > 0){
            displayEmployees(filterArray);
        }
        if (filterArray.length === 0) {
            gridContainer.innerHTML = `<h1>Your search for "${search.value}" returned no results. Please try again.</h1>`;
        }
    } else {
        gridContainer.innerHTML = '';
        displayEmployees(employees)
    }
}

// -------------------------
// event listeners
// -------------------------
gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer && e.target !== overlay) {
        if (e.target.closest('.card') !== null) {
            const card = e.target.closest('.card');
            const index = card.getAttribute('data-index');
            displayModal(index);
        }
    }
})

modalClose.addEventListener('click', () => {
    overlay.classList.add('hidden');
    modalContainer.innerHTML = '';
})

search.addEventListener('input', filterAndDisplay)