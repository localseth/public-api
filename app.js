// -------------------------
// global variables
// -------------------------
let employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US';
const gridContainer = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
// -------------------------
// data calls
// -------------------------
fetchData(urlAPI)
    .then(res => displayEmployees(res.results))
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

function displayEmployees (employeeData) {
    employees = employeeData;

    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let state = employee.location.state;
        let picture = employee.picture;

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

// -------------------------
// event listeners
// -------------------------
gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer) {
        const card = e.target.closest('.card');
        const index = card.getAttribute('data-index');

        displayModal(index);
    }
})

modalClose.addEventListener('click', () => {
    overlay.classList.add('hidden');
    modalContainer.innerHTML = '';
})