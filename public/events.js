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
            })

            $('body').on('click', '.people-section, .meetings-section', function(e) {
                $(this).parent().parent().find('ul').slideUp(5);
                $(this).parent().find('ul').empty();
                API.getUserData();
                $(this).parent().find('ul').toggle();
            })

            $('body').on('click', '.person', function(e) {
                e.preventDefault();
                let personName = $(this).text();
                let personId = $(this).attr('id');
                $('main').empty();
                DOM.loadPeoplePage(personName, personId);
            });

            $('body').on('click', '.notes-section, .goals-section, .files-section, .meetings-section-people', function(e) {
                $(this).parent().parent().find('ul').slideUp(5);
                $(this).parent().parent().find('form').slideUp(5);
                $(this).parent().find('ul').empty();
                let personId = $(this).parent().parent().find('h2').attr('id');
                API.getPersonsData(personId);
                $(this).parent().find('ul').toggle();
            })

            $('body').on('click', '.new-person', function(e) {
                e.preventDefault();
                $('.new-person-form').slideDown(10);
            });

            $('body').on('click', '#submit-person', function(e) {
                e.preventDefault();
                let userId = $('main').attr('id');
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
            })

            $('body').on('click', '#submit-note', function(e) {
                e.preventDefault();
                let personId = $('.new-note').attr('id');
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
                let personId = $('.new-goal').attr('id');
                let goal = $('#goal').val();
                let date = new Date(`${$('#complete-by').val()} 09:00`).toISOString();
                API.createNewGoal(personId, goal, date);
                $('.new-goals-form').slideUp(10);
                DOM.resetForm('.new-goals-form');
                $(this).parent().parent().find('ul').toggle();
            })

            $('body').on('click', '.new-meeting', function(e) {
                e.preventDefault();
                $('.new-meetings-form').slideDown(10);
            });

            $('body').on('click', '#submit-meeting', function(e) {
                e.preventDefault();
                let personId = $('.new-meeting').attr('id');
                let userId = $('main').attr('id');
                let date = new Date(`${$('#meeting-date').val()} ${$('#meeting-time').val()}`);
                API.createNewMeeting(personId, userId, date);
                $('.new-meetings-form').slideUp(10);
                DOM.resetForm('.new-meetings-form');
                $(this).parent().parent().find('ul').toggle();
            })

            $('body').on('click', '.new-file', function(e) {
                e.preventDefault();
                let personId = $('this').attr('id');
                $('.new-file-form').slideDown(10);
            });


        }
    }
    
})();