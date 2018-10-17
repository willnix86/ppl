const EVENTS = (function() {

    return {

        watchClicks: function() {
            $('.login').on('click', function(e) {
                e.preventDefault();
                DOM.resetUserPage();
                API.getUserData();
            });

            $('body').on('click', '.person', function(e){
                e.preventDefault();
                DOM.resetPeoplePage();
                let personId = $(this).attr('id');
                API.getPersonsData(personId);
            })

        }
    }
    
})();