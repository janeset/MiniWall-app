import requests
import json
import inspect
from api_constants import *

# Class that will track the values during the Testing session
class SessionData:
    def __init__(self):
        # A dictionary mapping username (Key) to their user_data (Value)
        self.users_collection = {}
        self.posts_collection = {}
        self.comments_collection = {}


    @staticmethod
    def payload_to_json(dictionary_data):
        """
        Static method used to serialize a dictionary into a JSON string
        :param dictionary_data:
        :return: json string
        """
        return json.dumps(dictionary_data, indent=4)


    @staticmethod
    def json_to_payload(json_string):
        """
        Static method used to deserialize a JSON string into a dictionary
        :param json_string:
        :return: dictionary
        """
        try:
            return json.loads(json_string)
        except Exception as e:
            print(f'Error json deserialization {e}')


#----- TEST METHODS HANDLING THE API TEST CASES -----
def create_user_test(session_data, payload) -> None:
    """
    Test user creation using the API
    """
    try:
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.USER_REGISTER}"
        func_name = inspect.currentframe().f_code.co_name

        # Send Request
        res = requests.post(endpoint, json=payload)
        # Handle if the URL is invalid or returns a 4xx/5xx status code
        if res.status_code != 200:
            print(f"User Created ({payload['username']})- [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate Expected vs Actual result
        if  (payload["username"] == res.json().get("username") and
             payload["email"] == res.json().get("email")):
            print(f"User Created - [PASS] - Status:[{res.status_code}] - ({payload['username']}) Payload: {res.text}")
            # save user data to session using username as key
            session_data.users_collection[payload["username"]] = res.json()
        else:
            print(f"Expected payload {payload} but got {res.json()}")

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def login_user_test(session_data, payload) -> None:
    """
    Test user Login using the API
    """
    try:
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.USER_LOGIN}"
        func_name = inspect.currentframe().f_code.co_name

        # Send Request
        res = requests.post(endpoint, json=payload)
        # Handle if the URL is invalid or returns a 4xx/5xx status code
        if res.status_code != 200:
            print(f"User Login ({payload['username']}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate Expected vs Actual result
        if payload["email"] == res.json()["user"]["email"]:
            username = res.json()["user"]["username"]
            print(f"User Login - [PASS] - Status:[{res.status_code}] - ({username}) Payload: {res.text}")
            # save user auth-token to session using username as key if exists
            if username in session_data.users_collection:
                session_data.users_collection[username]["token"] = res.json()["token"]
            # save token for session if empty
            if session_data.auth_token is None:
                session_data.auth_token = res.json()["token"]
        else:
            print(f"Expected payload {payload} but got {res.json()}")

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def user_create_post_test(session_data, payload) -> None:
    """
    Test authenticated user can create a post using the API
    """
    try:
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.CREATE_NEW_POST}"
        func_name = inspect.currentframe().f_code.co_name
        username = payload["username"]
        user = None

        # get userData from session
        if payload["username"] in session_data.users_collection:
            user = session_data.users_collection[username]
            payload["userId"] = user["_id"]

        # Send Request
        res = requests.post(endpoint, headers={"auth-token":user["token"]}, json=payload)

        # Handle status response
        if res.status_code != 200:
            print(f"Create Post ({username}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate Expected vs Actual result
        if user["_id"] == res.json()["userId"]:
            print(f"Create Post - [PASS] - Status:[{res.status_code}] - ({user['username']}) Payload: {res.text}")
            # save latest post data to session using username as key
            session_data.posts_collection[payload["username"]] = res.json()
        else:
            print(f"Expected payload {payload} but got {res.json()}")

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def get_posts_by_auth_user_test(session_data, username) -> None:
    """
    Test authenticated user can retrieve all posts using the API
    """
    try:
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.GET_ALL_POST}"
        func_name = inspect.currentframe().f_code.co_name
        user = None

        # get userData from session
        if username in session_data.users_collection:
            user = session_data.users_collection[username]

        # Send Request
        res = requests.get(endpoint, headers={"auth-token": user["token"]})

        # Handle status response
        if res.status_code != 200:
            print(f"Get All Post ({username}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate Expected result
        if res.json() is not None:
            result = SessionData.json_to_payload(res.text)
            if result is not None and len(result) >= 0:
                print(f"Get All Post - [PASS] - Status:[{res.status_code}] - ({user['username']}) ")
                for post in result:
                    print(post)

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def get_posts_not_auth_user_test(session_data, username) -> None:
    """
    Test non-authenticated user fails to retrieve all posts using the API
    """
    try:
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.GET_ALL_POST}"
        func_name = inspect.currentframe().f_code.co_name
        user = None

        # get userData from session
        if username in session_data.users_collection:
            user = session_data.users_collection[username]

        # Send Request without auth token
        res = requests.get(endpoint)

        # Handle status response
        if res.status_code != 200:
            print(f"Get All Post ({username}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate Expected result
        if res.json() is not None:
            result = SessionData.json_to_payload(res.text)
            if result is not None and len(result) >= 0:
                print(f"Get All Post - [PASS] - Status:[{res.status_code}] - ({user['username']}) ")
                for post in result:
                    print(post)

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def create_comment_in_post_test(session_data, payload, post_owner) -> None:
    """
    Test authenticated user can create a comment in an existing post using the API
    """
    try:
        func_name = inspect.currentframe().f_code.co_name
        username = payload["username"]
        user, post = None, None

        # get userData and post from session
        if username in session_data.users_collection:
            user = session_data.users_collection[username]
        if post_owner in session_data.posts_collection:
            post = session_data.posts_collection[post_owner]

        # Send Request
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.CREATE_COMMENT.format(post_id=post['_id'])}"
        res = requests.post(endpoint, headers={"auth-token": user["token"]}, json=payload)

        # Handle status response
        if res.status_code != 200:
            print(f"Create Comment ({username}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate result
        if post["_id"] == res.json()["postId"]:
            print(f"Create Comment - [PASS] - Status:[{res.status_code}] - ({user['username']}) Payload: {res.text}")
            # save latest post data to session using username as key
            session_data.comments_collection[payload["username"]] = res.json()

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def get_post_with_comments_test(session_data, post_owner) -> None:
    """
    Test authenticated user can retrieve post with comments using the API
    """
    try:
        func_name = inspect.currentframe().f_code.co_name
        user, latest_post = None, None

        # get userData from session
        if post_owner in session_data.users_collection:
            user = session_data.users_collection[post_owner]
            latest_post = session_data.posts_collection[post_owner]

        # Send Request
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.GET_POST_WITH_COMMENTS.format(post_id=latest_post['_id'])}"
        res = requests.get(endpoint, headers={"auth-token": user["token"]})

        # Handle status response
        if res.status_code != 200:
            print(f"Get Post With Comments ({post_owner}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate result
        if latest_post["_id"] == res.json()["_id"]:
            print(f"Get Post with Comments - [PASS] - Status:[{res.status_code}] - ({user['username']}) Payload: {json.dumps(res.json(), indent=4)}")

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def user_comment_own_post_test(session_data, post_owner) -> None:
    """
    Test authenticated user can not  comment on their own post using the API
    """
    try:
        func_name = inspect.currentframe().f_code.co_name
        user, latest_post = None, None

        # get userData and post from session
        if post_owner in session_data.users_collection:
            user = session_data.users_collection[post_owner]
        if post_owner in session_data.posts_collection:
            latest_post = session_data.posts_collection[post_owner]

        # Send Request
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.CREATE_COMMENT.format(post_id=latest_post['_id'])}"
        res = requests.post(endpoint, headers={"auth-token": user["token"]}, json=Data.grace_create_comment_payload)

        # Handle status response
        if res.status_code != 200:
            print(f"Create Comment ({post_owner}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate result
        if latest_post["_id"] == res.json()["postId"]:
            print(f"Create Comment - [PASS] - Status:[{res.status_code}] - ({post_owner}) Payload: {res.text}")
            # save latest post data to session using username as key
            session_data.comments_collection[post_owner] = res.json()

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def like_post_test(session_data, username, user_like_payload, post_owner) -> None:
    """
    Test authenticated user can like a post using the API
    """
    try:
        func_name = inspect.currentframe().f_code.co_name
        user, latest_post = None, None

        # get userData and post from session
        if username in session_data.users_collection:
            user = session_data.users_collection[post_owner]
        if post_owner in session_data.posts_collection:
            latest_post = session_data.posts_collection[post_owner]

        # Send Request
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.LIKE_POST.format(post_id=latest_post['_id'])}"
        res = requests.post(endpoint, headers={"auth-token": user["token"]}, json=user_like_payload)

        # Handle status response
        if res.status_code != 200:
            print(f"Like {post_owner}'s Post by ({username}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate result
        if res.status_code == 200:
            print(f"Like {post_owner}'s Post by ({username})  - [PASS] - Status:[{res.status_code}] - ({post_owner}) Payload: {res.text}")

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def search_posts_by_dates_test(session_data, username, date_payload) -> None:
    """
    Test authenticated user can search posts by using a date range using the API
    """
    try:
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.SEARCH_POST_BY_DATES}"
        func_name = inspect.currentframe().f_code.co_name
        user = None

        # get userData from session
        if username in session_data.users_collection:
            user = session_data.users_collection[username]

        # Send Request
        res = requests.get(endpoint, headers={"auth-token": user["token"]}, json=date_payload)

        # Handle status response
        if res.status_code != 200:
            print(f"Search Posts By Dates - ({username}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate Expected result
        if res.status_code == 200:
            print(f"Search Posts By Dates - [PASS] - Status:[{res.status_code}] - ({user['username']}) Payload:")
            for post in res.json():
                print(post)

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def search_posts_by_title_test(session_data, username) -> None:
    """
    Test authenticated user can search posts by title keywords using the API
    """
    try:
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.SEARCH_POST_BY_TITLE_KEYWORDS.format(keywords='gym')}"
        func_name = inspect.currentframe().f_code.co_name
        user = None

        # get userData from session
        if username in session_data.users_collection:
            user = session_data.users_collection[username]

        # Send Request
        res = requests.get(endpoint, headers={"auth-token": user["token"]})

        # Handle status response
        if res.status_code != 200:
            print(f"Search Posts By Title keywords - ({username}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate Expected result
        if res.status_code == 200:
            print(f"Search Posts By Title keywords - [PASS] - Status:[{res.status_code}] - ({user['username']}) Payload: ")
            for post in res.json():
                print(post)

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def search_posts_by_username_test(session_data, username) -> None:
    """
    Test authenticated user can search posts by username using the API
    """
    try:
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.SEARCH_POST_BY_USERNAME.format(username=username)}"
        func_name = inspect.currentframe().f_code.co_name
        user = None

        # get userData from session
        if username in session_data.users_collection:
            user = session_data.users_collection[username]

        # Send Request
        res = requests.get(endpoint, headers={"auth-token": user["token"]})

        # Handle status response
        if res.status_code != 200:
            print(
                f"Search Posts By Username - ({username}) - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        # Validate Expected result
        if res.status_code == 200:
            print(f"Search Posts By Username - [PASS] - Status:[{res.status_code}] - ({user['username']}) Payload: ")
            for post in res.json():
                print(post)

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def delete_likes_test(session_data, username) -> None:
    """
    Test authenticated user can delete likes using the API
    """
    try:
        func_name = inspect.currentframe().f_code.co_name
        user = None
        # get userData from session
        if username in session_data.users_collection:
            user = session_data.users_collection[username]

        # Send Request
        endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.DELETE_LIKES}"
        res = requests.delete(endpoint, headers={"auth-token": user["token"]})
        # Handle status response
        if res.status_code != 200:
            print(f"Delete ALL Likes - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
        res.raise_for_status()

        if res.status_code == 200:
            print(f"Delete ALL Likes - [PASS] - Status:[{res.status_code}] Payload: {res.text}")

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def delete_posts_test(session_data, username) -> None:
    """
    test authenticated user can delete posts using the API
    """
    try:
        func_name = inspect.currentframe().f_code.co_name
        user = None

        # get userData and post from session
        if username in session_data.users_collection:
            user = session_data.users_collection[username]

        # delete all posts in collection
        for key in session_data.posts_collection:
            latest_post = session_data.posts_collection[key]
            if latest_post:
                # Send Request
                endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.DELETE_POST.format(post_id=latest_post['_id'])}"
                res = requests.delete(endpoint, headers={"auth-token": user["token"]})
                # Handle status response
                if res.status_code != 200:
                    print(f"Post Deleted - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
                    res.raise_for_status()
                if res.status_code == 200:
                    print(f"Post Deleted ({latest_post['_id']}) - [PASS] - Status:[{res.status_code}] Payload: {res.text}")

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def delete_users_test(session_data) -> None:
    """
    test authenticated user can delete users using the API
    """
    try:
        func_name = inspect.currentframe().f_code.co_name

        # delete all users in collection
        for key in session_data.users_collection:
            user = session_data.users_collection[key]
            if user:
                # Send Request
                endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.USER_DELETE.format(user_id=user['_id'])}"
                res = requests.delete(endpoint, headers={"auth-token": user["token"]})
                # Handle status response
                if res.status_code != 200:
                    print(f"User Deleted - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
                    res.raise_for_status()
                if res.status_code == 200:
                    print(f"User Deleted ({user['_id']}) - [PASS] - Status:[{res.status_code}] Payload: {res.text}")

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')


def delete_comments_test(session_data, username) -> None:
    """
    test authenticated user can delete comments using the API
    """
    try:
        func_name = inspect.currentframe().f_code.co_name
        user = None

        # get userData and post from session
        if username in session_data.users_collection:
            user = session_data.users_collection[username]

        # delete all comments in collection
        for key in session_data.comments_collection:
            comment = session_data.comments_collection[key]
            if comment:
                # Send Request
                endpoint = f"{API.BASE_URL}:{API.PORT}{ENDPOINT.DELETE_COMMENT.format(comment_id=comment['_id'])}"
                res = requests.delete(endpoint, headers={"auth-token": user["token"]})
                # Handle status response
                if res.status_code != 200:
                    print(f"Comment Deleted - [FAIL] - Status:[{res.status_code}] Error: {res.text}")
                    res.raise_for_status()
                if res.status_code == 200:
                    print(f"Comment Deleted ({comment['_id']}) - [PASS] - Status:[{res.status_code}] Payload: {res.text}")

    except Exception as e:
        print(f'Error [{func_name}] - Details: {e}')



# ------ RUN ALL TEST IN MAIN ------------------------
if __name__ == '__main__':

    session= SessionData()

    # CREATE USERS
    print('Test Create User_1 - Leon')
    create_user_test(session, Data.leon_register_payload)

    print('Test Create User_2 - Ada')
    create_user_test(session, Data.ada_register_payload)

    print('Test Create User_3 - Grace')
    create_user_test(session, Data.grace_register_payload)

    print('Test Create User_4 - Chris')
    create_user_test(session, Data.chris_register_payload)

    print('Test Create User_5 - Victor')
    create_user_test(session, Data.victor_register_payload)

    print('Test Create User_6 - Emily')
    create_user_test(session, Data.emily_register_payload)
    print('-' * 50)

    # LOGIN USERS
    print('Test Login User_1 - Leon')
    login_user_test(session, Data.leon_login_payload)

    print('Test Login User_2 - Ada')
    login_user_test(session, Data.ada_login_payload)

    print('Test Login User_3 - Grace')
    login_user_test(session, Data.grace_login_payload)

    print('Test Login User_4 - Chris')
    login_user_test(session, Data.chris_login_payload)

    print('Test Login User_5 - Victor')
    login_user_test(session, Data.victor_login_payload)

    print('Test Login User_6 - Emily')
    login_user_test(session, Data.emily_login_payload)
    print('-' * 50)

    # CREATE POSTS BY AUTH USERS
    print('Test Create Post by User_1 - Leon')
    user_create_post_test(session, Data.leon_create_post_payload)

    print('Test Create Post by User_2 - Ada')
    user_create_post_test(session, Data.ada_create_post_payload)

    print('Test Create Post by User_3 - Grace')
    user_create_post_test(session, Data.grace_create_post_payload)

    print('Test Create Post by User_4 - Chris')
    user_create_post_test(session, Data.chris_create_post_payload)

    print('Test Create Post by User_5 - Victor')
    user_create_post_test(session, Data.victor_create_post_payload)

    print('Test Create Post by User_6 - Emily')
    user_create_post_test(session, Data.emily_create_post_payload)
    print('-' * 50)

    # RETRIEVE POSTS BY NON-AUTH USER
    print('Test Get All Posts by User_2 - Victor - NOT TOKEN')
    get_posts_not_auth_user_test(session, "VictorGideon")
    print('-' * 50)

    # RETRIEVE POSTS BY AUTH USER
    print('Test Get All Posts by User_1 - Leon')
    get_posts_by_auth_user_test(session, "LeonKennedy")
    print('-' * 50)

    # USER COMMENTS ON POST
    print('Test Comment in Post by User_1 - Leon')
    create_comment_in_post_test(session, Data.leon_create_comment_payload, "GraceAshcroft")

    print('Test Comment in Post by User_4 - Chris')
    create_comment_in_post_test(session, Data.chris_create_comment_payload, "GraceAshcroft")

    print('Test Comment in Post by User_5 - Victor')
    create_comment_in_post_test(session, Data.victor_create_comment_payload, "GraceAshcroft")
    print('-' * 50)

    # USER COMMENTS ON THEIR POST
    print('Test commenting on own post by User_3 - Grace')
    user_comment_own_post_test(session, "GraceAshcroft")
    print('-' * 50)

    #USER GETS POST WITH ALL COMMENTS
    print('Test Post with Comments by User_3 - Grace')
    get_post_with_comments_test(session, "GraceAshcroft")
    print('-' * 50)

    # USER LIKE POSTS - (Emily's)
    print('Test Grace liking Post by Emily')
    like_post_test(session, "GraceAshcroft", Data.grace_like_payload, "Emily_Subject6")

    print('Test Leon liking Post by Emily')
    like_post_test(session, "LeonKennedy", Data.leon_like_payload, "Emily_Subject6")

    print('Test Ada liking Post by Emily')
    like_post_test(session, "AdaWong", Data.ada_like_payload, "Emily_Subject6")

    print('Test Victor liking Post by Emily')
    like_post_test(session, "VictorGideon", Data.victors_like_payload, "Emily_Subject6")

    print('Test Chris liking Post by Emily')
    like_post_test(session, "ChrisRedfield", Data.chris_like_payload, "Emily_Subject6")

    print('Test Emily liking own post')
    like_post_test(session, "Emily_Subject6", Data.emily_like_payload, "Emily_Subject6")
    print('-' * 50)

    # USER RETRIEVES ALL POST
    print('Test Get All Posts by User_2 - Ada')
    get_posts_by_auth_user_test(session, "AdaWong")
    print('-' * 50)

    # USER SEARCHES FOR POSTS
    print('Test Search Posts by Dates - Ada')
    search_posts_by_dates_test(session, "AdaWong", Data.search_by_dates_payload)
    print('-' * 50)

    print('Test Search Posts by Title Keyword - Chris')
    search_posts_by_title_test(session, "ChrisRedfield")
    print('-' * 50)

    print('Test Search Posts by Username - Victor')
    search_posts_by_username_test(session, "VictorGideon")
    print('-' * 50)

    # DELETE LIKES - CLEAN UP
    print('DELETE LIKES - CLEAN UP')
    delete_likes_test(session, "AdaWong")
    print('-' * 50)

    # DELETE COMMENTS - CLEAN UP
    print('DELETE COMMENTS - CLEAN UP')
    delete_comments_test(session, "AdaWong")
    print('-' * 50)


    # DELETE POST - CLEAN UP
    print('DELETE POSTS - CLEAN UP')
    delete_posts_test(session, "AdaWong")
    print('-' * 50)


    # DELETE USERS - CLEAN UP
    print('DELETE USERS - CLEAN UP')
    delete_users_test(session)
    print('-' * 50)

    print('The end')


