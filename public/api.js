const API = (function() {

    let userData = {};
    let peopleData = {};

    return {

        logUserIn: function(userName, passWord) {
            const data = {
                username: userName,
                password: passWord
            };

            fetch(`/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if(response.ok) {
                    return response.json();
                }
            $('.alert').append(`<p class='alert alert__text-error'>${response.statusText}</p>`);
            throw new Error(response.statusText);
            })
            .then(responseJson => {
                const { token, id } = responseJson;
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('id', id);
                $('main').empty();
                $('.header__no-account').slideUp(10);
                $('.header__account').slideUp(10);
                $('#login').slideUp(10);
                $('#logout').slideDown(10);
                DOM.loadUserPage();
                API.getUserData();
            })
        },

        logUserOut: function() {
            sessionStorage.clear();
            console.log(`You've been logged out!`);
            DOM.resetPpl();
        },

        getUserData: function() {
            const token = sessionStorage.getItem('token');
            const userId = sessionStorage.getItem('id');

            fetch(`/users/protected/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            throw new Error(response.statusText);
            })
            .then(responseJson => {
                userData.user = responseJson;
                API.getUsersPeople(userId, token);
                API.getUsersMeetings(userId, token);
            })
        },

        getUsersPeople: function(userId, token) {
            fetch(`/people/protected/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
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

        getUsersMeetings: function(userID, token) {
            fetch(`/meetings/protected/userId/${userID}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
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

        createNewUser: function(newUser) {
            fetch(`/users/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            .then(response => {
                if (!response.ok) {
                    $('.alert').append(`<p class='alert alert__text-error'>There was an error creating your account! ${response.statusText}</p>`);
                    throw new Error(response.statusText);
                }

                $('.alert').append(`<p class='alert alert__text-success'>Congratulations, your account was created successfully!</p>`);
                $('#login').toggle();
                $('#signup').toggle();
                $('.main__account').toggle();
                $('.main__no-account').toggle();
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

        },

        createNewPerson: function(id, person) {
            const newPerson = {
                firstName: person.firstName,
                lastName: person.lastName,
                user: id
            }
            fetch(`/people`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(newPerson)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })
        },

        createNewNote: function(id, content) {
            const data = {
                content: content
            }
            fetch(`/people/${id}/addNotes`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })

        },

        createNewGoal: function(id, goal, completeDate) {
            const data = {
                goal: goal,
                completeBy: completeDate
            }
            fetch(`/people/${id}/addGoals`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })
        },

        createNewMeeting: function(personId, hostId, date) {
            const data = {
                host: hostId,
                person: personId,
                date: date
            }

            fetch(`/meetings`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })
        },

        editMeeting: function(id, data) {
            fetch(`/meetings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data) 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })
        },

        editNote: function(personId, notesId, data) {
            
            fetch(`/people/${personId}/editNotes/${notesId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })

        },

        editGoal: function(personId, goalId, data) {

            fetch(`/people/${personId}/editGoals/${goalId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })

        },

        editGoalStatus: function(personId, goalId, data) {

            fetch(`people/${personId}/goalStatus/${goalId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })
        },

        deleteMeeting: function(id) {
            fetch(`/meetings/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })
        },

        deleteNote: function(personId, noteId) {
            fetch(`/people/${personId}/removeNotes/${noteId}`, {
                method: 'PUT'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })
        },

        deleteGoal: function(personId, noteId) {
            fetch(`/people/${personId}/removeGoals/${noteId}`, {
                method: 'PUT'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })
        }

    }

})();