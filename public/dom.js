const DOM = (function() {

    return {

        loadUserPage: function() {
            $('main').append(`
            <header>
                <h1>User Admin Page</h1>
                <h2 class="js-user"></h2>
            </header>

            <section role="region">
                <h3 class="meetings-section">Meetings</h3>
                <ul class="js-meetings"></ul>
            </section>
            
            <section role="region">
                <h3 class="people-section">People</h3>
                <ul class="js-people"></ul>
                <form class="new-person-form" name="new-person">
                    <label for="person-first-name">First Name:</label>
                    <input type="text" id="person-first-name" name="person-first-name" placeholder="e.g Sam" required>
                    <label for="person-last-name">Last Name:</label>
                    <input type="text" id="person-last-name" name="person-last-name" placeholder="e.g Smith" required>
                    <label for="submit-person"></label>
                    <input type="button" id="submit-person" name="submit-person" value="Submit">
                </form>
            </section>
            `);
        },

        displayUserData: function(data) {

            $('.js-user').text(`${data.user.firstName} ${data.user.lastName}`);

            $('main').attr('id', data.user.id);

            for (index in data.people) {
                $('.js-people').append(
                    `<li class="people-item"><button id=${data.people[index].id} class='person'>
                    ${data.people[index].firstName} ${data.people[index].lastName}</button><li>`
                )
            };

            $('.js-people').append(`<button class="new-person">Add New Person</button>`);

            for (index in data.meetings) {

                let date = new Date(data.meetings[index].date);

                let dateStr = DOM.formatDate(date);

                let timeStr = DOM.formatTime(date);

                $('.js-meetings').append(
                    `<li id=${data.meetings[index]._id} class="meeting-item">
                    Meeting with <span class="person-name">${data.meetings[index].person.firstName} ${data.meetings[index].person.lastName}</span> on <span class="date-string">${dateStr}</span> at <span class="time-string">${timeStr}</span>
                    <button class="edit meeting-edit"><i class="fas fa-edit"></i></button>
                    <button class="delete meeting-delete"><i class="fas fa-times-circle"></i></button>
                    <form class="edit-meetings-form" name="edit-meetings">
                        <label for="edit-meeting-date">When:</label>
                        <input type="date" id="edit-meeting-date" name="edit-meeting-date">
                        <label for="edit-meeting-time">What time:</label>
                        <input type="time" id="edit-meeting-time" name="edit-meeting-time" min="9:00" max="18:00">
                        <label for="submit-meeting-edit"></label>
                        <input type="button" id="submit-meeting-edit" name="submit-meeting-edit" value="Ok">
                </form>
                </li>
                    `
                )
            };
        },

        loadPeoplePage: function(personName, personId) {
            $('main').append(`
                <header>
                    <h1>Individual Profile Page</h1>
                    <h2 class="js-person">${personName}</h2>
                    <button class="back">Back</button>
                </header>

                <section role="region">
                    <h3 class="notes-section">Notes</h3>
                    <ul class="js-notes"></ul>
                    <form class="new-notes-form" name="new-note">
                            <label for="content">Note:</label>
                            <input type="text" id="content" name="content" required>
                            <input type="button" id="submit-note" name="submit-note" value="Add Note">
                    </form>
                </section>

                <section role="region">
                    <h3 class="goals-section">Goals</h3>
                    <ul class="js-goals"></ul>
                    <form class="new-goals-form" name="new-goal">
                            <label for="goal">Goal:</label>
                            <input type="text" id="goal" name="goal" required>
                            <label for="complete-by">Complete by:</label>
                            <input type="date" id="complete-by" name="complete-by" required>
                            <label for="submit-goal"></label>
                            <input type="button" id="submit-goal" name="submit-goal" value="Add Goal">
                    </form>

                </section>

                <section role="region">
                    <h3 class="meetings-section-people">Meetings</h3>
                    <ul class="js-meetings-people"></ul>
                    <form class="new-meetings-form" name="new-meetings">
                            <label for="meeting-date">When:</label>
                            <input type="date" id="meeting-date" name="meeting-date" required>
                            <label for="meeting-time">What time:</label>
                            <input type="time" id="meeting-time" name="meeting-time" min="9:00" max="18:00" required>
                            <label for="submit-meeting"></label>
                            <input type="button" id="submit-meeting" name="submit-meeting-" value="Add Meeting">
                    </form>
                </section>
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
                    Meeting with <span class="user-name">${data.meetings[index].host.firstName} ${data.meetings[index].host.lastName}</span> on <span class="date-string">${dateStr}</span> at <span class="time-string">${timeStr}</span>
                    <button class="edit meeting-edit"><i class="fas fa-edit"></i></button><button class="delete meeting-delete"><i class="fas fa-times-circle"></i></button>
                    <form class="edit-meetings-form" name="edit-meetings">
                        <label for="edit-meeting-date">When:</label>
                        <input type="date" id="edit-meeting-date" name="edit-meeting-date">
                        <label for="edit-meeting-time">What time:</label>
                        <input type="time" id="edit-meeting-time" name="edit-meeting-time" min="9:00" max="18:00">
                        <label for="submit-meeting-edit"></label>
                        <input type="button" id="submit-meeting-edit" name="submit-meeting-edit" value="Ok">
                    </form></li>
                    `
                )
            }

            $('.js-meetings-people').append(`<button class="new-meeting">Add New Meeting</button>`);

            let goalsArr = data.goals;

            let sortedGoals = DOM.sortByKeyAsc(goalsArr, 'completeBy');

            for (index in sortedGoals) {

                let date = new Date(sortedGoals[index].completeBy)

                let dateStr = DOM.formatDate(date);

                $('.js-goals').append(
                    `<li id=${data.goals[index]._id} class="goal-item">${sortedGoals[index].goal} || <span class="completeBy">Complete by: ${dateStr}</span><button class="delete goal-delete"><i class="fas fa-times-circle"></i></button></li>
                    `)

                if (data.goals[index].completed) {
                    $(`#${data.goals[index]._id}`).addClass('completed');
                }

            };

            $('.js-goals').append(`<button class="new-goal">Add New Goal</button>`);

            let notesArr = data.notes;

            let sortedNotes = DOM.sortByKeyDsc(notesArr, 'createdAt');

            for (index in sortedNotes) {
                let date = new Date(sortedNotes[index].createdAt);
                let dateStr = DOM.formatDate(date);

                $('.js-notes').append(`<li id=${data.notes[index]._id} class="note-item">${sortedNotes[index].content} <span class="createdAt">${dateStr}</span><button class="delete note-delete"><i class="fas fa-times-circle"></i></button></li>`)
            };

            $('.js-notes').append(`<button class="new-note">Add New Note</button>`);

            // for (index in data.files) {
            //     $('.js-files').append(`
            //     <li id=${data.files[index]._id}>${data.files[index].title} ${data.files[index].ext}<button class="edit file-edit"><i class="fas fa-edit"></i></button><button class="delete file-delete"><i class="fas fa-times-circle"></i></button></li>
            //     `)
            // };

            // $('.js-files').append(`<button class="new-file">Upload New File</button>`);

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