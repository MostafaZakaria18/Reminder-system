    //Ask user to allow notification access
    if ("Notification" in window){
    if (Notification.permission === "default") {
        Notification.requestPermission().then(function (permission) {
            if (permission !== "granted") {
                alert("You need to allow notifications to receive reminders.");
                location.reload();
            }
        });
    } else if (Notification.permission !== "granted") {
        alert("You have blocked notifications. Please enable them in your browser settings.");
        location.reload();
    }
}

    var timeoutIds = [];

    const categoryBoxes = document.querySelectorAll(".category-box");
    let selectedCategories = [];

    categoryBoxes.forEach(box => {
    box.addEventListener("click", function () {
        const category = this.getAttribute("data-category");
        const index = selectedCategories.indexOf(category);

        if (index > -1) {
            selectedCategories.splice(index, 1);
            this.classList.remove("selected");
        } else {
            if (selectedCategories.length < 2) {
                selectedCategories.push(category);
                this.classList.add("selected");
            } else {
                alert("You can only select up to two categories.");
            }
        }
    });
});

    const priorityRadios = document.querySelectorAll("input[name='priority']"); //priority
    const clearPriority = document.getElementById("clearPriority"); //priority

    let editingRowIndex = null; //a global variable for the edit button

    function scheduleReminder(){
        
        var title = document.getElementById("title").value;
        var description = document.getElementById("description").value;
        var date = document.getElementById("date").value;
        var time = document.getElementById("time").value;
        var dateTimeString = date + " " + time;
        var scheduledTime = new Date(dateTimeString);
        var currentTime = new Date();
        var timeDifference = scheduledTime - currentTime;
        let categoryDisplay = categoryScheduling(selectedCategories);
        var isFrequencyOn = document.getElementById("freqOn").checked;
        const selectedCheckboxes = Array.from(document.querySelectorAll("#frequencyOptions input[type='checkbox']:checked")).map(cb => cb.value);
        let dateTimeDisplay = freqScheduling(date , time , isFrequencyOn , selectedCheckboxes);

        if(!validateReminderInput(title, description, selectedCategories ,date, time, isFrequencyOn, selectedCheckboxes) || !duplicationChecking(title, description, selectedCategories, date, time, isFrequencyOn, selectedCheckboxes)) {
            return;
        }

        //call the function scheduleRecurringReminder each time the frquency is toggled on and the user didn't choose specificDay choice

        if (isFrequencyOn && !selectedCheckboxes.includes("SpecificDay")) {
        scheduleRecurringReminder(title, description, selectedCheckboxes, time);
        }

        // Same case for the specificDay option 
        if (isFrequencyOn && selectedCheckboxes.includes("SpecificDay")) {
        scheduleSpecificDateReminder(title, description, date, time);
        }

       if (!isFrequencyOn || (isFrequencyOn && selectedCheckboxes.includes("SpecificDay"))) {
       if (timeDifference <= 0) {
        alert("The scheduled time is in the past!");
        return;
         }
      }

      addReminder(title, description, categoryDisplay, dateTimeDisplay , isFrequencyOn);

     if (!isFrequencyOn || (isFrequencyOn && selectedCheckboxes.includes("SpecificDay"))) {
        var timeoutId = setTimeout(function () {
        document.getElementById("notificationSound").play();
        var notification = new Notification(title, {
            body: description,
            requireInteraction: true,
        });
    }, timeDifference);
    timeoutIds.push(timeoutId);
    }

    sortRemindersByPriority();
    clear();
        
    }


    function addReminder(title, description,categoryDisplay, dateTimeString , isFrequencyOn) {
        var tableBody = document.getElementById("reminderTableBody");

        var row = tableBody.insertRow();

        var titleCell = row.insertCell(0);
        var descriptionCell = row.insertCell(1);
        var categoryCell = row.insertCell(2);
        var dateTimeCell = row.insertCell(3);
        var frequencyCell = row.insertCell(4);
        var priorityCell = row.insertCell(5); //Priority
        var action1Cell = row.insertCell(6);
        var action2Cell = row.insertCell(7);

        let priority = chosenPriorityLevel(); //Priority

        titleCell.innerHTML = title;
        descriptionCell.innerHTML = description;
        categoryCell.innerHTML = categoryDisplay;
        dateTimeCell.innerHTML = dateTimeString;
        frequencyCell.innerHTML = isFrequencyOn? "On" : "Off";
        priorityCell.innerHTML = priority ? priority : "-"; //Priority
        action1Cell.innerHTML =
        '<button onclick = "deleteReminder(this);">Delete</button>';
        action2Cell.innerHTML =
        '<button onclick="startEditingReminder(this);">Edit</button>';
    }

    function deleteReminder(button){
        var row = button.closest("tr");
        var index = row.rowIndex;

        clearTimeout(timeoutIds[index - 1]);
        timeoutIds.splice(index - 1,1);

        row.remove();
    }

    // Handle Frequency toggle
    document.getElementById("freqOn").addEventListener("change", function () {
    document.getElementById("frequencyOptions").style.display = "block";
    });

    document.getElementById("freqOff").addEventListener("change", function () {
    document.getElementById("frequencyOptions").style.display = "none";

    // Uncheck all checkboxes if frequency is off
    const checkboxes = document.querySelectorAll("#frequencyOptions input[type='checkbox']");
    checkboxes.forEach(checkbox => checkbox.checked = false);
    });

    const allDayCheckboxes = document.querySelectorAll("#frequencyOptions input[type='checkbox']");
    const specificDayCheckbox = document.getElementById("SpecificDay");
    const dateInput = document.getElementById("date");

    allDayCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const selectedDays = [...allDayCheckboxes].filter(cb => cb.checked).map(cb => cb.value);

        if (specificDayCheckbox.checked) {
            // Uncheck all others if specific day is selected
            allDayCheckboxes.forEach(cb => {
                if (cb !== specificDayCheckbox) cb.checked = false;
            });
            dateInput.disabled = false;
        } else if (selectedDays.length > 0) {
            // If other days selected, disable date input and specificDay
            specificDayCheckbox.disabled = true;
            dateInput.value = "";
            dateInput.disabled = true;
        } else {
            // Re-enable if nothing is selected
            specificDayCheckbox.disabled = false;
            dateInput.disabled = false;
        }
    });
});

