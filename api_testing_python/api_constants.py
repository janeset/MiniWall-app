class API:
    BASE_URL = 'http://127.0.0.1'
    PORT = 3000


class ENDPOINT:
    HOME = "/"
    USER_REGISTER= "/api/users/register"
    USER_LOGIN= "/api/users/login"
    USER_DELETE= "/api/users/{user_id}"
    CREATE_NEW_POST= "/api/posts/new"
    GET_ALL_POST= "/api/posts/getAll"
    DELETE_POST= "/api/posts/{post_id}"
    CREATE_COMMENT= "/api/posts/{post_id}/comments/new"
    DELETE_COMMENT= "/api/comments/{comment_id}"
    GET_POST_WITH_COMMENTS= "/api/posts/{post_id}/comments"
    LIKE_POST= "/api/posts/{post_id}/like"
    DELETE_LIKES= "/api/likes/deleteAll"
    SEARCH_POST_BY_DATES= "/api/posts/search/dates"
    SEARCH_POST_BY_TITLE_KEYWORDS= "/api/posts/search/title/{keywords}"
    SEARCH_POST_BY_USERNAME= "/api/posts/search/{username}"


class Data:
    # User - Register
    leon_register_payload = {
        "username": "LeonKennedy",
        "email": "leon.s.kennedy@dso.gov",
        "password": "RaccoonRequiem30"
    }

    ada_register_payload = {
        "username": "AdaWong",
        "email": "ada.wong@unknown.com",
        "password": "RedDressSpy007"
    }

    grace_register_payload = {
        "username": "GraceAshcroft",
        "email": "grace.ashcroft@fbi.gov",
        "password": "WrenwoodHotel26"
    }

    chris_register_payload = {
        "username": "ChrisRedfield",
        "email": "chris.redfield@bsaa.org",
        "password": "WolfHoundSquad"
    }

    victor_register_payload = {
        "username": "VictorGideon",
        "email": "v.gideon@umbrella.com",
        "password": "SpencersWill98"
    }

    emily_register_payload = {
        "username": "Emily_Subject6",
        "email": "emily@unknown.net",
        "password": "MorphicMemory"
    }

    # User Login
    leon_login_payload = {
        "email": "leon.s.kennedy@dso.gov",
        "password": "RaccoonRequiem30"
    }

    ada_login_payload = {
        "email": "ada.wong@unknown.com",
        "password": "RedDressSpy007"
    }

    grace_login_payload = {
        "email": "grace.ashcroft@fbi.gov",
        "password": "WrenwoodHotel26"
    }

    chris_login_payload = {
        "email": "chris.redfield@bsaa.org",
        "password": "WolfHoundSquad"
    }

    victor_login_payload = {
        "email": "v.gideon@umbrella.com",
        "password": "SpencersWill98"
    }

    emily_login_payload = {
        "email": "emily@unknown.net",
        "password": "MorphicMemory"
    }

    # Create Post By User
    leon_create_post_payload = {
        "userId": "",
        "username": "LeonKennedy",
        "title": "Rookie Mistakes",
        "text": "Visited my old office today. Found a herb, solved a clock puzzle, and got coughed on by a bioweapon.\nLiterally nothing has changed since 1998.\nI need a vacation.",
        "hashtag": "#RaccoonCity #BackInTown #RE9",
        "location": "R.P.D. Ruins",
        "url": "www.dso.gov/retirement-fund",
        "likes": 0,
        "comments": 0
    }

    ada_create_post_payload = {
        "userId": "",
        "username": "AdaWong",
        "title": "Same Guy, Different Apocalypse and Gym",
        "text": "Just spotted Leon in the Gym.\nHe's still wearing that tactical vest from 2004.\nDoes he ever shop for new clothes, or does he just find them in locked briefcases?",
        "hashtag": "#StyleIcon #LeonNeedsaTailor #RE9",
        "location": "ARK Facility - Ventilation Shaft",
        "url": "www.classified-intel.net/spy-gear",
        "likes": 0,
        "comments": 0
    }

    grace_create_post_payload = {
        "userId": "",
        "username": "GraceAshcroft",
        "title": "HR Support Ticket #404",
        "text": "I specifically requested a desk job to avoid human contact.\nNow I am being chased by a 7-foot tall doctor with a chainsaw.\nIs this covered under my dental plan?",
        "hashtag": "#FBI #WorkFromHome #RE9",
        "location": "Wrenwood Hotel",
        "url": "www.fbi.gov/incident-report",
        "likes": 0,
        "comments": 0
    }

    chris_create_post_payload = {
        "userId": "",
        "username": "ChrisRedfield",
        "title": "Gym Equipment Request",
        "text": "Reporting from the Wrenwood perimeter.\nThere are no boulders to punch in this forest.\nMorale is low. Please send a squat rack to the extraction zone.",
        "hashtag": "#NoGainsNoGlory #BoulderPuncher #RE9",
        "location": "Wrenwood Forest - Bench Press Area",
        "url": "www.bsaa.org/protein-powder",
        "likes": 0,
        "comments": 0
    }

    victor_create_post_payload = {
        "userId": "",
        "username": "VictorGideon",
        "title": "Project Requiem Status",
        "text": "Spent 20 years and 500 million dollars to find the 'Chosen One'.\nTurns out she's just an introvert who likes puzzles.\nSpencer's legacy is surprisingly expensive to maintain.",
        "hashtag": "#UmbrellaPride #BioweaponGrindset",
        "location": "ARK Facility",
        "url": "www.umbrella-labs.net/internal",
        "likes": 0,
        "comments": 0
    }

    emily_create_post_payload = {
        "userId": "",
        "username": "Emily_Subject6",
        "title": "Hospital Stay Review",
        "text": "The food was okay, but the nurses kept turning into 'Blister Heads'.\nAlso, the exit was locked behind a complex Braille puzzle.\n1 star. Would not recommend.",
        "hashtag": "#RhodesHill #EscapeRoom #RE9",
        "location": "Chronic Care Center",
        "url": "www.yelp.com",
        "likes": 0,
        "comments": 0
    }

    # Create Comment by User (To Grace's Post)
    leon_create_comment_payload = {
        "text": "First time? I once fought a giant shark in a basement. You'll get used to it.",
        "username": "LeonKennedy"
    }

    chris_create_comment_payload = {
        "text": "If you can find a green herb and some tape, you can fix that dental issue yourself.",
        "username": "ChrisRedfield"
    }

    victor_create_comment_payload = {
        "text": "Technically, being chased by a bioweapon is considered an 'outdoor team-building exercise' at Umbrella.",
        "username": "VictorGideon"
    }

    grace_create_comment_payload = {
        "text": "Im trying to comment on my own post, this is not easy.",
        "username": "GraceAshcroft"
    }

    # Like a Post
    leon_like_payload = {
        "username": "LeonKennedy",
        "email": "leon.s.kennedy@dso.gov"
    }

    ada_like_payload = {
        "username": "AdaWong",
        "email": "ada.wong@unknown.com",
    }

    grace_like_payload = {
        "username": "GraceAshcroft",
        "email": "grace.ashcroft@fbi.gov"
    }

    chris_like_payload = {
        "username": "ChrisRedfield",
        "email": "chris.redfield@bsaa.org"
    }

    victors_like_payload = {
        "username": "VictorGideon",
        "email": "v.gideon@umbrella.com"
    }

    emily_like_payload = {
        "username": "Emily_Subject6",
        "email": "emily@unknown.net"
    }

    # Search post
    search_by_dates_payload = {
        "startDate": "2026-03-01",
        "endDate": "2026-06-06"
    }
