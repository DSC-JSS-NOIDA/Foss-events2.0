// Fetch data from events.json file
fetch("../data/events.json")
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    let cardContainer = document.getElementsByClassName("card-container")[0];
    for (let data in res) {
      console.log(res[data]);
      // For Adding logo In the Center Of Card 
      let Logodiv = document.createElement("div");
      let logo = document.createElement('img');
      logo.className = "img-fluid mb-3";
      logo.src = `../data/EventLogo/${res[data].img}`;
      Logodiv.appendChild(logo);
      Logodiv.style.maxWidth = "100px";
      Logodiv.style.maxHeight = "100px";



      let emptyDiv = document.createElement("div");
      emptyDiv.className = "empty_div";
      let eventCard = document.createElement("div");
      eventCard.className = "event_card";
      eventCard.appendChild(Logodiv);
      let eventTitle = document.createElement("div");
      let heading = document.createElement("h3");
      heading.innerText = res[data].title;
      heading.className = "event_title";
      eventTitle.appendChild(heading);
      let startDate = document.createElement("span");
      startDate.className = "startdate";
      startDate.innerHTML = `Starts: ${res[data].start}`;
      let endDate = document.createElement("span");
      endDate.className = "enddate";
      endDate.innerHTML = `Ends: ${res[data].end}`;
      let eventDetails = document.createElement("div");
      eventDetails.className = "event_details";
      let eventLink = document.createElement("a");
      Object.assign(eventLink, {
        href: `https://${res[data].website}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "btn btn-primary link btn-more",
      });
      let link = document.createElement("h6");
      link.innerText = "More Info";
      eventLink.appendChild(link);
      let organisation = document.createElement("p");
      organisation.className = "event_organisation";
      organisation.innerHTML = `<b>Organisation: ${res[data].organisation}`;
      let loc = document.createElement("h5");
      let eventStatus = res[data].location;
      setEventStatus();
      loc.innerText = eventStatus;
      eventDetails.append(startDate, endDate, organisation, loc, eventLink);
      eventCard.append(eventTitle, eventDetails);
      emptyDiv.appendChild(eventCard);
     // console.log(emptyDiv);
      cardContainer.appendChild(emptyDiv);
      // console.log(cardContainer[0]);

      //function to set the status of event
      function setEventStatus() {
        let endDate = res[data].end.split("/", 3);
        endDate = `${endDate[1]}/${endDate[0]}/${endDate[2]}`;
        endDate = new Date(endDate);
        if (new Date() > endDate) {
          eventStatus = "Offline";
          loc.className = "locationOffline";
        } else {
          loc.className = "locationOnline";
        }
      }
    }
  });


// Filters for Events

// Search Filter Element
const searchWrapper = document.querySelector(".search-input");
const search = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector("i");
search.addEventListener('keyup', applyFilter);

// Event Status Filter Element
let eventStatusFilterElement = document.querySelector('#event-status-filter');
eventStatusFilterElement.addEventListener('change', applyFilter);

// Event Range Start Element
let eventRangeStartElement = document.getElementById("range-start");
eventRangeStartElement.addEventListener('change', applyFilter);

let eventRangeEndElement = document.getElementById("range-end");
eventRangeEndElement.addEventListener('change', applyFilter);

// Filter Event Function
function applyFilter() {

  // To remove all class of no_result
  let cardContainer = document.getElementsByClassName("card-container")[0];
  console.log(cardContainer);
  let elements = cardContainer.getElementsByClassName('no_result');
  while (elements[0])
    elements[0].parentNode.removeChild(elements[0])
  // ends

  let eventList = document.querySelectorAll('.empty_div');
  console.log(eventList);
  let eventCount = eventList.length;
  Array.from(eventList).forEach(eventItem => {
    eventItem.style.display = 'block';
  });

  let searchTerm = search.value.toLowerCase();
  console.log(searchTerm);
  filterBySearchTerm(searchTerm, eventList, 1);

  let reqStatus = eventStatusFilterElement.value.toLowerCase();
  filterByStatus(reqStatus, eventList);

  let rangeStart = eventRangeStartElement.valueAsDate;
  console.log(rangeStart);
  let rangeEnd = eventRangeEndElement.valueAsDate;
  console.log(rangeStart, rangeEnd)
  if(rangeStart && rangeEnd)
    filterByRange(rangeStart, rangeEnd, eventList)

  //Display no result message
  Array.from(eventList).forEach(eventItem => {
    if (eventItem.style.display == 'none') {
      eventCount--;
    }
  });
  if (eventCount == 0) {
    let cardContainer = document.getElementsByClassName("card-container")[0];
    let noResult = document.createElement("div");
    noResult.className = "no_result";
    let heading = document.createElement("h3");
    heading.innerText = "Sorry 😞 ! No Event found 🔍";
    noResult.appendChild(heading);
    cardContainer.appendChild(noResult);
  }
  //Display message ends
}

// Filter by Search Term
function filterBySearchTerm(searchTerm, eventList, check) {
  if (check == 1) {
    let userData = searchTerm; //user enetered data
    let suggestions = [];
    Array.from(eventList).forEach(eventItem => {
      let eventTitle = eventItem.querySelector('.event_title').innerText.toLowerCase();
      console.log(eventTitle);
      suggestions.push(eventTitle);
    });

    let emptyArray = [];
    if (userData) {
      icon.onclick = () => {
      emptyArray = suggestions.filter((data) => {
        //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
        console.log(data)
        return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
      });
      emptyArray = emptyArray.map((data) => {
        // passing return data inside li tag
        return data = '<li>' + data + '</li>';
      });
      searchWrapper.classList.add("active"); //show autocomplete box
      console.log(emptyArray);
      showSuggestions(emptyArray);
      let allList = suggBox.querySelectorAll("li");
      for (let i = 0; i < allList.length; i++) {
        //adding onclick attribute in all li tag
        allList[i].setAttribute("onclick", "select(this)");
      }
      }
    } else {
      searchWrapper.classList.remove("active"); //hide autocomplete box
    }
  }

  Array.from(eventList).forEach(eventItem => {

    let eventTitle = eventItem.querySelector('.event_title').innerText.toLowerCase()
    console.log(eventTitle.indexOf(searchTerm));

    if (eventTitle.indexOf(searchTerm) == -1) {
      eventItem.style.display = 'none';
    }
  });
}
function select(element) {
  let selectData = element.textContent;
  search.value = selectData.toUpperCase();
  icon.onclick = () => {
  searchWrapper.classList.remove("active");
  let eventList = document.querySelectorAll('.empty_div');
  let searchTerm = search.value.toLowerCase();
  filterBySearchTerm(searchTerm, eventList, 0);
  }
}

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    userValue = search.value;
    listData = '<li>' + userValue + '</li>';
  } else {
    listData = list.join('');
  }
  suggBox.innerHTML = listData;
}

// Filter by Status
function filterByStatus(reqStatus, eventList) {
  let notReqClass = '';
  if (reqStatus == 'online') {
    notReqClass = '.locationOffline'
  }
  else if (reqStatus == 'offline') {
    notReqClass = '.locationOnline'
  }
  else {
    return;
  }

  Array.from(eventList).forEach(eventItem => {

    let currentEventStatus = eventItem.querySelector(notReqClass)

    if (currentEventStatus) {
      eventItem.style.display = 'none';
    }

  });
}
//filterByRange
function filterByRange(startDate, endDate, eventList) {
  Array.from(eventList).forEach(eventItem => {
    // console.log(eventItem);
    // console.log(startDate); 
    const eventStartDateString = eventItem.querySelector('.startdate').textContent;
    // console.log(eventStartDateString);
    const ds = eventStartDateString.slice(eventStartDateString.indexOf(":") + 2);
    const eventEndDateString = eventItem.querySelector('.enddate').textContent;
    const de = eventEndDateString.slice(eventEndDateString.indexOf(":") + 2);
    // console.log(ds,de)
    // console.log(eventEndDateString);
    // Parse the date strings with the correct format
    const eventStartDate = stringtoDate(ds);
    const eventEndDate = stringtoDate(de);

    const esd = new Date(eventStartDate);
    const eed = new Date(eventEndDate);
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    // console.log(esd,eed,sd,Endevent);
    // Check if the event falls within the specified date range
    if (sd && ed) {
      if (esd < sd || eed > ed) {
        eventItem.style.display = 'none';
      }
    } else if (sd) {
      if (esd < sd) {
        eventItem.style.display = 'none';
      }
    } else if (ed) {
      if (eed > ed) {
        eventItem.style.display = 'none';
      }
    }
  });
}


function stringtoDate(dateString){
  const parts = dateString.split('/'); // Split the string by '/' to get day, month, and year

  if (parts.length === 3) {
    const day = parseInt(parts[0], 10); // Parse day as an integer
    const month = parseInt(parts[1], 10) - 1; // Parse month as an integer (subtract 1 since months are zero-based)
    const year = parseInt(parts[2], 10);
  
    // Create a JavaScript Date object
    const date = new Date(year, month, day);
  
    return date // Output: Wed Oct 26 2023 00:00:00 GMT+0530 (India Standard Time)
  } else {
    console.error("Invalid date format");
  }
}

// function convertdate(startdate){
//   // Parse the date string into a Date object
//   const date = new Date(startdate);

//   // Extract day, month, and year
//   const day = date.getDate();
//   const month = date.getMonth() + 1; // Months are zero-based, so add 1
//   const year = date.getFullYear();

//   // Ensure leading zeros for day and month if needed
//   const formattedDay = day < 10 ? `0${day}` : day;
//   const formattedMonth = month < 10 ? `0${month}` : month;

//   // Create the "dd/mm/yyyy" format
//   const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
//   return formattedDate;
// }

// // Function to parse date strings in "dd/mm/yyyy" format
// function parseDate(dateString) {
//   const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
//   if (isNaN(day) || isNaN(month) || isNaN(year)) {
//     // Invalid date format, return null
//     return null;
//   }
//   return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
// }



//Scroll to top
const Top = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 200) {
    Top.classList.add("active");
  } else {
    Top.classList.remove("active");
  }
});

window.addEventListener("DOMContentLoaded", function () {
  // get the form elements defined in your form HTML above
  var form = document.getElementById("my-form");
  var name = document.getElementById("validationCustom01");
  var email = document.getElementById("validationCustom02");
  var message = document.getElementById("validationCustom03");
  // var button = document.getElementById("my-form-button");
  var status = document.getElementById("status");
  // Success and Error functions for after the form is submitted

  function success() {
    status.classList.remove("error");
    status.classList.remove("success");
    form.value = '';
    name.value = '';
    email.value = '';
    message.value = '';
    status.classList.add("success");
    status.innerHTML = "Thanks!Your message is submitted successfully";
  }

  function error() {
    status.classList.remove("error");
    status.classList.remove("success");
    status.classList.add("error");
    status.innerHTML = "Oops! There was a problem.";
  }

  // handle the form submission event

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var data = new FormData(form);
    ajax(form.method, form.action, data, success, error);
  });
});

// helper function for sending an AJAX request

function ajax(method, url, data, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      success(xhr.response, xhr.responseType);
    } else {
      error(xhr.status, xhr.response, xhr.responseType);
    }
  };
  xhr.send(data);
}
