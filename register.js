var form = document.getElementById("register-form");
var faculty = document.getElementById("faculty");
var department = document.getElementById("department");
var message = document.getElementById("message");

var departments = {
  cenar: ["BS Architecture", "BS Computer Engineering", "BS Industrial Engineering"],
  citec: ["BS Information Technology", "BS Computer Science", "BS Entertainment and Multimedia Computing"],
  ceas: ["BS Psychology", "BS Social Work", "BS Legal Management", "Bachelor of Elementary Education", "Bachelor of Secondary Education"],
  cmt: ["BS Accountancy", "BS Business Administration", "BS Entrepreneurship", "BS Hospitality Management", "BS Real Estate Management", "BS Tourism Management"],
  ccje: ["BS Criminology"]
};

faculty.onchange = function () {
  department.innerHTML = '<option value="">Select a department</option>';
  var list = departments[faculty.value];
  for (var i = 0; i < list.length; i++) {
    department.innerHTML += "<option>" + list[i] + "</option>";
  }
  department.disabled = false;
};

form.onreset = function () {
  department.innerHTML = '<option value="">Select a faculty first</option>';
  department.disabled = true;
  message.textContent = "";
};

form.onsubmit = function (event) {
  event.preventDefault();
  message.className = "message ok";
  message.textContent = "Thank you! Your registration form is complete. (Practice form: nothing is saved.)";
};
