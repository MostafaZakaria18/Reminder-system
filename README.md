# Reminder System Application

A reminder system is a driven tool designed to send prompts or notifications to individuals at predetermined times. This system aims to ensure tasks, appointments, and important dates are not forgotten.

## Authors

This project is presented and made by the following git & github contributors:

* Tarek Moustafa
* Mostafa Mahmoud
* Reham Adel
* Mohanad Khaled
* Ghadeer Mokhtar

## Table Of Content

- [Website Pages](#website-pages)
- [Features Built In Each Page](#features-built-in-each-page)
- [Coding Structure SOLID Principles](#coding-structure-solid-principles)
- [Design Pattern Of Each Page](#design-pattern-of-each-page)

## Website Pages

* Sign In
* Sign Up
* Landing Page
* Reminder Page
* Settings Page

## Features Built In Each Page

1. Sign In & Sign Up Pages:
2. Landing Page:
3. Reminder Page: This page allows user to write a title , description , choose from a category , set up date & time as well as choose a priority level (optional). The user is also allowed to delete the reminder schedule generated or edit the schedule. A push notification sound will trigger when the date and time chosen have been reached.
4. Settings Page:

## Coding Structure SOLID Principles

* Sign In & Sign Up Pages:
* Landing Page:
* Reminder Page:

Despite the fact that the code is structured well to perform the functionalities present in it and it's UI/UX is convenient and logical to users. However it violated some SOLID principles in it's coding structure such as Single Responsibility Principle (SRP) , for instance in scheduleReminder function

```
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

        if (isFrequencyOn && !selectedCheckboxes.includes("SpecificDay")) {
        scheduleRecurringReminder(title, description, selectedCheckboxes, time);
        }

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
    sortRemindersByPriority();
    clear();
        
    }
```
This function takes more than one responsibility as it validates the input , keeps checking on the frequency checkboxes and radio boxes , it sort the reminder by priority on top of adding (scheduling) the reminder.
* Settings Page:

## Design Pattern Of Each Page

* Sign In & Sign Up Pages:
* Landing Page:
* Reminder Page: A strategy pattern would be quite fitting for handling different types of frequencies while scheduling the reminder ("Daily","Weekly","Monthly","Yearly"). Each type will be handled by a different strategy function.
* Settings Page:
