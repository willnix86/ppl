const DOM = (function() {

    return {

        displayUserData: function(data) {

            $('.js-user').text(`${data.user.firstName} ${data.user.lastName}`);

            for (index in data.people) {
                $('.js-people').append(
                    `<button id=${data.people[index].id} class='person'>
                    ${data.people[index].firstName} ${data.people[index].lastName}</button>`
                )
            };

            $('.js-people').append(`<button id=${data.user.id} class="new-person">Add New Person</button>`);

            for (index in data.meetings) {

                let date = new Date(data.meetings[index].date);

                let dateStr = DOM.formatDate(date);

                $('.js-meetings').append(
                    `<li>
                    Meeting with ${data.meetings[index].person.firstName} ${data.meetings[index].person.lastName} on ${dateStr}
                    </li>
                    `
                )
            };

        },

        displayPersonData: function(data) {

            $('.js-person').text(`${data.firstName} ${data.lastName}`);

            for (index in data.meetings) {

                let date = new Date(data.meetings[index].date);

                let dateStr = DOM.formatDate(date);

                let timeStr = DOM.formatTime(date);

                $('.js-meetings-people').append(
                    `<li>
                    Meeting with ${data.meetings[index].host.firstName} ${data.meetings[index].host.lastName} on ${dateStr} at ${timeStr}
                    </li>
                    `
                )
            }

            $('.js-meetings-people').attr('id', `${data.userId}`);

            $('.js-meetings-people').append(`<button id=${data.id} class="new-meeting">Add New Meeting</button>`);

            for (index in data.goals) {

                let date = new Date(data.goals[index].completeBy)

                let dateStr = DOM.formatDate(date);

                $('.js-goals').append(
                    `<li>${data.goals[index].goal} || <span>Complete by: ${dateStr}</span></li>
                    `)
            };

            $('.js-goals').append(`<button id=${data.id} class="new-goal">Add New Goal</button>`);

            for (index in data.notes) {
                $('.js-notes').append(`<li>${data.notes[index].content}</li>`)
            };

            $('.js-notes').append(`<button id=${data.id} class="new-note">Add New Note</button>`);

            for (index in data.files) {
                $('.js-files').append(`
                <li>${data.files[index].title} ${data.files[index].ext}</li>
                `)
            };

            $('.js-files').append(`<button id=${data.id} class="new-file">Upload New File</button>`);

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