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