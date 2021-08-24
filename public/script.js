// Get a reference to the progress bar, wrapper & status label
var progress = document.getElementById("progress");
var progress_wrapper = document.getElementById("progress_wrapper");
var progress_status = document.getElementById("progress_status");

// Get a reference to the 3 buttons
var upload_btn = document.getElementById("upload_btn");
var loading_btn = document.getElementById("loading_btn");
var cancel_btn = document.getElementById("cancel_btn");

// Get a reference to the alert wrapper
var alert_wrapper = document.getElementById("alert_wrapper");

// Get a reference to the file input element
var input = document.getElementById("file_input");

//Reference to container of selected files
var selected_files = document.getElementById("selected-files")

var file_names = [];
var files = [];

//Function to create lable
function create_label(text) {
  const label = document.createElement("label");
  label.classList.add("form-check-label");
  label.classList.add("filename-label");
  label.innerText = text;
  return label;
}

// Function to show alerts
function show_alert(message, alert) {

  alert_wrapper.innerHTML = `
    <div id="alert" class="alert alert-${alert} alert-dismissible fade show" role="alert">
      <span>${message}</span>
      <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `
}

// Function to upload file
function upload(url) {

  // Reject if the file input is empty & throw alert
  if (!input.value) {
    show_alert("No file selected", "warning")
    return;
  }

  // Create a new FormData instance
  var data = new FormData();

  // Create a XMLHTTPRequest instance
  var request = new XMLHttpRequest();

  // Set the response type
  request.responseType = "json";

  // Clear any existing alerts
  alert_wrapper.innerHTML = "";

  // Disable the input during upload
  input.disabled = true;

  // Hide the upload button
  upload_btn.classList.add("d-none");

  // Show the loading button
  loading_btn.classList.remove("d-none");

  // Show the cancel button
  cancel_btn.classList.remove("d-none");

  // Show the progress bar
  progress_wrapper.classList.remove("d-none");

  for(let i=0; i < files.length; i++){
    // Get a reference to the file
    var file = files[i];
    data.append("file", file);
  }

  // request progress handler
  request.upload.addEventListener("progress", function (e) {

    // Get the loaded amount and total filesize (bytes)
    var loaded = e.loaded;
    var total = e.total

    // Calculate percent uploaded
    var percent_complete = (loaded / total) * 100;

    // Update the progress text and progress bar
    progress.setAttribute("style", `width: ${Math.floor(percent_complete)}%`);
    progress_status.innerText = `${Math.floor(percent_complete)}% uploaded`;

  })

  // request load handler (transfer complete)
  request.addEventListener("load", function (e) {

    if (request.status == 200) {

      show_alert(`${request.response.message}`, "success");

    }
    else {

      show_alert(`Error uploading file`, "danger");

    }

    reset();

  });

  // request error handler
  request.addEventListener("error", function (e) {

    reset();

    show_alert(`Error uploading file`, "warning");

  });

  // request abort handler
  request.addEventListener("abort", function (e) {

    reset();

    show_alert(`Upload cancelled`, "primary");

  });

  // Open and send the request
  request.open("post", url);
  request.send(data);

  cancel_btn.addEventListener("click", function () {

    request.abort();

  })
}

// Function to update the input placeholder
function input_filename() {

  for(let i=0; i < input.files.length; i++){
    let name =  input.files[i].name;
    if(!file_names.includes(name)){
      selected_files.append(create_label(name));
      files.push(input.files[i]);
      file_names.push(name);
    }
  }

}

// Function to reset the page
function reset() {

  // Clear the input
  input.value = null;
  files = []
  file_names = []

  // Hide the cancel button
  cancel_btn.classList.add("d-none");

  // Reset the input element
  input.disabled = false;

  // Show the upload button
  upload_btn.classList.remove("d-none");

  // Hide the loading button
  loading_btn.classList.add("d-none");

  // Hide the progress bar
  progress_wrapper.classList.add("d-none");

  // Reset the progress bar state
  progress.setAttribute("style", `width: 0%`);

  // Clears names of selected files
  selected_files.innerHTML = "";

}