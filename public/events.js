const EVENTS = (function() {

    return {

        watchClicks: function() {
            $('body').on('click', '.login', function(e) {
                e.preventDefault();
                $('main').empty();
                DOM.loadUserPage();
                API.getUserData();
            });

            $('body').on('click', '.back', function(e) {
                e.preventDefault();
                $('main').empty();
                DOM.loadUserPage();
                API.getUserData();
            });

            $('body').on('click', '.people-section, .meetings-section', function(e) {
                $(this).parent().parent().find('ul').slideUp(5);
                $(this).parent().find('ul').empty();
                API.getUserData();
                $(this).parent().find('ul').toggle();
            });

            $('body').on('click', '.person', function(e) {
                e.preventDefault();
                let personName = $(this).text();
                $('main').attr('class', $(this).attr('id'))
                $('main').empty();
                let personId = $('main').attr('class');
                DOM.loadPeoplePage(personName, personId);
            });

            $('body').on('click', '.notes-section, .goals-section, .meetings-section-people', function(e) {
                let personId = $('main').attr('class');
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
                let personId = $('main').attr('class');
                let userId = $('main').attr('id');
                API.createNewPerson(userId, person);
                $('.new-person-form').slideUp(10);
                DOM.resetForm('.new-person-form');
                $(this).parent().parent().empty();
                API.getUserData(userId);
            });

            $('body').on('click', '.new-note', function(e) {
                e.preventDefault();
                $('.new-notes-form').slideDown(10);
            });

            $('body').on('click', '#submit-note', function(e) {
                e.preventDefault();
                let personId = $('main').attr('class');
                let content = $('#content').val();
                API.createNewNote(personId, content);
                $('.new-notes-form').slideUp(10);
                DOM.resetForm('.new-notes-form');
                $(this).parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            })

            $('body').on('click', '.new-goal', function(e) {
                e.preventDefault();
                $('.new-goals-form').slideDown(10);
            });

            $('body').on('click', '#submit-goal', function(e) {
                let goal = $('#goal').val();
                let date = new Date(`${$('#complete-by').val()} 09:00`).toISOString();
                let personId = $('main').attr('class');
                API.createNewGoal(personId, goal, date);
                $('.new-goals-form').slideUp(10);
                DOM.resetForm('.new-goals-form');
                $(this).parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.new-meeting', function(e) {
                e.preventDefault();
                $('.new-meetings-form').slideDown(10);
            });

            $('body').on('click', '#submit-meeting', function(e) {
                e.preventDefault();
                let date = new Date(`${$('#meeting-date').val()} ${$('#meeting-time').val()}`);
                let personId = $('main').attr('class');
                let userId = $('main').attr('id');
                API.createNewMeeting(personId, userId, date);
                $('.new-meetings-form').slideUp(10);
                DOM.resetForm('.new-meetings-form');
                $(this).parent().parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.meeting-edit', function(e) {
                e.preventDefault();
                $(this).siblings('form').slideDown(10);
            });

            $('body').on('click', '#submit-meeting-edit', function(e) {
                e.preventDefault();
                let userId = $('main').attr('id');
                let personId = $('main').attr('class');
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

            $('body').on('click', '.meeting-delete', function(e) {
                let userId = $('main').attr('id');
                let meetingId = $(this).parent().attr('id');
                let personId = $('main').attr('class');
                API.deleteMeeting(meetingId);
                $(this).parent().parent().empty();
                if(($(this).parent().parent().attr('class')) === "js-meetings-people") {
                    API.getPersonsMeetings(personId);
                } else {
                    API.getUserData(userId);
                }
            });

            $('body').on('click', '.note-delete', function(e) {
                let noteId = $(this).parent().attr('id');
                let personId = $('main').attr('class');
                API.deleteNote(personId, noteId);
                $(this).parent().parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.goal-delete', function(e) {
                let goalId = $(this).parent().attr('id');
                console.log(goalId);
                let personId = $('main').attr('class');
                API.deleteGoal(personId, goalId);
                $(this).parent().parent().parent().find('ul').empty();
                API.getPersonsData(personId);
            });

            $('body').on('click', '.goal-item', function(e) {
                e.preventDefault();
                let personId = $('main').attr('class');
                let goalId = $(this).attr('id');
                let data = {
                    completed: false
                };
                if ($(this).hasClass('completed')) {
                    $(this).removeClass('completed');
                } else {
                    $(this).addClass('completed');
                    data.completed = true;
                }
                API.editGoalStatus(personId, goalId, data);
                $(this).parent().empty();
                API.getPersonsData(personId);
            })

        }
    }
    
})();