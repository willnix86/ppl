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
                $('.new-person-form').slideToggle(10);
            });

            $('body').on('click', '#submit-person', function(e) {
                e.preventDefault();
                let userId = $('.new-person').attr('id');
                let person = {
                    firstName: $('#person-first-name').val(),
                    lastLast: $('#person-last-name').val()
                };
                API.createNewPerson(userId, person);
                $('.new-person-form').slideToggle(10);
            });

            $('body').on('click', '.new-meeting-people', function(e) {
                e.preventDefault();
                $('.new-meetings-form-people').slideToggle(10);

            });

            $('body').on('click', '#submit-meeting-people', function(e) {
                e.preventDefault();
                let personId = $(this).attr('id');
                let userId = $(this).attr('id');
                $('.new-meetings-form-people').slideToggle(10);
            });

            $('body').on('click', '.new-goal', function(e) {
                e.preventDefault();
                let personId = $(this).attr('id');
            });

            $('body').on('click', '.new-note', function(e) {
                e.preventDefault();
                let personId = $(this).attr('id');
            });

            $('body').on('click', '.new-file', function(e) {
                e.preventDefault();
                let personId = $(this).attr('id');
            });


        }
    }
    
})();