function clear(){

    categoryBoxes.forEach(box => box.classList.remove("selected"));
        selectedCategories = [];
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("date").value = "";
        document.getElementById("time").value = "";
        document.getElementById("freqOff").checked = true;
        document.getElementById("frequencyOptions").style.display = "none";
        const checkboxes = document.querySelectorAll("#frequencyOptions input[type='checkbox']");
        checkboxes.forEach(cb => cb.checked = false);
        document.getElementById("date").disabled = false;
        document.getElementById("SpecificDay").disabled = false;

        const priorityRadios = document.querySelectorAll("input[name='priority']"); //Priority
        const clearPriority = document.getElementById("clearPriority"); //Priority

        priorityRadios.forEach(r => r.checked = false); //Priority
        clearPriority.checked = false; //Priority

}

function freqScheduling(date , time , isFrequencyOn , selectedCheckboxes) {

let formattedTime = new Date("1970-01-01T" + time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

if (isFrequencyOn && selectedCheckboxes.length > 0) {
        if (selectedCheckboxes.includes("SpecificDay")) {
        const d = new Date(date);
        return `${d.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })} ${formattedTime}`;
        } else if (selectedCheckboxes.length === 7) {
        return `Everyday ${formattedTime}`;
        } else {
        return selectedCheckboxes.map(day => `Every ${day}`).join(", ") + ` ${formattedTime}`;
        }
        } else {
       const d = new Date(date);
       return `${d.toLocaleDateString()} ${formattedTime}`;
       }
}

function categoryScheduling(selectedCategories) {
    return selectedCategories.length === 2 ? selectedCategories[0] + " & " + selectedCategories[1] : selectedCategories[0] || "";
}

/* Priority */
function clearPriorityOptions() {
    clearPriority.addEventListener("change", function () {
      if (clearPriority.checked === true) {
        priorityRadios.forEach(r => r.checked = false);
      }
    });

    priorityRadios.forEach(radio => {
        radio.addEventListener("change", () => {
          if (radio.checked) {
            clearPriority.checked = false;
          }
        });
      });
}
  
  function chosenPriorityLevel() {
    if (clearPriority.checked === true) return null;
  
    for (const radio of priorityRadios) {
      if (radio.checked) {
        return radio.value;
      }
    }
    return null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    clearPriorityOptions();
  });

  /* Priority */

   
  /* This is for looping around the days of the week */

  function scheduleRecurringReminder(title, description, days, time) {

    days.forEach(day => {
        triggerReminderLoop(title, description, day, time);
    });
}

