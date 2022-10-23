let userDataString = ""; 
const spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

document.addEventListener("DOMContentLoaded", function(){

    // listen to form submit 
    // event if form exist
    addAssetForm = document.querySelector("#add-asset-form");
    if(addAssetForm !== null){
        addAssetForm.addEventListener("submit", addAsset);
    }

    // listen to form submit 
    // event if form exist
    editAssetForm = document.querySelector("#edit-asset-form");
    if(editAssetForm !== null){
        editAssetForm.addEventListener("submit", updateAsset);
    }

    // listen to form submit 
    // event if form exist
    deleleModelForm = document.querySelector("#delele-model-form");
    if(deleleModelForm !== null){
        deleleModelForm.addEventListener("submit", deleteAsset);
    }


    editAssetCardBody = document.querySelector("#edit-asset-card-body");
    if(editAssetCardBody !== null){
        const assetId = editAssetCardBody.getAttribute("data-asset-id");
        loadAssetData(assetId);
    }





    $("#upload_asset_image").change(function () {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.querySelector("#display_asset_image").setAttribute("src", e.target.result);
            }
            reader.readAsDataURL($(this)[0].files[0]);
        } 
    });


    // delete asset functions
    // get all delete button
    const deleteBtnList = document.querySelectorAll(".delete-asset");
    // loop over all delete button
    // and set event listener on 
    // them
    deleteBtnList.forEach(element => {
        element.onclick = function(event){
            const assetId = this.getAttribute("data-asset-id");
            const assetName = this.getAttribute("data-asset-name");
            const serialNumber = this.getAttribute("data-serial-number");

            const contentEl = document.querySelector("#delete-modal-body-content");
            const content = `<p>Are you sure you want to delete asset with serial # <strong>${serialNumber}</strong> (${assetName})</p>`;
            contentEl.innerHTML = content;

            // Select modal
            // Open modal once the get called
            const deletePopupBox = document.getElementById('deletePopupBox');
            deletePopupBox.style.display = "block";

            deletePopupBox.setAttribute("data-asset-id",assetId)
            document.querySelector("#delele-model-form").setAttribute("data-asset-id",assetId);

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
    // end delete asset functions


})



const addAsset = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-submit-form");
    btnSubmit.innerHTML = `${spinner} Submiting...`;
    btnSubmit.disabled = true;

    const url = "/asset_add"

    // hide any error message
    document.querySelector("#error-message-container").style.display = "none";

    const company = document.querySelector("#company").value;
    const assetTag = document.querySelector("#asset_tag").value;
    const assetSerial = document.querySelector("#asset_serial").value;
    const assetModel = document.querySelector("#asset_model").value;
    const assetStatus = document.querySelector("#asset_status").value;
    const assetName = document.querySelector("#asset_name").value;
    const purchaseDate = document.querySelector("#purchase_date").value;
    const supplier = document.querySelector("#supplier").value;
    const orderNumber = document.querySelector("#order_number").value;
    const purchaseCost = document.querySelector("#purchase_cost").value;
    const warranty = document.querySelector("#warranty").value;
    const note = document.querySelector("#note").value;
    const defaultLocation = document.querySelector("#default_location").value;
    const uploadAssetImage = document.querySelector("#upload_asset_image").files[0];
    

    const form = new FormData()
    form.append("company", company)
    form.append("asset_tag", assetTag)
    form.append("asset_serial", assetSerial)
    form.append("asset_model", assetModel)
    form.append("asset_status", assetStatus)
    form.append("asset_name", assetName)
    form.append("purchase_date", purchaseDate)
    form.append("supplier", supplier)
    form.append("order_number", orderNumber)
    form.append("purchase_cost", purchaseCost)
    form.append("warranty", warranty)
    form.append("note", note)
    form.append("default_location", defaultLocation)
    form.append("upload_asset_image", uploadAssetImage)

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
            window.location.href = '/assets';


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
        document.querySelector("#error-message").innerHTML = err.message;
    })

}


const loadAssetData = (assetId) =>{
    fetch(`/asset_load/${assetId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if(response.status === 200){
            return response.json();
        }
    }).then(jsonData => {
        const asset = jsonData.asset;
        document.querySelector("#company").value =asset.company;
        document.querySelector("#asset_tag").value =asset.asset_tag;
        document.querySelector("#asset_serial").value =asset.asset_serial;
        document.querySelector("#asset_model").value =asset.asset_model;
        document.querySelector("#asset_status").value =asset.asset_status;
        document.querySelector("#asset_name").value =asset.asset_name;
        document.querySelector("#purchase_date").value =asset.purchase_date;
        document.querySelector("#supplier").value =asset.supplier;
        document.querySelector("#order_number").value =asset.order_number;
        document.querySelector("#purchase_cost").value =asset.purchase_cost;
        document.querySelector("#warranty").value =asset.warranty;
        document.querySelector("#note").value =asset.note;
        document.querySelector("#default_location").value =asset.default_location;
        document.querySelector("#display_asset_image").setAttribute("src", asset.photo_link);
        console.log(jsonData);

    }).catch(err =>{

    })
}


const updateAsset = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-submit-form");
    btnSubmit.innerHTML = `${spinner} Submiting...`;
    btnSubmit.disabled = true;

    // get asset id
    const assetId = document.querySelector("#edit-asset-form").getAttribute("data-asset-id")
    const url = `/asset_edit/${assetId}`;

    // hide any error message
    document.querySelector("#error-message-container").style.display = "none";

    const company = document.querySelector("#company").value;
    const assetTag = document.querySelector("#asset_tag").value;
    const assetSerial = document.querySelector("#asset_serial").value;
    const assetModel = document.querySelector("#asset_model").value;
    const assetStatus = document.querySelector("#asset_status").value;
    const assetName = document.querySelector("#asset_name").value;
    const purchaseDate = document.querySelector("#purchase_date").value;
    const supplier = document.querySelector("#supplier").value;
    const orderNumber = document.querySelector("#order_number").value;
    const purchaseCost = document.querySelector("#purchase_cost").value;
    const warranty = document.querySelector("#warranty").value;
    const note = document.querySelector("#note").value;
    const defaultLocation = document.querySelector("#default_location").value;
    const uploadAssetImage = document.querySelector("#upload_asset_image").files[0];

    console.log(purchaseDate)

    const form = new FormData()
    form.append("company", company)
    form.append("asset_tag", assetTag)
    form.append("asset_serial", assetSerial)
    form.append("asset_model", assetModel)
    form.append("asset_status", assetStatus)
    form.append("asset_name", assetName)
    form.append("purchase_date", purchaseDate)
    form.append("supplier", supplier)
    form.append("order_number", orderNumber)
    form.append("purchase_cost", purchaseCost)
    form.append("warranty", warranty)
    form.append("note", note)
    form.append("default_location", defaultLocation)
    form.append("upload_asset_image", uploadAssetImage)

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

            // redirect page to list of asset
            window.location.href = '/assets';


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
       document.querySelector("#error-message").innerHTML = err.message;
    })

}


const deleteAsset = (event) =>{
    event.preventDefault();

    // show progress 
    const btnSubmit = document.querySelector("#btn-delete");
    btnSubmit.innerHTML = `${spinner} Delete...`;
    btnSubmit.disabled = true;

    // get asset id
    const assetId = document.querySelector("#delele-model-form").getAttribute("data-asset-id")
    const url = `/asset_delete/${assetId}`;

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

            // redirect page to list of asset
            window.location.href = '/assets';


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









