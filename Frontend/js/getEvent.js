// Fetch data from events.json file
fetch("../data/events.json")
  .then((res) => res.json())
  .then((res) => {
    let cardContainer = document.getElementsByClassName("card-container")[0];
    for (let data in res) {

      // For Adding logo In the Center Of Card 
      let Logodiv = document.createElement("div");
      Logodiv.className = "event_logo"
      let logo = document.createElement('img');
      logo.className = "img-fluid mb-3";
      logo.src = `../data/EventLogo/${res[data].img}`;
      Logodiv.appendChild(logo);
      Logodiv.style.maxWidth = "100px";
      Logodiv.style.maxHeight = "100px";



      let emptyDiv = document.createElement("div");

      let cardBg = document.createElement('div');
      cardBg.className = 'event_card_bg'

      emptyDiv.className = "empty_div";
      let eventCard = document.createElement("div");
      eventCard.className = "event_card event_card_new";

      let leaf = document.createElement('img');
      leaf.className = "event_details_bg";
      leaf.src = `../data/icons/leaf.png`;

      eventCard.appendChild(Logodiv);
      let eventDetails = document.createElement("div");
      eventDetails.className = "event_details"

      let eventTitle = document.createElement("div");
      let heading = document.createElement("h3");
      heading.innerText = res[data].title;
      heading.className = "event_title";
      eventTitle.appendChild(heading);

      let eventDate = document.createElement("div");
      eventDate.className = 'event_date'

      let calendarIcon_1 = document.createElement('img');
      calendarIcon_1.className = "icon ";
      calendarIcon_1.src = `../data/icons/calendar.png`;

      let calendarIcon_2 = document.createElement('img');
      calendarIcon_2.className = "icon";
      calendarIcon_2.src = `../data/icons/calendar.png`;

      let startDate = document.createElement("span");
      startDate.className = "date_start";
      let startDatePtag = document.createElement('p')
      startDatePtag.className = 'date_p'
      startDatePtag.innerHTML = `Starts: ${res[data].start}`;
      startDate.append(calendarIcon_1, startDatePtag);

      let endDate = document.createElement("span");
      endDate.className = "date_end";
      let endDatePtag = document.createElement('p')
      endDatePtag.innerHTML = `Ends: ${res[data].end}`;
      endDate.append(calendarIcon_2, endDatePtag)

      eventDate.append(startDate,endDate)
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

      let organisation_icon = document.createElement('img');
      organisation_icon.className = "icon";
      organisation_icon.src = `../data/icons/organisation.png`;

      let organisationMain = document.createElement('div')
      organisationMain.className = 'organisation_main'

      let organisation = document.createElement("p");
      organisation.className = "event_organisation";
      organisation.innerHTML = `<b>Organisation: ${res[data].organisation}`;
      
      organisationMain.append(organisation_icon, organisation)

      let loc = document.createElement("h5");
      let eventStatus = res[data].location;
      
      setEventStatus();
      loc.innerText = eventStatus;
      eventDetails.append(eventTitle, eventDate, eventLink, organisationMain);
      eventCard.append(eventDetails, leaf);
      emptyDiv.appendChild(eventCard, cardBg);
      cardContainer.appendChild(emptyDiv);

      //function to set the status of event
      function setEventStatus() {
        let endDate = res[data].end.split("/", 3);
        endDate = `${endDate[1]}/${endDate[0]}/${endDate[2]}`;
        endDate = new Date(endDate);
        if (new Date() > endDate) {
          eventStatus = "Offline";
          loc.className = "locationOffline";
        } else if (new Date() < endDate) {
          eventStatus = "Online";
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
  let elements = cardContainer.getElementsByClassName('no_result');
  while (elements[0])
    elements[0].parentNode.removeChild(elements[0])
  // ends

  let eventList = document.querySelectorAll('.empty_div');
  let eventCount = eventList.length;
  Array.from(eventList).forEach(eventItem => {
    eventItem.style.display = 'block';
  });

  let searchTerm = search.value.toLowerCase();
  filterBySearchTerm(searchTerm, eventList, 1);

  let reqStatus = eventStatusFilterElement.value.toLowerCase();
  filterByStatus(reqStatus, eventList);

  let rangeStart = eventRangeStartElement.valueAsDate;
  let rangeEnd = eventRangeEndElement.valueAsDate;
  console.log(rangeStart, rangeEnd)
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
      // console.log(eventTitle);
      suggestions.push(eventTitle);
    });

    let emptyArray = [];
    if (userData) {
      icon.onclick = () => {

      }
      emptyArray = suggestions.filter((data) => {
        //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
        return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
      });
      emptyArray = emptyArray.map((data) => {
        // passing return data inside li tag
        return data = '<li>' + data + '</li>';
      });
      searchWrapper.classList.add("active"); //show autocomplete box
      showSuggestions(emptyArray);
      let allList = suggBox.querySelectorAll("li");
      for (let i = 0; i < allList.length; i++) {
        //adding onclick attribute in all li tag
        allList[i].setAttribute("onclick", "select(this)");
      }
    } else {
      searchWrapper.classList.remove("active"); //hide autocomplete box
    }
  }

  Array.from(eventList).forEach(eventItem => {

    let eventTitle = eventItem.querySelector('.event_title').innerText.toLowerCase()

    if (eventTitle.indexOf(searchTerm) == -1) {
      eventItem.style.display = 'none';
    }
  });
}
function select(element) {
  let selectData = element.textContent;
  search.value = selectData.toUpperCase();
  icon.onclick = () => {

  }
  searchWrapper.classList.remove("active");
  let eventList = document.querySelectorAll('.empty_div');
  let searchTerm = search.value.toLowerCase();
  filterBySearchTerm(searchTerm, eventList, 0);
}

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    let userValue = search.value;
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

// Filter by Range
function filterByRange(rangeStart, rangeEnd, eventList) {
  Array.from(eventList).forEach(eventItem => {

    let startDate = eventItem.querySelector('.date').innerText.split(":", 2)[1];
    let endDate = eventItem.querySelector('.date').innerText.split(":", 2)[1];

    startDate = startDate.split("/", 3);
    startDate = `${startDate[1]}/${startDate[0]}/${startDate[2]}`;
    startDate = new Date(startDate);

    endDate = endDate.split("/", 3);
    endDate = `${endDate[1]}/${endDate[0]}/${endDate[2]}`;
    endDate = new Date(endDate);

    if (!(startDate.getDate() >= rangeStart.getDate() && startDate.getDate() < rangeEnd.getDate() && endDate.getDate() >= rangeStart.getDate() && endDate.getDate() <= rangeEnd.getDate())) {
      eventItem.style.display = 'none';
    }
  });
}

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
