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
                $('.js-meetings').append(
                    `<p>
                    Meeting with ${data.meetings[index].personName} on ${data.meetings[index].date}
                    </p>
                    `
                )
            }
        },

        displayPersonData: function(data) {

            $('.js-person').text(`${data.firstName} ${data.lastName}`);

            for (index in data.meetings) {
                $('.js-meetings').append(
                    `<p>
                    Meeting with Will Nixon on ${data.meetings[index].date}
                    </p>
                    `
                )
            }

            for (index in data.goals) {
                $('.js-goals').append(
                    `<p>${data.goals[index].goal}</p>
                    <p>Complete by: ${data.goals[index].completeBy}</p>
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

        }
        
    }
})();