let userDataString = ""; 
const spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

document.addEventListener("DOMContentLoaded", function(){

    // listen to form submit 
    // event if form exist
    addLicenseForm = document.querySelector("#add-license-form");
    if(addLicenseForm !== null){
        addLicenseForm.addEventListener("submit", addLicense);
    }

    // listen to form submit 
    // event if form exist
    editLicenseForm = document.querySelector("#edit-license-form");
    if(editLicenseForm !== null){
        editLicenseForm.addEventListener("submit", updateLicense);
    }

    // listen to form submit 
    // event if form exist
    deleleModelForm = document.querySelector("#delele-model-form");
    if(deleleModelForm !== null){
        deleleModelForm.addEventListener("submit", deleteLicense);
    }

    editLicenseCardBody = document.querySelector("#edit-license-card-body");
    if(editLicenseCardBody !== null){
        const licenseId = editLicenseCardBody.getAttribute("data-license-id");
        loadLicenseData(licenseId);
    }


    // delete license functions
    // get all delete button
    const deleteBtnList = document.querySelectorAll(".delete-license");
    // loop over all delete button
    // and set event listener on 
    // them
    deleteBtnList.forEach(element => {
        element.onclick = function(event){
            const licenseId = this.getAttribute("data-license-id");
            const licenseName = this.getAttribute("data-software-name");

            const contentEl = document.querySelector("#delete-modal-body-content");
            const content = `<p>Are you sure you want to delete license <strong>${licenseName}</strong></p>`;
            contentEl.innerHTML = content;

            // Select modal
            // Open modal once the get called
            const deletePopupBox = document.getElementById('deletePopupBox');
            deletePopupBox.style.display = "block";

            deletePopupBox.setAttribute("data-license-id",licenseId)
            document.querySelector("#delele-model-form").setAttribute("data-license-id",licenseId);

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



const addLicense = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-submit-form");
    btnSubmit.innerHTML = `${spinner} Submiting...`;
    btnSubmit.disabled = true;

    const url = "/license_add"

    // hide any error message
    document.querySelector("#error-message-container").style.display = "none";

    const softwareName = document.querySelector("#software_name").value;
    const categoryName = document.querySelector("#category_name").value;
    const productKey = document.querySelector("#product_key").value;
    const seats = document.querySelector("#seats").value;
    const company = document.querySelector("#company").value;
    const manufacturer = document.querySelector("#manufacturer").value;
    const licenseToName = document.querySelector("#license_to_name").value;
    const licenseToEmail = document.querySelector("#license_to_email").value;
    const supplier = document.querySelector("#supplier").value;
    const orderNumber = document.querySelector("#order_number").value;
    const purchaseCost = document.querySelector("#purchase_cost").value;
    const purchaseDate = document.querySelector("#purchase_date").value;
    const expirationDate = document.querySelector("#expiration_date").value;
    const terminationDate = document.querySelector("#termination_date").value;
    const purchaseOrderNumber = document.querySelector("#purchase_order_number").value;
    const note = document.querySelector("#note").value;

    const form = new FormData()
    form.append("software_name", softwareName)
    form.append("category_name", categoryName)
    form.append("product_key", productKey)
    form.append("seats", seats)
    form.append("company", company)
    form.append("manufacturer", manufacturer)
    form.append("license_to_name", licenseToName)
    form.append("license_to_email", licenseToEmail)
    form.append("supplier", supplier)
    form.append("order_number", orderNumber)
    form.append("purchase_cost", purchaseCost)
    form.append("purchase_date", purchaseDate)
    form.append("expiration_date", expirationDate)
    form.append("termination_date", terminationDate)
    form.append("note", note)
    form.append("purchase_order_number", purchaseOrderNumber)

    // send submited
    // data to server
    fetch(url, {
        method: "POST",
        body: form,
        // headers:{
        //     "Content-Type": "application/json"
        // }
    }).then(response => {
        // check for successs
        if (response.status === 201){

            // redirect page to list of asset
            window.location.href = '/licenses';


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
        btnSubmit.innerHTML = `Submit`;
        btnSubmit.disabled = false;

        // display error message
        document.querySelector("#error-message-container").style.display = "block";
        document.querySelector("#error-message").innerHTML = err;
    })

}


const loadLicenseData = (licenseId) =>{
    fetch(`/license_load/${licenseId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if(response.status === 200){
            return response.json();
        }
    }).then(jsonData => {
        const license = jsonData.license;
        document.querySelector("#software_name").value =license.software_name;
        document.querySelector("#category_name").value =license.category_name;
        document.querySelector("#product_key").value =license.product_key;
        document.querySelector("#seats").value =license.seats;
        document.querySelector("#company").value =license.company;
        document.querySelector("#manufacturer").value =license.manufacturer;
        document.querySelector("#license_to_name").value =license.license_to_name;
        document.querySelector("#license_to_email").value =license.license_to_email;
        document.querySelector("#supplier").value =license.supplier;
        document.querySelector("#order_number").value =license.order_number;
        document.querySelector("#purchase_cost").value =license.purchase_cost;
        document.querySelector("#purchase_date").value =license.purchase_date;
        document.querySelector("#expiration_date").value =license.expiration_date;
        document.querySelector("#termination_date").value =license.termination_date;
        document.querySelector("#note").value =license.note;
        document.querySelector("#purchase_order_number").value =license.purchase_order_number;
        console.log(jsonData);

    }).catch(err =>{

    })
}


const updateLicense = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-submit-form");
    btnSubmit.innerHTML = `${spinner} Submiting...`;
    btnSubmit.disabled = true;

        // get asset id
    const licenseId = document.querySelector("#edit-license-form").getAttribute("data-license-id")
    const url = `/license_edit/${licenseId}`;

    // hide any error message
    document.querySelector("#error-message-container").style.display = "none";

    const softwareName = document.querySelector("#software_name").value;
    const categoryName = document.querySelector("#category_name").value;
    const productKey = document.querySelector("#product_key").value;
    const seats = document.querySelector("#seats").value;
    const company = document.querySelector("#company").value;
    const manufacturer = document.querySelector("#manufacturer").value;
    const licenseToName = document.querySelector("#license_to_name").value;
    const licenseToEmail = document.querySelector("#license_to_email").value;
    const supplier = document.querySelector("#supplier").value;
    const orderNumber = document.querySelector("#order_number").value;
    const purchaseCost = document.querySelector("#purchase_cost").value;
    const purchaseDate = document.querySelector("#purchase_date").value;
    const expirationDate = document.querySelector("#expiration_date").value;
    const terminationDate = document.querySelector("#termination_date").value;
    const purchaseOrderNumber = document.querySelector("#purchase_order_number").value;
    const note = document.querySelector("#note").value;

    const form = new FormData()
    form.append("software_name", softwareName)
    form.append("category_name", categoryName)
    form.append("product_key", productKey)
    form.append("seats", seats)
    form.append("company", company)
    form.append("manufacturer", manufacturer)
    form.append("license_to_name", licenseToName)
    form.append("license_to_email", licenseToEmail)
    form.append("supplier", supplier)
    form.append("order_number", orderNumber)
    form.append("purchase_cost", purchaseCost)
    form.append("purchase_date", purchaseDate)
    form.append("expiration_date", expirationDate)
    form.append("termination_date", terminationDate)
    form.append("note", note)
    form.append("purchase_order_number", purchaseOrderNumber)

    // send submited
    // data to server
    fetch(url, {
        method: "POST",
        body: form,
        // headers:{
        //     "Content-Type": "application/json"
        // }
    }).then(response => {
        // check for successs
        if (response.status === 200){

            // redirect page to list of licenses
            window.location.href = '/licenses';


        }else{
            // this wiil execute if
            // response.status code is 
            // not 200

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
        btnSubmit.innerHTML = `Submit`;
        btnSubmit.disabled = false;

        // display error message
        document.querySelector("#error-message-container").style.display = "block";
        document.querySelector("#error-message").innerHTML = err;
    })

}


const deleteLicense = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-delete");
    btnSubmit.innerHTML = `${spinner} Delete...`;
    btnSubmit.disabled = true;

    // get license id
    const licenseId = document.querySelector("#delele-model-form").getAttribute("data-license-id")
    const url = `/license_delete/${licenseId}`;

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

            // redirect page to list of license
            window.location.href = '/licenses';


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






