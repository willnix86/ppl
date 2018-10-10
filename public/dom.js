const DOM = (function() {

    return {

        displayUserData: function(data) {

            $('.js-user').text(`${data.firstName} ${data.lastName}`);

            for (index in data.people) {
                $('.js-people').append(
                    `<p><a href='person.html'>
                    ${data.people[index].firstName} ${data.people[index].lastName}
                    </a></p>`
                )
            }
            for (index in data.activity) {
                $('.js-activity').append(
                    `<p> Type: ${data.activity[index].type}
                    Who: ${data.activity[index].personName}
                    </p>`
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

            for (index in data.activity) {
                $('.js-activity').append(
                    `<p> Type: ${data.activity[index].type}`)
            }

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