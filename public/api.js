const API = (function() {

    let userData = {};

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
                DOM.displayUserData(userData);
            })
        },

        getPeopleData: function(id) {
            fetch(`/people/${id}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            throw new Error(response.statusText);
            })
            .then(responseJson => {
                DOM.displayPersonData(responseJson);
            })
        }

    }

})();