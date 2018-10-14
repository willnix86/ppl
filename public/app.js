const APP = (function(domJS, apiJS, eventsJS) {

    return {

        init: function() {
            console.log('Application has started');
            eventsJS.watchClicks();
        }

    }

})(DOM, API, EVENTS);

$(APP.init());