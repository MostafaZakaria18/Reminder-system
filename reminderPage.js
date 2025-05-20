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

    function scheduleReminder(){
        
        var title = document.getElementById("title").value;
        var description = document.getElementById("description").value;
        var date = document.getElementById("date").value;
        var time = document.getElementById("time").value;

        var dateTimeString = date + " " + time;
        var scheduledTime = new Date(dateTimeString);
        var currentTime = new Date();
        var timeDifference = scheduledTime - currentTime;

        let categoryDisplay = categoryChecking(selectedCategories);

        var isFrequencyOn = document.getElementById("freqOn").checked;

        const selectedCheckboxes = Array.from(document.querySelectorAll("#frequencyOptions input[type='checkbox']:checked")).map(cb => cb.value);

        let dateTimeDisplay = freqCheckboxesChecking(date , time , isFrequencyOn , selectedCheckboxes);

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
        var actionCell = row.insertCell(5);

        titleCell.innerHTML = title;
        descriptionCell.innerHTML = description;
        categoryCell.innerHTML = categoryDisplay;
        dateTimeCell.innerHTML = dateTimeString;
        frequencyCell.innerHTML = isFrequencyOn? "On" : "Off";
        actionCell.innerHTML =
        '<button onclick = "deleteReminder(this);">Delete</button>';
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

}

function freqCheckboxesChecking(date , time , isFrequencyOn , selectedCheckboxes) {

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

function categoryChecking(selectedCategories) {
    return selectedCategories.length === 2 ? selectedCategories[0] + " & " + selectedCategories[1] : selectedCategories[0] || "";
}