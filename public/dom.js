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
                    <input type="text" id="person-first-name" name="person-first-name" placeholder="e.g Sam">
                    <label for="person-last-name">Last Name:</label>
                    <input type="text" id="person-last-name" name="person-last-name" placeholder="e.g Smith">
                    <label for="submit-person"></label>
                    <input type="button" id="submit-person" name="submit-person" value="Submit">
                </form>
            </section>
            `);
        },

        displayUserData: function(data) {

            $('.js-user').text(`${data.user.firstName} ${data.user.lastName}`);

            $('.js-user').attr('id', data.user.id);

            for (index in data.people) {
                $('.js-people').append(
                    `<button id=${data.people[index].id} class='person'>
                    ${data.people[index].firstName} ${data.people[index].lastName}</button>`
                )
            };

            $('.js-people').append(`<button id=${data.user.id} class="new-person">Add New Person</button>`);

            for (index in data.meetings) {

                let date = new Date(data.meetings[index].date);

                let dateStr = DOM.formatDate(date);

                let timeStr = DOM.formatTime(date);

                $('.js-meetings').append(
                    `<li>
                    Meeting with <b>${data.meetings[index].person.firstName} ${data.meetings[index].person.lastName}</b> on <b>${dateStr}</b> at <b>${timeStr}</b>
                    </li>
                    `
                )
            };
        },

        loadPeoplePage: function(personName, personId) {
            console.log(personId);
            $('main').append(`
                <header>
                    <h1>Individual Profile Page</h1>
                    <h2 id='${personId}' class="js-person">${personName}</h2>
                    <button class="back">Back</button>
                </header>

                <section role="region">
                    <h3 class="notes-section">Notes</h3>
                    <ul class="js-notes"></ul>
                    <form class="new-notes-form" name="new-note">
                            <label for="content">Note:</label>
                            <input type="text" id="content" name="content">
                            <input type="button" id="submit-note" name="submit-note" value="Add Note">
                    </form>
                </section>

                <section role="region">
                    <h3 class="goals-section">Goals</h3>
                    <ul class="js-goals"></ul>
                    <form class="new-goals-form" name="new-goal">
                            <label for="goal">Goal:</label>
                            <input type="text" id="goal" name="goal">
                            <label for="complete-by">Complete by:</label>
                            <input type="date" id="complete-by" name="complete-by">
                            <label for="submit-goal"></label>
                            <input type="button" id="submit-goal" name="submit-goal" value="Add Goal">
                    </form>
                </section>

                <section class="meetings-people" role="region">
                    <h3 class="meetings-section-people">Meetings</h3>
                    <ul class="js-meetings-people"></ul>
                    <form class="new-meetings-form" name="new-meetings">
                            <label for="meeting-date">When:</label>
                            <input type="date" id="meeting-date" name="meeting-date">
                            <label for="meeting-time">What time:</label>
                            <input type="time" id="meeting-time" name="meeting-time" min="9:00" max="18:00">
                            <label for="submit-meeting"></label>
                            <input type="button" id="submit-meeting" name="submit-meeting-" value="Add Meeting">
                    </form>
                </section>

                <section role="region">
                    <h3 class"files-section">Files</h3>
                    <ul class="js-files"></ul>
                    <form class="new-file-form" name="new-file">
                            <label for="file-name">File Name:</label>
                            <input type="text" id="file-name" name="file-name">
                            <label for="submit-file"></label>
                            <input type="button" id="submit-file" name="submit-file" value="Upload File">
                    </form>
                </section>
            `);
        },

        displayPersonData: function(data) {

            $('.js-person').text(`${data.firstName} ${data.lastName}`);
            $('.js-person').attr('id', data.id);

            for (index in data.meetings) {

                let date = new Date(data.meetings[index].date);

                let dateStr = DOM.formatDate(date);

                let timeStr = DOM.formatTime(date);

                $('.js-meetings-people').append(
                    `<li>
                    Meeting with <b>${data.meetings[index].host.firstName} ${data.meetings[index].host.lastName}</b> on <b>${dateStr}</b> at <b>${timeStr}</b>
                    </li>
                    `
                )
            }

            $('.js-meetings-people').attr('id', `${data.userId}`);

            $('.js-meetings-people').append(`<button id=${data.id} class="new-meeting">Add New Meeting</button>`);

            for (index in data.goals) {

                let date = new Date(data.goals[index].completeBy)

                let dateStr = DOM.formatDate(date);

                $('.js-goals').append(
                    `<li>${data.goals[index].goal} || <span class="completeBy">Complete by: ${dateStr}</span></li>
                    `)
            };

            $('.js-goals').append(`<button id=${data.id} class="new-goal">Add New Goal</button>`);

            for (index in data.notes) {
                $('.js-notes').append(`<li>${data.notes[index].content}</li>`)
            };

            $('.js-notes').append(`<button id=${data.id} class="new-note">Add New Note</button>`);

            for (index in data.files) {
                $('.js-files').append(`
                <li>${data.files[index].title} ${data.files[index].ext}</li>
                `)
            };

            $('.js-files').append(`<button id=${data.id} class="new-file">Upload New File</button>`);

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
            const minutes = date.getMinutes();

            return `${hour}:${minutes}`;
        },

        resetForm: function(form) {
            $(form).find('input[type=text], input[type=password], input[type=date], input[type=time], input[type=file], select, textarea').val('');
            $(form).find('input[type=radio], input[type=checkbox]').removeAttr('checked').removeAttr('selected');
        }
        
    }
})();