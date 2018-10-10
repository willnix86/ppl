const API = (function() {

    const MOCK_PEOPLE = [
        {
            id: 10000,
            firstName: "Nicole",
            lastName: "Banks",
            userName: "nicole.banks",
            relationship: "Subordinate",
            title: "CHTB Assistant"
        },
        {
            id: 11000,
            firstName: "Phoebe",
            lastName: "Hughes",
            userName: "phoebe.hughes",
            relationship: "Subordinate",
            title: "Focus Temp"
        },
        {
            id: 11100,
            firstName: "Ed",
            lastName: "Crowther",
            userName: "ed.crowther",
            relationship: "Client",
            title: ""
        },
        {
            id: 11110,
            firstName: "Ollie",
            lastName: "Meakins",
            userName: "ollie.meakins",
            relationship: "Congregant",
            title: ""
        }
    ];

    const MOCK_ACTIVITY = [
        {
            id: 01,
            personName: "Phoebe Hughes",
            personId: 11000,
            type: "Meeting",
            createdAt: 1470016976609
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            type: "Note",
            createdAt: 1470016976609
        },
        {
            id: 03,
            personName: "Nicole Banks",
            personId: 10000,
            type: "Goal",
            createdAt: 1470016976609
        },
        {
            id: 04,
            personName: "Nicole Banks",
            personId: 10000,
            type: "Goal",
            createdAt: 1470016976609
        },
        {
            id: 05,
            personName: "Ollie Meakins",
            personId: 11110,
            type: "File",
            createdAt: 1470016976609
        },
    ];

    const MOCK_MEETINGS = [
        {
            id: 01,
            personName: "Phoebe Hughes",
            personId: 11000,
            date: 1235125265
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            date: 1235125265
        },
        {
            id: 03,
            personName: "Nicole Banks",
            personId: 10000,
            date: 1235125265
        },
        {
            id: 04,
            personName: "Nicole Banks",
            personId: 10000,
            date: 1235125265
        },
        {
            id: 05,
            personName: "Ollie Meakins",
            personId: 11110,
            date: 1235125265
        },
    ];

    const MOCK_GOALS = [
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            goal: "Complete 360 survey",
            createdAt: 1470016976609,
            completeBy: 1470016976609
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            goal: "Send counselling goals to Will",
            createdAt: 1470016976609,
            completeBy: 1470016976609
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            goal: "Upload payment to Venmo",
            createdAt: 1470016976609,
            completeBy: 1470016976609
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            goal: "Do something else useful",
            createdAt: 1470016976609,
            completeBy: 1470016976609
        },
    ]

    const MOCK_NOTES = [
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            content: "Ed told me that his brother is getting a divorce",
            createdAt: 1470016976609,
            permissions: 'User'
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            content: "Ed got agitated when I raised the issue of his father's drinking",
            createdAt: 1470016976609,
            permissions: 'User'
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            content: "Ed was late to pay his bills this month. I told him that I'd follow up with him next week",
            createdAt: 1470016976609,
            permissions: 'User'
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            content: "Ed shared his goals to become a web developer",
            createdAt: 1470016976609,
            permissions: 'User'
        },
    ]

    const MOCK_FILES = [
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            ext: ".pdf",
            title: "Ed's Safety Certification",
            createdAt: 1470016976609,
            permissions: 'Person'
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            ext: ".xlsx",
            title: "Ed's Billing Details",
            createdAt: 1470016976609,
            permissions: 'User'
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            ext: ".doc",
            title: "Ed's Mental Health Referral",
            createdAt: 1470016976609,
            permissions: 'User'
        },
        {
            id: 02,
            personName: "Ed Crowther",
            personId: 11100,
            ext: ".doc",
            title: "Ed's Counselling Agreement",
            createdAt: 1470016976609,
            permissions: 'Person'
        },
    ]

    const MOCK_PERSON = {
        id: MOCK_PEOPLE[2].id,
        firstName: MOCK_PEOPLE[2].firstName,
        lastName: MOCK_PEOPLE[2].lastName,
        userName: MOCK_PEOPLE[2].userName,
        title: MOCK_PEOPLE[2].title,
        activity: MOCK_ACTIVITY,
        notes: MOCK_NOTES,
        goals: MOCK_GOALS,
        files: MOCK_FILES,
        meetings: MOCK_MEETINGS
    }
    
    const MOCK_USER = {
        id: 00001,
        firstName: "Will",
        lastName: "Nixon",
        userName: "will.nixon",
        password: "Password",
        title: "Software Developer",
        people: MOCK_PEOPLE,
        activity: MOCK_ACTIVITY,
        meetings: MOCK_MEETINGS
    };
    
    return {

        getUserData: function(callback) {
            setTimeout(function() {
                callback(MOCK_USER)
            }, 100);
        },

        getPersonData: function(callback) {
            setTimeout(function() {
                callback(MOCK_PERSON)
            }, 100);
        }

    }

})();