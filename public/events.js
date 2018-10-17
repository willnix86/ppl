const EVENTS = (function() {

    return {

        watchClicks: function() {
            $('body').on('click', '.login', function(e) {
                e.preventDefault();
                DOM.resetUserPage();
                API.getUserData();
            });

            $('body').on('click', '.person', function(e) {
                e.preventDefault();
                DOM.resetPeoplePage();
                let personId = $(this).attr('id');
                API.getPersonsData(personId);
            });

            $('body').on('click', '.new-person', function(e) {
                e.preventDefault();
                $('.new-person-form').slideDown(10);
            });

            $('body').on('click', '#submit-person', function(e) {
                e.preventDefault();
                let userId = $('.new-person').attr('id');
                let person = {
                    firstName: $('#person-first-name').val(),
                    lastLast: $('#person-last-name').val()
                };
                API.createNewPerson(userId, person);
                $('.new-person-form').slideUp(10);
                DOM.resetForm('.new-person-form');
            });

            $('body').on('click', '.new-note', function(e) {
                e.preventDefault();
                $('.new-notes-form').slideDown(10);
            })

            $('body').on('click', '#submit-note', function(e) {
                e.preventDefault();
                let personId = $('.new-note').attr('id');
                let content = $('#content').val();
                API.createNewNote(personId, content);
                $('.new-notes-form').slideUp(10);
                DOM.resetForm('.new-notes-form');
            })

            $('body').on('click', '.new-goal', function(e) {
                e.preventDefault();
                $('.new-goals-form').slideDown(10);
            });

            $('body').on('click', '#submit-goal', function(e) {
                let personId = $('.new-goal').attr('id');
                let goal = $('#goal').val();
                let date = new Date(`${$('#complete-by').val()} 09:00`).toISOString();
                API.createNewGoal(personId, goal, date);
                $('.new-goals-form').slideUp(10);
                DOM.resetForm('.new-goals-form');
            })

            $('body').on('click', '.new-meeting-people', function(e) {
                e.preventDefault();
                $('.new-meetings-form-people').slideDown(10);
            });

            $('body').on('click', '#submit-meeting-people', function(e) {
                e.preventDefault();
                let personId = $('.new-meeting-people').attr('id');
                let userId = $('.js-meetings-people').attr('id');
                let date = new Date(`${$('#meeting-date-people').val()} ${$('#meeting-time-people').val()}`);
                API.createNewMeeting(personId, userId, date);
                $('.new-meetings-form-people').slideUp(10);
                DOM.resetForm('.new-meetings-form-people');
            })

            // $('body').on('click', '.new-file', function(e) {
            //     e.preventDefault();
            //     let personId = $('this').attr('id');
            // });


        }
    }
    
})();