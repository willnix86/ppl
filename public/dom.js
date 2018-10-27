const DOM = (function() {

    return {

        loadUserPage: function() {
            $('main').append(`
            <div class="user__header">
                <h2 class="js-user user__title"></h2>
            </div>
            
            <section role="region" class="col-6">
                <img class="person__img" src="images/person.png" alt="icon of a magnifying glass centered on a person">
                <button class="people-section">My People</button>
                <ul class="js-people"></ul>
                <form class="new-person-form" name="new-person">
                    <label for="person-first-name">First Name:</label>
                    <input type="text" id="person-first-name" name="person-first-name" placeholder="e.g Sam" required>
                    <label for="person-last-name">Last Name:</label>
                    <input type="text" id="person-last-name" name="person-last-name" placeholder="e.g Smith" required>
                    <label for="submit-person"></label>
                    <button id="submit-person" name="submit-person">Submit</button>
                </form>
            </section>

            <section role="region" class="col-6">
                <img class="meetings__img" src="images/meetings.png" alt="icon of a calendar">
                <button class="meetings-section">My Meetings</button>
                <ul class="js-meetings"></ul>
            </section>
            `);
        },

        displayUserData: function(data) {

            $('.js-user').text(`${data.user.firstName} ${data.user.lastName}`);

            $('main').data('userId', data.user.id);

            for (index in data.people) {
                $('.js-people').append(
                    `<li class="people-item">
                    <p class="people-name">${data.people[index].firstName} ${data.people[index].lastName}</p>
                    <button id=${data.people[index].id} class='person'>${data.people[index].firstName}'s Profile</button></li>`
                )
            };

            $('.js-people').append(`<button class="new-person">Add New Person</button>`);

            for (index in data.meetings) {

                let date = new Date(data.meetings[index].date);

                let dateStr = DOM.formatDate(date);

                let timeStr = DOM.formatTime(date);

                $('.js-meetings').append(
                    `<li id=${data.meetings[index]._id} class="meeting-item">
                    <p class="date-string">${dateStr}</p>
                    <p class="time-string">${timeStr}</p>
                    <p class="person-name">${data.meetings[index].person.firstName} ${data.meetings[index].person.lastName}</p>
                    <button class="edit meeting-edit"><i class="fas fa-edit"></i></button>
                    <button class="delete meeting-delete"><i class="fas fa-times-circle"></i></button>
                </li>
                    `
                )
            };
        },

        loadPeoplePage: function(personName) {
            $('main').append(`
                <div class="person__header">
                    <h2 class="js-person person__title">${personName}</h2>
                    <button id="back" name="back">Back</button>
                </div>

                <section role="region" class="col-4">
                    <img class="notes__img" src="images/notes.png" alt="icon of a sheet of paper with writing and a pencil">
                    <button class="notes-section">Notes</button>
                    <ul class="js-notes"></ul>
                    <form class="new-notes-form" name="new-note">
                            <label for="content">Note:</label>
                            <input type="text" id="content" name="content" required>
                            <button type="button" id="submit-note" name="submit-note">Add Note</button>
                    </form>
                </section>

                <section role="region" class="col-4">
                    <img class="goals__img" src="images/goals.png" alt="icon of a target with an arrow in the bullseye">
                    <button class="goals-section">Goals</button>
                    <ul class="js-goals"></ul>
                    <form class="new-goals-form" name="new-goal">
                            <label for="goal">Goal:</label>
                            <input type="text" id="goal" name="goal" required>
                            <label for="complete-by">Complete by:</label>
                            <input type="date" id="complete-by" name="complete-by" required>
                            <label for="submit-goal"></label>
                            <button type="button" id="submit-goal" name="submit-goal">Add Goal</button>
                    </form>

                </section>

                <section role="region" class="col-4">
                    <img class="meetings__img" src="images/meetings.png" alt="icon of a calendar">
                    <button class="meetings-section-people">Meetings</button>
                    <ul class="js-meetings-people"></ul>
                    <form class="new-meetings-form" name="new-meetings">
                            <label for="meeting-date">When:</label>
                            <input type="date" id="meeting-date" name="meeting-date" required>
                            <label for="meeting-time">What time:</label>
                            <input type="time" id="meeting-time" name="meeting-time" min="9:00" max="18:00" required>
                            <label for="submit-meeting"></label>
                            <button type="button" id="submit-meeting" name="submit-meeting">Add Meeting</button>
                    </form>
                </section>

                <div class="col-12 delete-person-container">
                    <label for="delete-person">
                    <button type="button" id="delete-person" name="delete-person">Delete ${personName}</button>
                </div>
                <div class="col-12 confirm-delete-person-container">
                    <label for="confirm-delete">
                    <button type="button" id="confirm-delete-person" name="confirm-delete">Confirm</button>
                    <label for="cancel-delete">
                    <button type="button" id="cancel-delete" name="cancel-delete">Cancel</button>
                </div>
            `);
        },

        displayPersonData: function(data) {

            $('.js-person').text(`${data.firstName} ${data.lastName}`);

            for (index in data.meetings) {

                let date = new Date(data.meetings[index].date);

                let dateStr = DOM.formatDate(date);

                let timeStr = DOM.formatTime(date);

                $('.js-meetings-people').append(
                    `<li id=${data.meetings[index]._id} class="meeting-item">
                    <p class="date-string">${dateStr}</p>
                    <p class="time-string">${timeStr}</p>
                    <p class="user-name">${data.meetings[index].host.firstName} ${data.meetings[index].host.lastName}</p>
                    <button class="edit meeting-edit"><i class="fas fa-edit"></i></button><button class="delete meeting-delete"><i class="fas fa-times-circle"></i></button>
                    </li>`
                )
            }

            $('.js-meetings-people').append(`<button class="new-meeting">Add New Meeting</button>`);

            let goalsArr = data.goals;

            let sortedGoals = DOM.sortByKeyDsc(goalsArr, 'completeBy');

            for (index in sortedGoals) {

                let date = new Date(sortedGoals[index].completeBy)

                let dateStr = DOM.formatDate(date);

                $('.js-goals').append(
                    `<li id=${data.goals[index]._id} class="goal-item">
                    <p class="goal">${sortedGoals[index].goal}</p>
                    <p class="completeBy">Complete by: <span class="date-string">${dateStr}</span></p>
                    <button class="goal-complete"><i class="fas fa-check"></i></button>
                    <button class="edit goal-edit"><i class="fas fa-edit"></i></button><button class="delete goal-delete"><i class="fas fa-times-circle"></i></button>
                    </li>`)

                if (data.goals[index].completed) {
                    $(`#${data.goals[index]._id}`).addClass('completed');
                    $(`#${data.goals[index]._id}`).children('button').addClass('completed');
                }

            };

            $('.js-goals').append(`<button class="new-goal">Add New Goal</button>`);

            let notesArr = data.notes;

            let sortedNotes = DOM.sortByKeyDsc(notesArr, 'createdAt');

            for (index in sortedNotes) {
                let date = new Date(sortedNotes[index].createdAt);
                let dateStr = DOM.formatDate(date);

                $('.js-notes').append(`<li id=${data.notes[index]._id} class="note-item">
                <p class='note-content'>${sortedNotes[index].content}</p>
                <p class="createdAt">${dateStr}</p>
                <button class="edit note-edit"><i class="fas fa-edit"></i></button><button class="delete note-delete"><i class="fas fa-times-circle"></i></button>
                </li>`)
            };

            $('.js-notes').append(`<button class="new-note">Add New Note</button>`);

        },

        resetPeoplePage: function() {
            $('.js-meetings-people').empty();
            $('.js-goals').empty();
            $('.js-files').empty();
            $('.js-notes').empty();
        },

        resetUserPage: function() {
            $('.js-meetings').empty();
            $('.js-people').empty();
        },

        formatDate(date) {
            const monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            const day = date.getDate();
            const monthIndex = date.getMonth();
            const year = date.getFullYear();
            
            return `${day} ${monthNames[monthIndex]} ${year}`;
        },

        formatTime(date) {
            const hour = date.getHours();
            const minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();

            return `${hour}:${minutes}`;
        },

        resetForm: function(form) {
            $(form).find('input[type=text], input[type=password], input[type=date], input[type=time], input[type=file], select, textarea').val('');
            $(form).find('input[type=radio], input[type=checkbox]').removeAttr('checked').removeAttr('selected');
        },

        resetPpl: function() {
            $('main').empty();
            $('main').append(`
            <div class="main__no-account">
                    <p>Don't have an account?</p>
                    <button name="signup-form" id="signup-form">Sign Up</button>
            </div>
            <div class="main__account">
                    <p>Already have an account?</p>
                    <button name="signup-form" id="signup-form">Log In</button>
            </div>
            <div role="alert" class="alert"></div>
            `);
        },

        sortByKeyAsc: function(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },

        sortByKeyDsc: function(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
        },

        getUserId: function() {
            return $('main').attr('id');
        },

        getPersonId: function() {
            return $('main').attr('class');
        }

    }
})();