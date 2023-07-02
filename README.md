# Image Factory Backend

This is a REST API made using Node.js, Express, and MongoDB to power [Image Factory](https://github.com/saarthak2002/ImageFactory)- the AI generated image sharing social media platfrom I have created. The main git repo for the React Native app can be viewed [here](https://github.com/saarthak2002/ImageFactory). This REST API is hosted on Heroku, and the MongoDB instance used by Image Factory is hosted on MongoDB Atlas. Watch a full demonstration of the app [here](https://youtu.be/trwPyBvvdhU).

## Database Models
The database stores information in the following models:

### User
Fields: username, password, email, createdAt, updatedAt

### UserDetails
Fields: user, followers[], following[], profilePicture, bio

### Post
Fields: image, caption, prompt, aesthetic, postedByUser, postedByUserName, likedBy[], createdAt, updatedAt

### Comment
Fields: postId, userId, username, commentText, createdAt, updatedAt

## Endpoints

Here is a brief description of the main API endpoints:

### .../api/users/auth
Checks a username and password combination and returns an auth token or error message to the client, depending on if the user exists and the password is correct.

### .../api/users/signup
Creates a new user with username, email, and password. Also creates a new UserDetails object for that user.

### .../api/users/search/:searchString
Finds all the users whose usernames match the search string. Produces a JSON response that contains an array with both the UserDetails and basic info for each user in the search results.

### .../api/userdetails/user/:user_id
Returns the UserDetails object for a particular User.

### .../api/userdetails/follow
Enables a user to follow another user by adding the appropriate users to the following and followers lists of the UserDetails objects. The request body must contain the user performing the action and the user they want to follow.

### .../api/userdetails/unfollow
Works like the 'follow' endpoint, but removes users from the following and followers lists instead.

### .../api/userdetails/profilepicture
Updates the profile picture link (from the CDN) in the UserDetails object of the currently logged in user.

### .../api/userdetails/bio/:id
Updates the bio field of the UserDetails object of the current user.

### .../api/posts/
Creates a new post in the database when a POST request is made to this endpoint with the details of the post in the request body.

### .../api/posts/:id
Returns a JSON response to the client that contains the details of a particular post.

### .../api/posts/user/:id
Returns a JSON array that contains all the posts made by a particular user.

### .../api/posts/feed/:user_id
This endpoint returns an array of posts to the client for the custom feed view of each user. The posts depend on what other users the currently logged-in user follows and are sent in reverse chronological order. This endpoint also implements pagination- the request body contains a limit for the number of posts sent to the client. As the user scrolls to the bottom of their feed, another API call is made to this endpoint with a higher limit to load more posts.

### .../api/posts/like/:id
Adds the logged-in user to the likedBy[] array of the post with the specified id.

### .../api/posts/unlike/:id
Removes the logged-in user from the likedBy[] array of the post with the specified id.

### .../api/posts/edit/:id
This endpoint modifies a post in the database to update various details like the post caption.

### .../api/posts/:id
A DELETE request made to this endpoint removes a specific post from the database.

### .../api/comments
A POST request made to this endpoint with the details of the comment in the request body creates a new Comment in the database.

### .../api/comments/:post_id
This endpoint can be used to get a JSON array of all the comments on a particular post specified by post_id.
