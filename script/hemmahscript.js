var serverUrl = "https://mawaridmanpower.com:5001";
// var serverUrl = "https://mawaridmanpower.com:5002";
var neighborHood = document.getElementById("neighborhood");
var Description = document.getElementById("problemdescription");
var selectedDate = "";
var selectedTime = "";
var VisitingDate = "";
var Visitingtime = "";
var attachment = "";
var serviceId = "";
var maxTile = document.getElementById("maxTile");
var formData = {
  name: '',
  phone: '',
  email: '',
  address: '',
  service: '',
  subservice: '',
  date: '',
  time: '',
  neighborhood: '',
  notes: ''
};
var currentLanguage = document.documentElement.lang;
document.addEventListener("DOMContentLoaded", function () {
  localStorage.clear();

  maxTile.textContent = currentLanguage == "en" ? `0  SAR` : `0 ريال`;

  document.getElementById("name").addEventListener("input", function () {
    formData.name = this.value;
    updateDescription();
  });

  document.getElementById("phone").addEventListener("input", function () {
    formData.phone = this.value;
    updateDescription();
  });

  document.getElementById("email").addEventListener("input", function () {
    formData.email = this.value;
    updateDescription();
  });

  document.getElementById("address").addEventListener("input", function () {
    formData.address = this.value;
    updateDescription();
  });

  document.getElementById("service").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    formData.service = selectedOption.text;
    updateDescription(); // Update problemDescription textarea
  });

  document.getElementById("subservice").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    formData.subservice = selectedOption.text;
    updateDescription();
  });

  document.getElementById("neighborhood").addEventListener("change", function () {
    formData.neighborhood = this.value;
    updateDescription();
  });

  document.getElementById("imageTextArea").addEventListener("input", function () {
    formData.notes = this.value;
    updateDescription();
  });
  getAddressByContactNumber();
  document.getElementById("service").addEventListener("click", function () {

    if (!neighborHood.textContent) {
      if (currentLanguage == "en") {
        alert("Address not found, Please check the address");
        return;
      }
      else {
        alert("لم يتم العثور على العنوان، يرجى التحقق من العنوان");
        return;
      }
    }
  });
  document.getElementById("subservice").addEventListener("click", function () {
    if (!document.getElementById("service").value) {
      if (currentLanguage == "en") {
        alert("Select service to proceed");
        return;
      }
      else {
        alert("اختر الخدمة للمتابعة");
        return;
      }
    }
  });
  document.getElementById("createneighborhood").addEventListener("click", function () {
    if (!document.getElementById("createcity").value) {
      if (currentLanguage == "en") {
        alert("Select city to proceed");
        return;
      }
      else {
        alert("اختر المدينة للمتابعة");
        return;
      }
    }
  });
  document.getElementById("createcity").addEventListener("change", function () {
    getNeighbourHoodByCityId(this.value);
  });
  document.getElementById("service").addEventListener("change", function () {
    getSubServicesByAddressIdAndServiceId();
  });
  document.getElementById("subservice").addEventListener("change", function () {
    updateMaximumPrice(content, this.value);
    // createTimeSlots(neighborHood.innerHTML, this.value);
  });
  var modal = document.getElementById("addressModal");
  var closeModalHeaderBtn = document.getElementById("closeModalHeaderBtn");
  var closeModalFooterBtn = document.getElementById("closeModalFooterBtn");
  var AddressCreate = document.getElementById("createAddress");
  var submitForm = document.getElementById("submitRequest");
  var plusIcon = document.querySelector(".create");
  submitForm.onclick = function () {
    createRequest();
  };
  closeModalHeaderBtn.onclick = function () {
    clearAddressCreateForm();
    modal.style.display = "none";
  };
  // create click for address
  AddressCreate.onclick = function () {
    createAddress();
  };
  //model footer close button
  closeModalFooterBtn.onclick = function () {
    clearAddressCreateForm();
    modal.style.display = "none";
  };
  //on create button click
  plusIcon.addEventListener("click", function () {
    let phoneNumber = document.getElementById("phone").value;
    if (!phoneNumber) {
      alert("Please enter contact number");
      return;
    }
    var contactid = document.getElementById("contactid");
    modal.style.display = "block";
    clearAddressCreateForm();
    getCities();
    contactid.value = localStorage.getItem("clientId");
  });
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "block"; // Close the modal when clicked outside
    }
  };

  document.getElementById("email").addEventListener("change", function () {

    const message = document.getElementById("message");
    if (isValidEmail(this.value)) {
      message.textContent = "";
      return;
    } else {
      currentLanguage === "en" ? message.textContent = "Please enter a valid email" : message.textContent = "الرجاء إدخال بريد إلكتروني صالح";
      message.style.color = "red";
    }
  });

  const dateTiles = document.getElementById("dateTiles");

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const tile = document.createElement("div");
    tile.className = "tile";

    const lang = currentLanguage;
    const dayLabel =
      i === 0
        ? lang === "ar" ? "اليوم" : "Today"
        : i === 1
          ? lang === "ar" ? "غدًا" : "Tomorrow"
          : date.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { weekday: "long" });


    tile.innerHTML = `
      <div class="day">${dayLabel}</div>
      <div class="date">${date.getDate()}</div>
    `;

    tile.addEventListener("click", () => {
      if (!neighborHood.textContent) {
        if (currentLanguage == "en") {
          alert("Address not found, Please check the address");
          return;
        }
        else {
          alert("لم يتم العثور على العنوان، يرجى التحقق من العنوان");
          return;
        }
      }
      document.querySelectorAll("#dateTiles .tile")
        .forEach((t) => t.classList.remove("selected"));
      tile.classList.add("selected");
      selectedDate = new Date(date);
      createTimeSlots(selectedDate,neighborHood.innerText, document.getElementById("subservice").value);
      let currentDate = selectedDate ? selectedDate : new Date();
       VisitingDate = currentDate.toISOString().split("T")[0];
    });

    dateTiles.appendChild(tile);
  }

  document.getElementById("timeSlots").addEventListener("change", function (event) {
    if (event.target.type === "radio") {
      const selectedValue = event.target.value;
      Visitingtime = selectedValue;
    }
  });



  document.getElementById("cameraIcon").addEventListener("click", function () {
    document.getElementById("imageUpload").click();
  });

  document
    .getElementById("imageUpload")
    .addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = e.target.result;
        // document.getElementById("imageTextArea").textContent = file?.name;
        attachment = base64;
      };
      reader.readAsDataURL(file);
    });
});

