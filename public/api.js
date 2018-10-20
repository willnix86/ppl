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
                    "Content-type": "application/json"
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
                    "Content-type": "application/json"
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
                    "Content-type": "application/json"
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
                    "Content-type": "application/json"
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
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data) 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            })
        },

        editGoalStatus: function(personId, goalId, status) {
            const data = {
                completed: status
            };

            fetch(`people/${personId}/goalStatus/${goalId}`, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
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