// -------------------------
// global variables
// -------------------------
let employees = [];
let filterIndexArray = [];
const urlAPI = 'https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US';
const gridContainer = document.querySelector('.grid-container');
const allCards = document.querySelectorAll('.card');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-button');
const leftArrow = document.querySelector('.fa-circle-arrow-left');
const rightArrow = document.querySelector('.fa-circle-arrow-right');
const noResults = document.querySelector('.no-results');
// -------------------------
// data calls
// -------------------------
fetchData(urlAPI)
    .then((res) => {
        employees = res.results;
        displayEmployees(employees);
        filterAndDisplay();
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
    modalContainer.innerHTML = '';
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

//finds index of employees[] based on email address
function getIndex(email) {
    let employeeIndex = 0;
    employees.forEach( (employee, index) => {
        if (employee.email === email) {
            employeeIndex = index;
        }
    });
    return employeeIndex;
}

//displays only matches to search results
function filterAndDisplay () {
    noResults.style.display = 'none'
    filterIndexArray = [];
    employees.forEach(employee => {
            if ( `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`
                .includes(search.value
                    .toLowerCase()) || search.value === '' ) {
                document.querySelector(`div[data-index="${getIndex(employee.email)}"`).style.display = "flex";
                filterIndexArray.push(getIndex(employee.email));
            } else {
                document.querySelector(`div[data-index="${getIndex(employee.email)}"`).style.display = "none";
            }
        }
    )
    if (filterIndexArray.length === 0) {
        allCards.forEach(card => card.style.display = 'none');
        noResults.innerText = `Your search for "${search.value}" returned no results. Please try again`;
        noResults.style.display = 'flex';
    }
}


// -------------------------
// event listeners
// -------------------------

//default load settings
window.addEventListener('load', () => {
    search.value = '';
})

//display details of student
gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer && e.target !== overlay) {
        if (e.target.closest('.card') !== null) {
            const card = e.target.closest('.card');
            const index = card.getAttribute('data-index');
            displayModal(index);
        }
    }
})

//close detail window
modalClose.addEventListener('click', () => {
    overlay.classList.add('hidden');
    modalContainer.innerHTML = '';
})

//search each time input changes value
search.addEventListener('input', filterAndDisplay)
searchBtn.addEventListener('click', filterAndDisplay);

//navigation buttons
leftArrow.addEventListener('click', () => {
    const email = document.querySelector('.modal .email').innerText;
    if (getIndex(email) > filterIndexArray[0]) {
        const filterIndex = filterIndexArray.indexOf(getIndex(email));
        displayModal(filterIndexArray[filterIndex - 1]);
    } else displayModal(filterIndexArray[filterIndexArray.length - 1]);
})

rightArrow.addEventListener('click', () => {
    const email = document.querySelector('.modal .email').innerText;
    if (getIndex(email) < filterIndexArray[filterIndexArray.length - 1]) {
        const filterIndex = filterIndexArray.indexOf(getIndex(email));
        displayModal(filterIndexArray[filterIndex + 1]);
    } else displayModal(filterIndexArray[0]);
})