function checkMobileNumber() {
  let mobileInput = document.getElementById("phone").value;
  let errorMessage = document.getElementById("error-message");
  let mobilePattern = /^05\d{8}$/;
  if (mobilePattern.test(mobileInput)) {
    errorMessage.style.display = "none";
    return true;
  } else {
    errorMessage.style.display = "block";
    return false;
  }
}

function isValidEmail(email) {

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function getAddressByContactNumber() {

  const phoneInput = document.getElementById("phone");
  if (phoneInput) {

    phoneInput.addEventListener("change", async function () {

      if (!checkMobileNumber()) return;
      const phoneNumber = phoneInput.value;
      showLoader();
      try {
        const response = await fetch(
          `${serverUrl}/api/Client/GetProfileByMobileNumber?MobileNumber=${phoneNumber}`,
          {
            method: "Get",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        hideLoader();
        if (data && data.code == 200 && data.content.mainAddress == null) {
          alert(
            "Warning: Address Information Not Found Please Create New Address"
          );
        }
        if (data && data.code == 200) {
          localStorage.clear();
          localStorage.setItem("clientId", data.content.clientID);
        }
        if (
          data &&
          data.code == 200 &&
          data.content.mainAddress != null &&
          data.content.mainAddress.addressTitle
        ) {
          addressvalue.value = data.content.mainAddress.addressId;
          address.value = data.content.mainAddress.addressTitle;
          neighborHood.value = data.content.mainAddress.neighbourhoodID;
          neighborHood.textContent = data.content.mainAddress.neighbourhoodID;
          document.getElementById("neighborhood").value = data.content.mainAddress.neighbourhoodID;
          getServicesByAddressId(data.content.mainAddress.neighbourhoodID);
        } else if (data.code == 404) {
          registerUser(phoneNumber);
        }
      } catch (error) {
        hideLoader();
        alert(error);
      }
    });
  } else {
    console.error("Phone input field not found!");
  }
}
function changeLanguage(lang) {

  currentLanguage = lang;
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
}
async function registerUser(phoneNumber) {
  const apiUrl = `${serverUrl}/api/Client/NewRegister`;
  showLoader();
  try {
    const response = await fetch(apiUrl, {
      method: "Post",
      mode: "cors",
      body: JSON.stringify({
        mobileNumber: phoneNumber,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    hideLoader();
    if (data.code == 400 || data.code == 503) {
      alert(data.message);
      return;
    }
    if (data.content.clientID) {
      localStorage.setItem("clientId", data.content.clientID);
    }
  } catch (error) {
    hideLoader();
    alert(error);
  }
}
var selectedServiceId = "";
async function getServicesByAddressId(data) {
  const selectElement = document.getElementById("service");
  const apiUrl = `${serverUrl}/api/General/GetAllSubCategories?NeighborhoodID=${data}`;
  showLoader();
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    hideLoader();
    if (data.code == 200) {
      selectElement.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = currentLanguage == "en" ? "Select an option" : "حدد خيارًا";
      selectElement.appendChild(defaultOption);
      data.content.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.subCategoryID;
        option.textContent = currentLanguage == "en" ? item.name : item.arabicName;
        selectElement.appendChild(option);
      });
    } else {
      alert(data.message);
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching data:", error);
    selectElement.innerHTML =
      '<option value="">Failed to load options</option>';
  }
}
var maximum = 0;
var content = [];
var selectedSubServiceValue = "";
async function getSubServicesByAddressIdAndServiceId() {
  const service = document.getElementById("service").value;
  const neighborhood =  document.getElementById("neighborhood").value?  document.getElementById("neighborhood").value : neighborHood.textContent;
  const selectElement = document.getElementById("subservice");
  const apiUrl = `${serverUrl}/api/General/GetServicesBySubCategoryID?SubcategoryID=${service}&NeighborhoodID=${neighborhood}`;
  //const apiUrl = `${serverUrl2}/api/General/GetServicesBySubCategoryID?SubcategoryID=8cc8ad41-3fc3-ee11-9078-000d3a65395f&NeighborhoodID=377be2e2-bea9-e711-aeda-005056866d96`;
  showLoader();

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    hideLoader();

    if (data.code == 200) {
      const selectedValue = selectElement.value;
      selectElement.innerHTML = ""; // Clear existing options

      // Add default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = currentLanguage == "en" ? "Select an option" : "حدد خيارًا";
      selectElement.appendChild(defaultOption);

      // Populate dropdown and store full object
      content = data.content;
      data.content.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.serviceID;
        option.textContent = currentLanguage == "en" ? item.englishName : item.arabicName;
        selectElement.appendChild(option);
      });

      // Restore previous selection if any
      if (selectedValue) {
        selectElement.value = selectedValue;
        selectedSubServiceValue = selectedValue;
      }

    } else {
      alert(data.message || "Failed to load subservices.");
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching subservices:", error);
    selectElement.innerHTML = '<option value="">Failed to load options</option>';
  }
}

function updateMaximumPrice(content, selectedValue) {
  let priceData = content.filter(x => x.serviceID == selectedValue);
  if (priceData.length > 0) {
    maximum = priceData[0].totalDurationprice;
    maxTile.textContent = currentLanguage == "en" ? `${maximum}  SAR` : `${maximum}  ريال`;
  }
}
async function getCurrentNeighborHoodByLatLang(lat, lng) {
  const neighborHood = document.getElementById("createneighborhood");
  const city = document.getElementById("createcity");
  const apiUrl = `${serverUrl}/api/Address/GetCurrentNeighbourhood?Latitude=${lat}&Longitiude=${lng}`;
  showLoader();
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    hideLoader();
    if (data.code == 404) {
      alert(data.message);
      return;
    }
    neighborHood.innerHTML = '<option value="">Select Neighborhood</option>';
    city.innerHTML = '<option value="">Select City</option>';
    if (data.content.cityID) {
      city.innerHTML = "";
      city.innerHTML = `<option value="${data.content.cityID}">${data.content.cityEn + "-" + data.content.cityAr
        }</option>`;
    }
    if (data.content.neighbourhoodID) {
      neighborHood.innerHTML = "";
      neighborHood.innerHTML = `<option value="${data.content.neighbourhoodID
        }">${data.content.neighbourhoodEn + "-" + data.content.neighbourhoodAr
        }</option>`;
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching data:", error);
    city.innerHTML = '<option value="">Failed to load options</option>';
    neighborHood.innerHTML = '<option value="">Failed to load options</option>';
  }
}
async function createAddress() {
  const city = document.getElementById("createcity");
  const phonenumber = document.getElementById("phone");
  const contact = document.getElementById("contactid");
  const addresstitle = document.getElementById("addresstitle");
  const buildingno = document.getElementById("buildingno");
  const buildingType = document.getElementById("buildingType");
  const neighborhood = document.getElementById("createneighborhood");
  const apiUrl = `${serverUrl}/api/Address/AddAddress`;
  const data = {
    contactId: contact.value,
    addressTitle: addresstitle.value,
    cityID: city.value,
    neighbourhoodID: neighborhood.value,
    latitude: "",
    longitude: "",
    buildingNO: buildingno.value,
    preferedPhone: phonenumber.value,
    isMain: true,
    buildingType: buildingType.value,
  };
  if (
    !data.contactId ||
    !data.addressTitle ||
    !data.cityID ||
    !data.neighbourhoodID ||
    // !data.latitude ||
    // !data.longitude ||
    !data.buildingNO ||
    !data.preferedPhone ||
    !data.isMain ||
    !data.buildingType
  ) {
    alert("Please fill all fields");
    return;
  }
  showLoader();
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    hideLoader();
    if (responseData.code == 200) {
      alert("Address created successfully");
      document.getElementById("addressModal").style.display = "none";
      document.getElementById("addressvalue").value =
        responseData.content.addressId;
      document.getElementById("address").value = addresstitle.value;
      document.getElementById("neighborhood").innerHTML = neighborhood.innerHTML;
      document.getElementById("neighborhood").value = neighborhood.value;
      getServicesByAddressId(neighborhood.value);
    } else {
      alert(responseData.message);
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching data:", error);
  }
}
function showLoader() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("loader").style.display = "block";
}
function hideLoader() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("loader").style.display = "none";
}
function clearAddressCreateForm() {
  addresstitle.value = "";
  createcity.value = "";
  createneighborhood.value = "";
  buildingno.value = "";
  preferedPhone.value = "";
  isMain.checked = false;
  buildingType.value = "";
}

function clearRequestCreateForm() {
  localStorage.clear();
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("address").value = "";
  document.getElementById("addressvalue").value = "";
  // document.getElementById("city").value = "";
  document.getElementById("neighborhood").value = "";
  document.getElementById("addressvalue").value = "";
  // document.getElementById("visit-date").value = "";
  // document.getElementById("visit-Time").value = "";
  document.getElementById("service").value = "";
  document.getElementById("subservice").value = "";
  document.getElementById("imageTextArea").value = "";
  document.getElementById("dateTiles").value = "";
  document.getElementById("timeSlots").value = "";
  Description.value = "";
  // document.getElementById("noofitemstowork").value = "";
  // document.getElementById("details").value = "";
  // document.getElementById("haveTools").value = "";
  document.getElementById("email").value = "";
  VisitingDate = null;
  Visitingtime = null;
  neighborHood.value = "";
  selectedDate = null;
  selectedTime = null;
  attachment = null;
}

async function createRequest() {
  if (!VisitingDate) {
    if (currentLanguage == "en") {
      alert("Please select date first");
      return;
    }
    else {
      alert("الرجاء تحديد التاريخ أولا");
      return;
    }
  }

  if (!Visitingtime) {
    if (currentLanguage == "en") {
      alert("Please select time");
      return;
    }
    else {
      alert("الرجاء تحديد الوقت");
      return;
    }
  }
  const combined = `${VisitingDate}T${Visitingtime}:00`;

  const apiUrl = `${serverUrl}/api/WorkOrder/CreateWorkOrderSadad`;
  const data = {
    customerID: localStorage.getItem("clientId"),
    customerAddressID: document.getElementById("addressvalue").value,
    service: document.getElementById("subservice").value,
    numberOfItems: 1,
    problemDescription: document.getElementById("problemdescription").value + "",
    startDate: combined,
    descriptionAttachment: attachment,
    customerHasTools: true,
  };
  data.problemDescription =
    "Request Details: " + data.problemDescription + " " + `customerId = '${data.customerID}', customerAddressID = '${data.customerAddressID}', service = '${data.service}', numberOfItems = '${data.numberOfItems}', startDate = '${data.startDate}', customerHasTools = '${data.customerHasTools}'`;
  if (
    !data.customerID ||
    !data.customerAddressID ||
    !data.service ||
    !data.numberOfItems ||
    !data.problemDescription ||
    !data.startDate ||
    !data.customerHasTools
  ) {
    alert("Please fill all fields");
    return;
  }

  showLoader();
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "source": "2"
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    hideLoader();
    if (responseData.code == 200) {
      // alert(
      //   `Thanks for contacting us, Your request number is ${responseData.content.requestNo}`
      // );
      document.getElementById("reqid").textContent = responseData.content.requestNo;
      clearRequestCreateForm();
      showResponseOverlay();
      // window.location.reload();
    } else {
      alert(responseData.message);
      // window.location.reload();
      // clearRequestCreateForm();
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching data:", error);
  }
}

function showResponseOverlay() {
  document.getElementById("responseoverlay").style.display = "block";
}

document.getElementById("closeResponseoverlay").addEventListener("click", function () {
  hideResponseOverlay();
});
function hideResponseOverlay() {
  document.getElementById("responseoverlay").style.display = "none";
  window.location.reload();
}
function updateDescription() {
  if (!Description) return; // Prevent error if element not found

  let output = '';
  if (formData.name) output += currentLanguage == "en" ? `Name: ${formData.name}\n` : `اسم: ${formData.name}\n`;
  if (formData.phone) output += currentLanguage == "en" ? `Phone: ${formData.phone}\n` : `هاتف: ${formData.phone}\n`;
  if (formData.email) output += currentLanguage == "en" ? `Email: ${formData.email}\n` : `بريد إلكتروني: ${formData.email}\n`;
  if (formData.address) output += currentLanguage == "en" ? `Address: ${formData.address}\n` : `عنوان: ${formData.address}\n`;
  if (formData.service) output += currentLanguage == "en" ? `Service: ${formData.service}\n` : `خدمة: ${formData.service}\n`;
  if (formData.subservice) output += currentLanguage == "en" ? `Subservice: ${formData.subservice}\n` : `خدمة فرعية: ${formData.subservice}\n`;
  if (formData.date) output += currentLanguage == "en" ? `Date: ${formData.date}\n` : `تاريخ: ${formData.date}\n`;
  if (formData.time) output += currentLanguage == "en" ? `Time: ${formData.time}\n` : `وقت: ${formData.time}\n`;
  if (formData.neighborhood) output += currentLanguage == "en" ? `Neighborhood: ${formData.neighborhood}\n` : `حيّ: ${formData.neighborhood}\n`;
  if (formData.notes) output += currentLanguage == "en" ? `Notes: ${formData.notes}\n` : `ملحوظات: ${formData.notes}\n`;

  Description.value = output.trim();
}


async function getCities() {
  const selectElement = document.getElementById("createcity");
  const apiUrl = `${serverUrl}/api/Address/GetMaintenanceCities`;
  showLoader();
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    hideLoader();
    if (data.code == 200) {
      selectElement.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = currentLanguage == "en" ? "Select an option" : "حدد خيارًا";
      selectElement.appendChild(defaultOption);
      data.content.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.cityID;
        option.textContent = currentLanguage == "en" ? item.cityEn : item.cityAr;
        selectElement.appendChild(option);
      });
    } else {
      alert(data.message);
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching data:", error);
    selectElement.innerHTML =
      '<option value="">Failed to load options</option>';
  }
}

