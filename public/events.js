const EVENTS = (function() {

    return {

        watchClicks: function() {
            $('.login').on('click', function(e) {
                e.preventDefault();
                API.getUserData();
            });

            $('body').on('click', '.person', function(e){
                e.preventDefault();
                let personId = $(this).attr('id');
                API.getPeopleData(personId);
            })

        }
    }
    
})();