/*Calculating the next recurrance of the day*/

function getNextOccurrence(dayName, time) {
        const now = new Date();
        const result = new Date();

        const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const targetDayIndex = dayOfWeek.indexOf(dayName);
        const currentDayIndex = now.getDay();

        let daysUntilNext = (targetDayIndex - currentDayIndex + 7) % 7;
        if (daysUntilNext === 0) {
            // I am Checking if today's time already passed
            const [hours, minutes] = time.split(":").map(Number);
            if (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes)) {
                daysUntilNext = 7; // scheduling next week and putting it all in the result after calculating
            }
        }

        result.setDate(now.getDate() + daysUntilNext);
        const [hours, minutes] = time.split(":").map(Number);
        result.setHours(hours, minutes, 0, 0);

        return result;
    }

    /*and use setTimout recursively*/

    function triggerReminderLoop(title, description, dayName, time) {
        const nextTime = getNextOccurrence(dayName, time);
        const now = new Date();
        const timeUntilNext = nextTime.getTime() - now.getTime();

        setTimeout(() => {
            document.getElementById("notificationSound").play();
            new Notification(title, { body: description, requireInteraction: true });

            // Schedule next one
            triggerReminderLoop(title, description, dayName, time);
        }, timeUntilNext);
    }

    //Days of the week loop end

    // This loop is a special case for yearly reminder loops

    function scheduleSpecificDateReminder(title, description, dateStr, time) {

    scheduleNext(title, description, dateStr, time);
}

function getNextYearlyOccurrence(dateStr, time) {
        const now = new Date();
        const inputDate = new Date(dateStr);
        const year = now.getFullYear();

        const target = new Date(`${year}-${(inputDate.getMonth() + 1).toString().padStart(2, '0')}-${inputDate.getDate().toString().padStart(2, '0')}T${time}`);
        
        if (target < now) {
            target.setFullYear(year + 1);
        }

        return target;
}

function scheduleNext(title, description, dateStr, time) {
        const next = getNextYearlyOccurrence(dateStr, time);
        const now = new Date();
        const delay = next - now;

        setTimeout(() => {
            document.getElementById("notificationSound").play();
            new Notification(title, { body: description, requireInteraction: true });
            scheduleNext(title, description, dateStr, time);
        }, delay);
}

// Yearly loop end

//Priority Sorting Function

const priorityOrder = {
    "Highest": 1,
    "High": 2,
    "Medium": 3,
    "Low": 4,
    "Lowest": 5,
    "-": 6
};

function sortRemindersByPriority() {
    const tableBody = document.getElementById("reminderTableBody");
    const rows = Array.from(tableBody.rows);

    // Sort rows based on the priority column
    rows.sort((a, b) => {
        const aPriority = a.cells[5].innerText.trim();
        const bPriority = b.cells[5].innerText.trim();

        const aRank = priorityOrder[aPriority] || 6;
        const bRank = priorityOrder[bPriority] || 6;

        return aRank - bRank;
    });

    rows.forEach(row => tableBody.appendChild(row));
}

