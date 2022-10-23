let userDataString = ""; 
const spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

document.addEventListener("DOMContentLoaded", function(){

    // listen to form submit 
    // event if form exist
    addUserForm = document.querySelector("#add-user-form");
    if(addUserForm !== null){
        addUserForm.addEventListener("submit", addUser);
    }

    // listen to form submit 
    // event if form exist
    editUserForm = document.querySelector("#edit-user-form");
    if(editUserForm !== null){
        editUserForm.addEventListener("submit", updateUser);
    }


    // listen to form submit 
    // event if form exist
    changePasswordUserForm = document.querySelector("#change-password-user-form");
    if(changePasswordUserForm !== null){
        changePasswordUserForm.addEventListener("submit", changePasswordUser);
    }


    // listen to form submit 
    // event if form exist
    deleleModelForm = document.querySelector("#delele-model-form");
    if(deleleModelForm !== null){
        deleleModelForm.addEventListener("submit", deleteUser);
    }


   // delete license functions
    // get all delete button
    const deleteBtnList = document.querySelectorAll(".delete-user");
    // loop over all delete button
    // and set event listener on 
    // them
    deleteBtnList.forEach(element => {
        element.onclick = function(event){
            const userId = this.getAttribute("data-user-id");
            const username = this.getAttribute("data-username");

            const contentEl = document.querySelector("#delete-modal-body-content");
            const content = `<p>Are you sure you want to delete username <strong>${username}</strong></p>`;
            contentEl.innerHTML = content;

            // Select modal
            // Open modal once the get called
            const deletePopupBox = document.getElementById('deletePopupBox');
            deletePopupBox.style.display = "block";

            deletePopupBox.setAttribute("data-user-id",userId)
            document.querySelector("#delele-model-form").setAttribute("data-user-id",userId);

            // Select close action element
            const close = document.getElementsByClassName("close")[0];
            
            // Close modal once close element is clicked
            close.onclick = function() {
                deletePopupBox.style.display = "none";
            };
            
            // Close modal when user clicks outside of the modal box
            window.onclick = function(event) {
                if (event.target == deletePopupBox) {
                    deletePopupBox.style.display = "none";
                }
            };
        }
    })
    // end delete license functions



})



const addUser = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-submit-form");
    btnSubmit.innerHTML = `${spinner} Submiting...`;
    btnSubmit.disabled = true;

    const url = "/user_add"

    // hide any error message
    document.querySelector("#error-message-container").style.display = "none";

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const isActive = document.querySelector("#status").value;
    const isAdmin = document.querySelector("#role").value;

    data = {
        username: username,
        password: password,
        is_active: isActive,
        is_admin: isAdmin
    }

    // send submited
    // data to server
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers:{
            "Content-Type": "application/json"
        }
    }).then(response => {
        // check for success
        if (response.status === 201){

            // redirect page to list of users
            window.location.href = '/users';


        }else{
            // this wiil execute if
            // response.status code is 
            // not 201

            response.json();

        }


    }).then(dataJson =>{
        // display error message
        document.querySelector("#error-message-container").style.display = "block";
        document.querySelector("#error-message").innerHTML = dataJson.message;

        // remove progress 
        const btnSubmit = document.querySelector("#btn-submit-form");
        btnSubmit.innerHTML = "Submit";
        btnSubmit.disabled = false;


    }).catch(err => {
        // catch any network error
        console.log(err)
        // remove progress 
        const btnSubmit = document.querySelector("#btn-submit-form");
        btnSubmit.innerHTML = `${spinner} Submit`;
        btnSubmit.disabled = false;
    })

}


const updateUser = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-submit-form");
    btnSubmit.innerHTML = `${spinner} Submiting...`;
    btnSubmit.disabled = true;

    const userId = document.querySelector("#edit-user-form").getAttribute("data-id");
    const url = `/user_edit/${userId}`

    // hide any error message
    document.querySelector("#error-message-container").style.display = "none";

    const isActive = document.querySelector("#status").value;
    const isAdmin = document.querySelector("#role").value;

    data = {
        is_active: isActive,
        is_admin: isAdmin
    }

    // send submited
    // data to server
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers:{
            "Content-Type": "application/json"
        }
    }).then(response => {
        // check for success
        if (response.status === 200){

            // redirect page to list of users
            window.location.href = '/users';


        }else{
            // this wiil execute if
            // response.status code is 
            // not 201

            response.json();

        }


    }).then(dataJson =>{
        // display error message
        document.querySelector("#error-message-container").style.display = "block";
        document.querySelector("#error-message").innerHTML = dataJson.message;

        // remove progress 
        const btnSubmit = document.querySelector("#btn-submit-form");
        btnSubmit.innerHTML = "Submit";
        btnSubmit.disabled = false;


    }).catch(err => {
        // catch any network error
        console.log(err)
        // remove progress 
        const btnSubmit = document.querySelector("#btn-submit-form");
        btnSubmit.innerHTML = `${spinner} Submit`;
        btnSubmit.disabled = false;
    })

}

const changePasswordUser = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-submit-form");
    btnSubmit.innerHTML = `${spinner} Submiting...`;
    btnSubmit.disabled = true;

    const userId = document.querySelector("#change-password-user-form").getAttribute("data-id");
    const url = `/change_password/${userId}`

    // hide any error message
    document.querySelector("#error-message-container").style.display = "none";

    const password = document.querySelector("#password").value;

    data = {
        password: password
    }

    // send submited
    // data to server
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers:{
            "Content-Type": "application/json"
        }
    }).then(response => {
        // check for success
        if (response.status === 200){

            // redirect page to list of users
            window.location.href = '/';


        }else{
            // this wiil execute if
            // response.status code is 
            // not 201

            response.json();

        }


    }).then(dataJson =>{
        // display error message
        document.querySelector("#error-message-container").style.display = "block";
        document.querySelector("#error-message").innerHTML = dataJson.message;

        // remove progress 
        const btnSubmit = document.querySelector("#btn-submit-form");
        btnSubmit.innerHTML = "Submit";
        btnSubmit.disabled = false;


    }).catch(err => {
        // catch any network error
        console.log(err)
        // remove progress 
        const btnSubmit = document.querySelector("#btn-submit-form");
        btnSubmit.innerHTML = `${spinner} Submit`;
        btnSubmit.disabled = false;
    })

}

const deleteUser = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-delete");
    btnSubmit.innerHTML = `${spinner} Delete...`;
    btnSubmit.disabled = true;

    // get license id
    const userId = document.querySelector("#delele-model-form").getAttribute("data-user-id")
    const url = `/user_delete/${userId}`;

    // send submited
    // data to server
    fetch(url, {
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    }).then(response => {
        // check for successs
        if (response.status === 200){

            // redirect page to list of user
            window.location.href = '/users';


        }else{
            // this wiil execute if
            // response.status code is 
            // not 200

            response.json();

        }


    }).then(dataJson =>{


        // remove progress 
        const btnSubmit = document.querySelector("#btn-delete");
        btnSubmit.innerHTML = "Delete";
        btnSubmit.disabled = false;


    }).catch(err => {
        // catch any network error
        console.log(err)

        // remove progress 
        const btnSubmit = document.querySelector("#btn-delete");
        btnSubmit.innerHTML = `Delete`;
        btnSubmit.disabled = false;
    })

}






