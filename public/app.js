const APP = (function(domJS, apiJS, eventsJS) {

    return {

        init: function() {
            console.log('Application has started');
            eventsJS.watchClicks();
            if (sessionStorage.getItem('token')) {
                $('#login').slideUp(10);
                $('#logout').slideDown(10);
                $('.header__no-account').slideUp(10);
                $('.header__account').slideUp(10);
                $('main').empty();
                domJS.loadUserPage();
                apiJS.getUserData();
            };
            $('.header__account').slideUp(10);
        }

    }

})(DOM, API, EVENTS);

$(APP.init());