//reminder validation function

function validateReminderInput(title, description, selectedCategories ,date, time, isFrequencyOn, selectedCheckboxes) {
    // Check required fields
    if (!title.trim() || !description.trim()) {
        alert("Title or description cannot be empty.");
        return false;
    }

    if (selectedCategories.length === 0) {
        alert("You must select at least one category.");
        return false;
    }

    if (!time.trim()) {
        alert("Time cannot be empty.");
        return false;
    }

    // Check date rules
    const specificDaySelected = selectedCheckboxes.includes("SpecificDay");
    if (!isFrequencyOn || (isFrequencyOn && specificDaySelected)) {
        if (!date.trim()) {
            alert("Date is required.");
            return false;
        }
    }

    return true;
}

function duplicationChecking(title, description, selectedCategories, date, time, isFrequencyOn, selectedCheckboxes){

    // Check for duplicate reminders
    const tableBody = document.getElementById("reminderTableBody");
    const rows = Array.from(tableBody.rows);
    let priority = chosenPriorityLevel() || "-";
    let categoryDisplay = categoryScheduling(selectedCategories);
    let dateTimeDisplay = freqScheduling(date, time, isFrequencyOn, selectedCheckboxes);

    for (let row of rows) {
        const [t, d, c, dt, f, p] = Array.from(row.cells).map(cell => cell.innerText.trim());

        const freqValue = isFrequencyOn ? "On" : "Off";

        if (
            t === title.trim() &&
            d === description.trim() &&
            c === categoryDisplay &&
            dt === dateTimeDisplay &&
            f === freqValue &&
            p === priority
        ) {
            alert("This reminder is already scheduled.");
            return false;
        }

        if (rows.indexOf(row) === editingRowIndex) continue;
    }

    return true;
}

//Edit Reminder Functions

//This function is to gather the data from that specific row and puts it up in the place of the inputs 
//in order for the user to start editing this function activates when you press the edit button on any row
//present in the scheduled table .

function startEditingReminder(button) {
    const row = button.closest("tr");
    editingRowIndex = row.rowIndex - 1;

    const cells = row.cells;
    const [title, description, category, datetime, freq, priority] = [
        cells[0].innerText,
        cells[1].innerText,
        cells[2].innerText,
        cells[3].innerText,
        cells[4].innerText,
        cells[5].innerText,
    ];

    // setting up the title as well as the description

    document.getElementById("title").value = title;
    document.getElementById("description").value = description;

    // Setting the category

    selectedCategories = [];
    categoryBoxes.forEach(box => {
        const cat = box.getAttribute("data-category");
        if (category.includes(cat)) {
            box.classList.add("selected");
            selectedCategories.push(cat);
        } else {
            box.classList.remove("selected");
        }
    });

    // Setting the datetime

    if (freq === "On") {
        document.getElementById("freqOn").checked = true;
        document.getElementById("frequencyOptions").style.display = "block";

        const checkboxes = document.querySelectorAll("#frequencyOptions input[type='checkbox']");
        checkboxes.forEach(cb => {
            if (datetime.includes(cb.value)) {
                cb.checked = true;
            } else {
                cb.checked = false;
            }
        });

        if (datetime.match(/\d{1,2}\s+\w+/)) {
            // Specific day condition setting

            document.getElementById("SpecificDay").checked = true;
            const dateParts = datetime.split(" ");
            const monthName = dateParts[1];
            const day = dateParts[0];
            const date = new Date();
            date.setDate(parseInt(day));
            date.setMonth(new Date(Date.parse(monthName + " 1, 2000")).getMonth());
            document.getElementById("date").valueAsDate = date;
        }

    } else {
        document.getElementById("freqOff").checked = true;
        document.getElementById("frequencyOptions").style.display = "none";
        const checkboxes = document.querySelectorAll("#frequencyOptions input[type='checkbox']");
        checkboxes.forEach(cb => cb.checked = false);

        const parsedDate = new Date(datetime);
        if (!isNaN(parsedDate)) {
       // Set the value only if the date is valid
       document.getElementById("date").value = parsedDate.toISOString().split("T")[0];
       } else {
       console.warn("Invalid datetime format:", datetime);
       document.getElementById("date").value = ""; // or handle gracefully
       }
    }

    const time = datetime.match(/\d{1,2}:\d{2}/);
    if (time) {
        document.getElementById("time").value = time[0];
    }

    // Set the priority level

    if (priority !== "-") {
        priorityRadios.forEach(r => {
            r.checked = (r.value === priority);
        });
        clearPriority.checked = false;
    } else {
        priorityRadios.forEach(r => r.checked = false);
        clearPriority.checked = true;
    }

    // Hide my schedule reminder button and show up the edit reminder button instead

    document.getElementById("scheduleReminderBtn").style.display = "none";
    document.getElementById("editReminderBtn").style.display = "inline-block";

    //hiding action 1 and 2 columns

    const table = document.getElementById("reminderTableBody").parentElement;
    for (let row of table.rows) {
    if (row.cells[6]) row.cells[6].style.display = "none";
    if (row.cells[7]) row.cells[7].style.display = "none";
    }
}

