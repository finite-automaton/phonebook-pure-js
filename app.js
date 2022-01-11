// Define UI Components

const name = document.getElementById('name'),
    phoneNumber = document.getElementById('phone-number'),
    form = document.querySelector('#contact-form'),
    filter = document.getElementById('filter'),
    deleteAll = document.querySelector('.clear-contacts'),
    contacts = document.querySelector('.collection'),
    nameMessage = document.getElementById('name-message'),
    phoneMessage = document.getElementById('phone-message');

nameMessage.style.color = 'red';


//Setup event listeners
loadEventListeners();

function loadEventListeners(){
    document.addEventListener('DOMContentLoaded', getContacts)
    form.addEventListener('submit', addContact);
    filter.addEventListener('keyup', filterContacts);
    deleteAll.addEventListener('click', deleteAllContacts);
    contacts.addEventListener('click', removeContact);
};

function getContacts(){
    if(localStorage.getItem('contacts') == null){
        return;
    }
    let contacts = JSON.parse(localStorage.getItem('contacts'));


    for(const [key, value] of Object.entries(contacts)){
        renderContact(key, value);
    }

}

function addContact(e){
    e.preventDefault();
    // Dispay Errors
    if(name.value === ''){
        nameMessage.textContent = "Please Enter a Name";
    } else {
        nameMessage.textContent = '';
    }

    if(phoneNumber.value === ''){
        phoneMessage.textContent = 'Please Enter a Number';
    } else {
        phoneMessage.textContent  = '';
    }

    if(name.value === '' || phoneNumber.value === ''){
        return;
    }

    if(isInList(name.value)){
        nameMessage.textContent = 'Entry already exists';
        return;
    }

    addContactToLS(name.value, phoneNumber.value);

    renderContact(name.value, phoneNumber.value);

    name.value = '';
    phoneNumber.value = '';


}

function removeContact(e){
    if(e.target.parentElement.classList.contains('delete-item')){
        e.target.parentElement.parentElement.remove();
        removeContactFromLS(e.target.parentElement.parentElement)
    }
}

function addContactToLS(contactName, contactPhoneNumber){

    let contacts ;
    // TODO: validate if contact exists
    if(localStorage.getItem('contacts') == null){
        contacts = {
                [contactName] : contactPhoneNumber
        }
    }
    else{
        contacts = JSON.parse(localStorage.getItem('contacts'));
        contacts[contactName] = contactPhoneNumber;
    }

    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function removeContactFromLS(contact){
    let contacts;
    if(localStorage.getItem('contacts') == null){
        return;
    }
    else{
        contacts = JSON.parse(localStorage.getItem('contacts'));
    }
    
    let centerPoint = contact.textContent.indexOf(':');
    let name = contact.textContent.substring(0, centerPoint-1);
    let phoneNumber = contact.textContent.substring(centerPoint+2);

    for(const [key, value] of Object.entries(contacts)){
        if(key===name && value === phoneNumber){
            delete contacts[key];
        }
    }

    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function deleteAllContacts(){

    if(localStorage.getItem('contacts') != null){
        localStorage.removeItem('contacts');
    }
    while(contacts.firstChild){
        contacts.removeChild(contacts.firstChild);
    }

}

function isInList(contactName, contactPhoneNumber){

    let contacts ;
    // TODO: validate if contact exists
    if(localStorage.getItem('contacts') == null){
        return false;
    }
    contacts = JSON.parse(localStorage.getItem('contacts'));

    
    if(contacts[contactName] == null){
        return false;
    }

    return true;
}

function renderContact(name, phoneNumber){
    const newContact = document.createElement('li');
    newContact.className = 'collection-item';
    newContact.appendChild(document.createTextNode(`${name} : ${phoneNumber}`));

    const deleteBtn = document.createElement('a');
    deleteBtn.className = 'delete-item secondary-content';
    deleteBtn.innerHTML = '<i class="fa fa-remove"></i>';
    newContact.appendChild(deleteBtn);


    contacts.appendChild(newContact);
}

function filterContacts(e){
    let text = e.target.value.toLowerCase();
    document.querySelectorAll('.collection-item').forEach( 
        function(contact){
            const item = contact.firstChild.textContent;
            if(item.toLowerCase().indexOf(text) != -1){
                contact.style.display = 'block';
            }else{
                contact.style.display = 'none';
            }
    });
}