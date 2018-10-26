const EVENTS = (function() {

    return {

        watchClicks: function() {
            $('body').on('click', '#login-button', function(e) {
                e.preventDefault();
                $('.alert').empty();
                const username = $('#username').val();
                const password = $('#password').val();
                API.logUserIn(username, password);
                DOM.resetForm('#login');
            });

            $('body').on('click', '#signup-form', function(e) {
                e.preventDefault();
                $('.alert').empty();
                $('#login').toggle();
                $('#signup').toggle();
                $('.header__account').toggle();
                $('.header__no-account').toggle();
            });

            $('body').on('click', '#login-form', function(e) {
                e.preventDefault();
                $('.alert').empty();
                $('#login').toggle();
                $('#signup').toggle();
                $('.header__account').toggle();
                $('.header__no-account').toggle();
            });

            $('body').on('click', '#signup-button', function(e) {
                e.preventDefault();
                const newUser = {};
                newUser.firstName = $('#firstname').val();
                newUser.lastName = $('#lastname').val();
                newUser.userName = $('#new-username').val();
                newUser.password = $('#new-password').val();
                API.createNewUser(newUser);
                DOM.resetForm('#signup');
            });

            $('body').on('click', '#logout', function(e) {
                e.preventDefault();
                API.logUserOut();
                $('#login').slideDown(10);
                $('#logout').slideUp(10);
            });

            $('body').on('click', '#back', function(e) {
                e.preventDefault();
                const userId = $('main').data('userId');
                $('main').empty();
                DOM.loadUserPage();
                API.getUserData(userId);
            });

            $('body').on('click', '.people-section, .meetings-section', function(e) {
                $(this).parent().parent().find('form').slideUp(5);
                $(this).parent().parent().find('ul').slideUp(5);
                $(this).parent().find('ul').empty();
                API.getUserData();
                $(this).parent().find('ul').toggle();
            });

            $('body').on('click', '.person', function(e) {
                e.preventDefault();
                let personName = $(this).siblings('.people-name').text();
                $('main').data('personId', $(this).attr('id'))
                $('main').empty();
                let personId = $('main').data('personId');
                DOM.loadPeoplePage(personName, personId);
            });

            $('body').on('click', '.notes-section, .goals-section, .meetings-section-people', function(e) {
                let personId = $('main').data('personId');
                $(this).parent().parent().find('ul').slideUp(5);
                $(this).parent().parent().find('form').slideUp(5);
                $(this).parent().find('ul').empty();
                API.getPersonsData(personId);
                $(this).parent().find('ul').toggle();
            });

            $('body').on('click', '.new-person', function(e) {
                e.preventDefault();
                $('.new-person-form').slideDown(10);
            });

            $('body').on('click', '#submit-person', function(e) {
                e.preventDefault();
                let person = {
                    firstName: $('#person-first-name').val(),
                    lastName: $('#person-last-name').val()
                };
                const token = sessionStorage.getItem('token');
                let personId = $('main').data('personId');
                let userId = $('main').data('userId');
                API.createNewPerson(userId, person);
                $('.new-person-form').slideUp(10);
                DOM.resetForm('.new-person-form');
                $(this).parent().parent().find('ul').empty();
                API.getUsersPeople(userId, token);
            });

            $('body').on('click', '.new-meeting', function(e) {
                e.preventDefault();
                $('.new-meetings-form').slideDown(10);
            });

            $('body').on('click', '#submit-meeting', function(e) {
                e.preventDefault();
                let date = new Date(`${$('#meeting-date').val()} ${$('#meeting-time').val()}`);
                let personId = $('main').data('personId');
                let userId = $('main').data('userId');
                API.createNewMeeting(personId, userId, date);
                $('.new-meetings-form').slideUp(10);
                DOM.resetForm('.new-meetings-form');
                $(this).parent().parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.meeting-edit', function(e) {
                e.preventDefault();
                $(this).parent().find('form').empty();
                $(this).parent().append(`
                    <form class="edit-meetings-form" name="edit-meetings">
                        <label for="edit-meeting-date">When:</label>
                        <input type="date" id="edit-meeting-date" name="edit-meeting-date">
                        <label for="edit-meeting-time">What time:</label>
                        <input type="time" id="edit-meeting-time" name="edit-meeting-time" min="9:00" max="18:00">
                        <button id="submit-meeting-edit" name="submit-meeting-edit">OK</button>
                    </form>
                `);
                $(this).siblings('form').slideDown(10);
            });

            $('body').on('click', '#submit-meeting-edit', function(e) {
                e.preventDefault();
                let personId = $('main').data('personId');
                let userId = $('main').data('userId');
                let meetingId = $(this).parent().parent().attr('id');
                let dateVal;
                let timeVal;
                let updateData = {};
                if ($(this).siblings('#edit-meeting-date').val() === "") {
                    dateVal = $(this).parent().siblings('.date-string').text();
                } else {
                    dateVal = $(this).siblings('#edit-meeting-date').val();
                };
                if ($(this).siblings('#edit-meeting-time').val() == "") {
                    timeVal = $(this).parent().siblings('.time-string').text();
                } else {
                    timeVal = $(this).siblings('#edit-meeting-time').val();
                };
                let dateStr = new Date(`${dateVal} ${timeVal}`);
                updateData.date = dateStr;
                API.editMeeting(meetingId, updateData);
                $(this).parent().slideUp(10);
                DOM.resetForm('.edit-meeting-form');
                $(this).parent().parent().parent().empty();
                if(($(this).parent().siblings().attr('class')) === "user-name") {
                    API.getPersonsData(personId);
                } else {
                    API.getUserData(userId);
                }
            });

            $('body').on('click', '.new-note', function(e) {
                e.preventDefault();
                $('.new-notes-form').slideDown(10);
            });

            $('body').on('click', '#submit-note', function(e) {
                e.preventDefault();
                let personId = $('main').data('personId');
                let content = $('#content').val();
                API.createNewNote(personId, content);
                $('.new-notes-form').slideUp(10);
                DOM.resetForm('.new-notes-form');
                $(this).parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.note-edit', function(e) {
                e.preventDefault();
                $(this).parent().find('form').empty();
                const oldContent = $(this).parent().children('.note-content').text();
                $(this).parent().append(`
                    <form class="edit-note-form" name="edit-notes">
                        <label for="edit-content"></label>
                        <input type="text" id="edit-content" value="${oldContent}">
                        <button id="submit-note-edit" name="submit-note-edit">OK</button>
                    </form>
                `);
                $(this).siblings('form').slideDown(10);
            });

            $('body').on('click', '#submit-note-edit', function(e) {
                e.preventDefault();
                let personId = $('main').data('personId');
                let noteId = $(this).parent().parent().attr('id');
                let data = {
                    content: $('#edit-content').val()
                } 
                API.editNote(personId, noteId, data);
                $(this).parent().parent().parent().empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.note-delete', function(e) {
                let noteId = $(this).parent().attr('id');
                let personId = $('main').data('personId');
                API.deleteNote(personId, noteId);
                $(this).parent().parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.new-goal', function(e) {
                e.preventDefault();
                $('.new-goals-form').slideDown(10);
            });

            $('body').on('click', '#submit-goal', function(e) {
                let goal = $('#goal').val();
                let date = new Date(`${$('#complete-by').val()} 09:00`).toISOString();
                let personId = $('main').data('personId');
                API.createNewGoal(personId, goal, date);
                $('.new-goals-form').slideUp(10);
                DOM.resetForm('.new-goals-form');
                $(this).parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.goal-edit', function(e) {
                e.preventDefault();
                $(this).parent().find('form').empty();
                const oldGoal = $(this).parent().children('.goal').text();
                $(this).parent().append(`
                    <form class="edit-goal-form" name="edit-goals">
                        <label for="edit-goal-date">Complete by:</label>
                        <input type="date" id="edit-goal-date" name="edit-goal-date">
                        <label for="edit-goal">Goal:</label>
                        <input type="text" id="edit-goal" name="edit-goal" value="${oldGoal}">
                        <button id="submit-goal-edit" name="submit-goal-edit">OK</button>
                    </form>
                `);
                $(this).siblings('form').slideDown(10);
            });

            $('body').on('click', '#submit-goal-edit', function(e) {
                const data = {};
                e.preventDefault();
                let personId = $('main').data('personId');
                let goalId = $(this).parent().parent().attr('id');
                let dateVal;
                if ($(this).siblings('#edit-goal-date').val() === "") {
                    dateVal = $(this).parent().siblings('.completeBy').children('span').text();
                } else {
                    dateVal = $(this).siblings('#edit-goal-date').val();
                };
                data.date = new Date(`${dateVal} 00:10`);
                data.goal = $('#edit-goal').val();
                API.editGoal(personId, goalId, data);
                $(this).parent().parent().parent().empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.meeting-delete', function(e) {
                let userId = $('main').data('userId');
                let meetingId = $(this).parent().attr('id');
                let personId = $('main').data('personId');
                API.deleteMeeting(meetingId);
                $(this).parent().parent().empty();
                if(($(this).parent().parent().attr('class')) === "js-meetings-people") {
                    API.getPersonsMeetings(personId);
                } else {
                    API.getUserData(userId);
                }
            });

            $('body').on('click', '.goal-delete', function(e) {
                let goalId = $(this).parent().attr('id');
                let personId = $('main').data('personId');
                API.deleteGoal(personId, goalId);
                $(this).parent().parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.goal-complete', function(e) {
                e.preventDefault();
                let personId = $('main').data('personId');
                let goalId = $(this).parent().attr('id');
                let data = {
                    completed: false
                };
                if ($(this).parent().hasClass('completed')) {
                    $(this).parent().removeClass('completed');
                    $(this).children('button').removeClass('completed');
                } else {
                    $(this).parent().addClass('completed');
                    $(this).children('button').addClass('completed');
                    data.completed = true;
                }
                API.editGoalStatus(personId, goalId, data);
                $(this).parent().parent().empty();
                API.getPersonsData(personId);
            });

        }
    }
    
})();