//This is the actual editing function which will then update that specific row with the editing of the reminder
//activates when the user finishes editing and presses the shown up Edit Reminder button

function editReminder() {
    if (editingRowIndex === null) return;

    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var isFrequencyOn = document.getElementById("freqOn").checked;
    const selectedCheckboxes = Array.from(document.querySelectorAll("#frequencyOptions input[type='checkbox']:checked")).map(cb => cb.value);
    const scheduledTime = new Date(date + " " + time);
    const currentTime = new Date();
    const timeDifference = scheduledTime - currentTime;


    if (!validateReminderInput(title, description, selectedCategories, date, time, isFrequencyOn, selectedCheckboxes) || !duplicationChecking(title, description, selectedCategories, date, time, isFrequencyOn, selectedCheckboxes)) {
        return;
    }

    if (isFrequencyOn && !selectedCheckboxes.includes("SpecificDay")) {
        scheduleRecurringReminder(title, description, selectedCheckboxes, time);
    } else if (isFrequencyOn && selectedCheckboxes.includes("SpecificDay")) {
        scheduleSpecificDateReminder(title, description, date, time);
    } else {
        if (timeDifference > 0) {
            const timeoutId = setTimeout(function () {
                document.getElementById("notificationSound").play();
                new Notification(title, {
                    body: description,
                    requireInteraction: true,
                });
            }, timeDifference);
            timeoutIds[editingRowIndex] = timeoutId;
        } else {
            alert("The scheduled time is in the past!");
        }
    }

    let categoryDisplay = categoryScheduling(selectedCategories);
    let dateTimeDisplay = freqScheduling(date , time , isFrequencyOn , selectedCheckboxes);
    let priority = chosenPriorityLevel() || "-";

    const row = document.getElementById("reminderTableBody").rows[editingRowIndex];

    row.cells[0].innerText = title;
    row.cells[1].innerText = description;
    row.cells[2].innerText = categoryDisplay;
    row.cells[3].innerText = dateTimeDisplay;
    row.cells[4].innerText = isFrequencyOn ? "On" : "Off";
    row.cells[5].innerText = priority;

    sortRemindersByPriority();
    clear();

    //hide back the edit reminder button and show up the schedule reminder button once again as well as
    //resetting the editing row index.

    editingRowIndex = null;
    document.getElementById("scheduleReminderBtn").style.display = "inline-block";
    document.getElementById("editReminderBtn").style.display = "none";

    //shows up action 1 and action 2 columns once again

    const table = document.getElementById("reminderTableBody").parentElement;
    for (let row of table.rows) {
    if (row.cells[6]) row.cells[6].style.display = "";
    if (row.cells[7]) row.cells[7].style.display = "";

}
}