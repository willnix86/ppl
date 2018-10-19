const EVENTS = (function() {

    let personId;
    let userId = $('main').attr('id');

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
                personId = $('main').attr('class');
                DOM.loadPeoplePage(personName, personId);
            });

            $('body').on('click', '.notes-section, .goals-section, .files-section, .meetings-section-people', function(e) {
                $(this).parent().parent().find('ul').slideUp(5);
                $(this).parent().parent().find('form').slideUp(5);
                $(this).parent().find('ul').empty();
                console.log(personId);
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
                API.createNewPerson(userId, person);
                $('.new-person-form').slideUp(10);
                DOM.resetForm('.new-person-form');
                $(this).parent().parent().find('ul').toggle();
            });

            $('body').on('click', '.new-note', function(e) {
                e.preventDefault();
                $('.new-notes-form').slideDown(10);
            });

            $('body').on('click', '#submit-note', function(e) {
                e.preventDefault();
                let content = $('#content').val();
                API.createNewNote(personId, content);
                $('.new-notes-form').slideUp(10);
                DOM.resetForm('.new-notes-form');
                $(this).parent().parent().find('ul').toggle();
            })

            $('body').on('click', '.new-goal', function(e) {
                e.preventDefault();
                $('.new-goals-form').slideDown(10);
            });

            $('body').on('click', '#submit-goal', function(e) {
                let goal = $('#goal').val();
                let date = new Date(`${$('#complete-by').val()} 09:00`).toISOString();
                API.createNewGoal(personId, goal, date);
                $('.new-goals-form').slideUp(10);
                DOM.resetForm('.new-goals-form');
                $(this).parent().parent().find('ul').toggle();
            });

            $('body').on('click', '.new-meeting', function(e) {
                e.preventDefault();
                $('.new-meetings-form').slideDown(10);
            });

            $('body').on('click', '#submit-meeting', function(e) {
                e.preventDefault();
                let date = new Date(`${$('#meeting-date').val()} ${$('#meeting-time').val()}`);
                API.createNewMeeting(personId, userId, date);
                $('.new-meetings-form').slideUp(10);
                DOM.resetForm('.new-meetings-form');
                $(this).parent().parent().find('ul').toggle();
            });

            $('body').on('click', '.new-file', function(e) {
                e.preventDefault();
                $('.new-file-form').slideDown(10);
            });

            $('body').on('click', '.meeting-edit', function(e) {
                let meetingId = $(this).parent().find('li').attr('id');
            });

            $('body').on('click', '.note-edit', function(e) {
                let noteId = $(this).parent().find('li').attr('id');
            });

            $('body').on('click', '.goal-edit', function(e) {
                let goalId = $(this).parent().find('li').attr('id');
            });

            $('body').on('click', '.file-edit', function(e) {
                let fileId = $(this).parent().find('li').attr('id');
            });

            $('body').on('click', '.meeting-delete', function(e) {
                let meetingId = $(this).parent().parent().find('li').attr('id');
                API.deleteMeeting(meetingId);
                $('.new-meetings-form').slideUp(10);
            });

            $('body').on('click', '.note-delete', function(e) {
                let noteId = $(this).parent().find('li').attr('id');
            });

            $('body').on('click', '.goal-delete', function(e) {
                let goalId = $(this).parent().find('li').attr('id');
            });

            $('body').on('click', '.file-delete', function(e) {
                let fileId = $(this).parent().find('li').attr('id');
            });


        }
    }
    
})();