async function getNeighbourHoodByCityId(data) {
  const selectElement = document.getElementById("createneighborhood");
  const apiUrl = `${serverUrl}/api/Address/GetNeighbourhoodsByCity?cityid=${data}`;
  showLoader();
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    hideLoader();
    if (data.code == 200) {
      selectElement.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = currentLanguage == "en" ? "Select an option" : "حدد خيارًا";
      selectElement.appendChild(defaultOption);
      data.content.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.neighbourhoodID;
        option.textContent = currentLanguage == "en" ? item.neighbourhoodEn : item.neighbourhoodAr;
        selectElement.appendChild(option);
      });
    } else {
      alert(data.message);
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching data:", error);
    selectElement.innerHTML =
      '<option value="">Failed to load options</option>';
  }
}

async function createTimeSlots(date,neighborhoodId, serviceId) {
  const isoString = date.toISOString();
  const container = document.getElementById("timeSlots");
  const apiUrl = `${serverUrl}/api/Labor/GetAvailableTimeSlots?day=${isoString}&neighbourhoodId=${neighborhoodId}&serviceId=${serviceId}`;
  showLoader();
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    hideLoader();
    if (data.length > 0) {
      container.innerHTML = "";
      data.forEach(slot => {
        // Create radio button element
        const divContainer = document.createElement("div");
        divContainer.classList.add("time-tile");


        const radio = document.createElement("input");
        radio.type = "radio";
        radio.id = `time-${slot.startTime}`;
        radio.name = "timeSlot"; 
        radio.value = slot.startTime;

        // Create label for the radio button
        const label = document.createElement("label");
        label.htmlFor = radio.id;
        label.textContent = slot.startTimeStr;

        // Append the radio button and its label to the container
        divContainer.appendChild(radio);
        divContainer.appendChild(label);
        container.appendChild(divContainer);
      });
    }
    else {
      alert(data.message);
    }
  }
  catch (error){
    alert(error);
  }

}