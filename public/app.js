const APP = (function(domJS, apiJS) {

    const path = window.location.pathname;

    const getAndDisplayInitialData = function() {
        if (path.match(/(user.html)$/)) {
            apiJS.getUserData(domJS.displayUserData);
        } else if (path.match(/(person.html)$/)) {
            apiJS.getPersonData(domJS.displayPersonData);
        }
    }

    return {

        init: function() {
            console.log('Application has started');
            getAndDisplayInitialData();
        }

    }

})(DOM, API);

APP.init();