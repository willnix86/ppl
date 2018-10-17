const DOM = (function() {

    return {

        displayUserData: function(data) {

            $('.js-user').text(`${data.user.firstName} ${data.user.lastName}`);

            for (index in data.people) {
                $('.js-people').append(
                    `<button id=${data.people[index].id} class='person'>
                    ${data.people[index].firstName} ${data.people[index].lastName}</button>`
                )
            }

            for (index in data.meetings) {

                let date = new Date(data.meetings[index].date);

                let dateStr = DOM.formatDate(date);

                $('.js-meetings').append(
                    `<p>
                    Meeting with ${data.meetings[index].person.firstName} ${data.meetings[index].person.lastName} on ${dateStr}
                    </p>
                    `
                )
            }
        },

        displayPersonData: function(data) {

            $('.js-person').text(`${data.firstName} ${data.lastName}`);

            for (index in data.meetings) {

                let date = new Date(data.meetings[index].date);

                let dateStr = DOM.formatDate(date);

                let timeStr = DOM.formatTime(date);

                $('.js-meetings-people').append(
                    `<p>
                    Meeting with ${data.meetings[index].host.firstName} ${data.meetings[index].host.lastName} on ${dateStr} at ${timeStr}
                    </p>
                    `
                )
            }

            for (index in data.goals) {

                let date = new Date(data.goals[index].completeBy)

                let dateStr = DOM.formatDate(date);

                $('.js-goals').append(
                    `<p>${data.goals[index].goal}</p>
                    <p>Complete by: ${dateStr}</p>
                    `)
            }

            for (index in data.notes) {
                $('.js-notes').append(`<p>${data.notes[index].content}</p>`)
            }

            for (index in data.files) {
                $('.js-files').append(`
                <p>${data.files[index].title} ${data.files[index].ext}</p>
                `)
            }

        },

        resetPeoplePage: function() {
            $('.js-meetings-people').empty();
            $('.js-goals').empty();
            $('.js-files').empty();
            $('.js-notes').empty();
        },

        resetUserPage: function() {
            $('.js-meetings').empty();
            $('.js-people').empty();
        },

        formatDate(date) {
            const monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            const day = date.getDate();
            const monthIndex = date.getMonth();
            const year = date.getFullYear();
            
            return `${day} ${monthNames[monthIndex]} ${year}`;
        },

        formatTime(date) {
            const hour = date.getHours();
            const minutes = date.getMinutes();

            return `${hour}:${minutes}`;
        }
        
    }
})();