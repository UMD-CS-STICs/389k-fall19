
# Week 7

This week we will be creating a blog engine from scratch! This project will help us consolidate all the information we learned so far into a practical application. 

To get started: 
- clone the `blog-engine-shell` folder in `/code`
- run `npm install`


## Explaining the completed code:

### Looking at index.js:
- **The first get request for ('/')**
    - Our data is stored with tags, and in the home page we want to return all the tags.
    - We find the tags in our data, and then return all of them.
    - We then render the home handlerbars, passing in the data.

    - **What is home.handlebars doing?**
    - home.handlebars is reused later by a different endpoint, so at the beginning we check if there is a tag or not. We then render the HTML, and for each of the data points we pass in, we create a new article with information about that data.

- **The second get request for ('/create')**
    - All this does is call the create.handlebars

    - **What is create.handlebars doing?**
    - create.handlebars has an HTML form. Notice that it has method='POST' and action='/create'. This is important because without this, the form would not know what to do after you hit submit.
    - Hitting the submit calls the post request for ('/create')

- **The post request for ('/create')**
    - Gets the body of the request and parses all of the fields accordingly.
    - Then we push that object to the data, and redirect back tot he home page.

- **The get request for ('/post/:slug)**    (note: Post here refers to the blog post, not post request. Confusing!)
    - We get the specified slug, finds that in the data.
    - If we don't find the blog post, we return the 404 handlers, if we do, we call the post.handlebars

    - **What is post.handlebars doing?**
    - post.handlebars simply renders the post with the specific fields, and specific content.

- **The get request for ('/tag/:tag')**
    - Here, we initially get all the tags in the data so we can pass that into home.handlebars in the bottom.
    - Then, we get the tag from the request parameters, find the posts that include that tag, and then render the home page with that tag, the posts, and all the tags.

    - **What is home.handlebars doing?**
    - home.handlebars is doing the same thing as before, but this time we are passing in a tag, so it will render if statement at the beginning of the handlebars, saying "Recent posts in:" instead of "Recent posts"

