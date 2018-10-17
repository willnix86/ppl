const API = (function() {

    let userData = {};
    let peopleData = {};

    return {

        getUserData: function() {
            let user = "5bbf88a9e7263972af43646f";
            fetch(`/users/${user}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            throw new Error(response.statusText);
            })
            .then(responseJson => {
                userData.user = responseJson;
                API.getUsersPeople(user);
                API.getUsersMeetings(user);
            })
        },

        getUsersPeople: function(user) {
            fetch(`/people/userId/${user}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            throw new Error(response.statusText);
            })
            .then(responseJson => {
                userData.people = responseJson;
            })
        },

        getUsersMeetings: function(user) {
            fetch(`/meetings/userId/${user}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            throw new Error(response.statusText);
            })
            .then(responseJson => {
                userData.meetings = responseJson;
                DOM.displayUserData(userData);
            })
        },

        getPersonsData: function(id) {
            fetch(`/people/${id}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            throw new Error(response.statusText);
            })
            .then(responseJson => {
                peopleData.id = responseJson.id;
                peopleData.userId = responseJson.user._id;
                peopleData.firstName = responseJson.firstName;
                peopleData.lastName = responseJson.lastName;
                peopleData.notes = responseJson.notes;
                peopleData.goals = responseJson.goals;
                API.getPersonsMeetings(id);
            })
        },

        getPersonsMeetings: function(id) {
            fetch(`/meetings/personId/${id}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            throw new Error(response.statusText);
            })
            .then(responseJson => {
                peopleData.meetings = responseJson;
                DOM.displayPersonData(peopleData);
            })

        }
    }

})();