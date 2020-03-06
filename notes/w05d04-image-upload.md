---
title: Image Upload with Expess
type: lesson
duration: "1:40"
creator:
    name: Mike Hayden
    city: London
competencies: Server Applications
---

# Image Upload with Expess

### Objectives
*After this lesson, students will be able to:*

- Upload images to Amazon Web Services
- Configure `multer` and `multer-s3`
- Create and use environment variables

### Preparation
*Before this lesson, students should already be able to:*

- Create a RESTful App with Express
- Create an AWS account

## Intro (10 mins)

Uploading images is a desirable feature to want to implement in a web app.

Often we store images on our own server, but to save bandwidth, we can also use a CDN or content delivery network. CDNs are designed to serve assets (files, images, videos etc) at high speeds to websites. We've been using CDNs to add jQuery to our apps during this module.

We could upload images directly to our servers, but unfortunately heroku is a read-only service. It will not allow programmatic uploading to sites hosted on it's servers.

Instead we'll be using Amazon Web Services (AWS) to host our uploaded content.

AWS has a cloud storage service called s3, which we'll be using to upload our images to.

In this session we'll allow our users to add an avatar on signup. When they've logged in we'll redirect them to their profile page so we can see that everything has worked correctly.

### An AWS account

Before you continue, you'll need the following:

- An AWS account
- AWS user with full s3 permissions
- s3 bucket with bucket policy
- AWS access keys set up as environment variables

If you don't have these, or aren't sure, follow this helpful screencast:

[Setting Up an AWS Account, User Permissions and S3 Bucket](https://vimeo.com/192339731)
It's password protected. Ask your instructor for the password.

## A profile page (10 mins)

We can use our registrations controller for this:

```js
function showRoute(req, res) {
  return res.render('registrations/show');
}
```

And hook it up in our router like so:

```js
router.route('/profile')
  .get(secureRoute, registrations.show);
```

It's important that we use our `secureRoute` middleware, since we only want to allow logged in users to this page.

Finally, let's add the view in `views/registrations/show.ejs`:

```html
<div>
  <h1><%= user.username %></h1>
  <img src="<%= user.image %>" alt="<%= user.username %>">
  
  <form method="POST" action="/profile">
    <input type="hidden" name="_method" value="DELETE">
    <button>Delete Account</button>
  </form>
</div>
```

Notice we have a Delete Account button. We'll be needing that later.

## Updating the register form (5 mins)

There are two very important things we need to add to the register form.

Firstly we need to add a `file` input to allow the user to select an image they want to upload.

Secondly we need to add a special `enctype` attribute which tells the form that it will not be containing just text:

```html
<form method="POST" action="/register" enctype="multipart/form-data">
  <div>
    <label for="username">Username</label>
    <input type="text" name="username" id="username">
  </div>
  <div>
    <label for="email">Email</label>
    <input type="email" name="email" id="email">
  </div>
  <div>
    <label for="image">Image</label>
    <input type="file" name="image" id="image">
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" name="password" id="password">
  </div>
  <div>
    <label for="passwordConfirmation">Password Confirmation</label>
    <input type="password" name="passwordConfirmation" id="passwordConfirmation">
  </div>

  <button>Register</button>
</form>
```

## The model (5 mins)

```js
const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  image: { type: String },
  password: { type: String, required: true }
});
```

Since we are not actually saving our image in the database, a `String` type will suffice here. The idea is that we store the **filename** in the database and use it to populate the `src` attribute of an image tag.

## Connecting to AWS (5 mins)

We now need to make a connection to Amazon's S3 API. To do this we're going to use the `aws-sdk` module on npm. Install it now:

```sh
$ npm i --save aws-sdk
```

We now need to configure it to connect to the bucket that we created earlier. Create a file called `s3` in the `lib/` folder:

```js
const S3 = require('aws-sdk/clients/s3');

module.exports = new S3({
  region: 'eu-west-1',
  params: { Bucket: process.env.AWS_BUCKET_NAME },
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});
```

As long as your environment variables are named correctly, everything should be fine!

## Handling the form data (15 mins)

So far we have been using `body-parser` to handle our form data. `body-parser` is great, but it can't handle forms with files that need to uploaded.

We have another package for that, `multer`. `multer` allows us to process files sent to our server in forms.

Since we are using `multer` with AWS, we also need to install `multer-s3`. We're also going to install a unique, random string generator called `uuid`. More on that later.

```sh
$ npm i --save multer multer-s3 uuid
```

Ok, let's create a new file in `lib/` called `upload.js`:

```js
const s3 = require('./s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid');

module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key(req, file, next) {
      const ext = file.mimetype.replace('image/', '');
      next(null, `${uuid.v4()}.${ext}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  })
});
```

The setup here is a little invloved. Firstly we're pulling in that configured connection to s3 that we just made, then the other packages we just installed.

We then configure `multer`. We're setting the storage to be `multerS3`, which we also have to configure.

The `key` refers to the name of the file. This is where our unique random string generator comes into play. It's important that when we upload images we rename them. It's very easy for hackers to upload malicious files using our registration form. If we keep the original file name, it's trivial for the hacker to execute that file from  the browser. By renaming the file to something long and random, they'll have less of a chance.

We create a random file name using the method `.v4()`. We need to add the file extension onto the filename, which we can get from the file's mime type property.

All files have a mime type. Here are some examples:

| mime type | extension | example |
|:----------|:----------|:--------|
| image/png | .png | image file |
| image/jpeg | .jpeg | image file |
| text/html | .html | html document |
| application/json | .json | json file |
| audio/mp3 | .mp3 | audio file |

Mime types tell a browser how it should process a file.

By removing the `image/` part of the mime type we are left with the extension, which we can add to the end of the filename.

The `contentType` is similar to the mime type. It tells AWS what format it should store the file in. By default it will be set to `application/octet-stream`. We can ask `multerS3` to guess the file's actual type with the `multerS3.AUTO_CONTENT_TYPE` property.

## Uploading our first image (15 mins)

Ok, we're pretty close now. We need to use our configured `multer` in `config/routes.js`:

```js
const upload = require('../lib/upload');
.
.
.
router.route('/register')
  .get(registrations.new)
  .post(upload.single('image'), registrations.create);
```

When we register our user, we pass the form data through our `upload` module (our configured `multer` package). Here we are telling `multer` to expect a single file in our form. It will be sent from a `file` field with the name `image`.

`multer` will find the file, process it, rename it, and send it to our `s3` bucket. It will then store information about the file that was uploaded onto `req.file`.

#### Storing the filename

Now that the file info is on `req.file`, we need to get get the filename, and store it in our database.

Let's update our registrations controller's `createRoute`:

```js
function createRoute(req, res, next) {

  if(req.file) req.body.image = req.file.key;

  User
    .create(req.body)
    .then(() => res.redirect('/login'))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest('/register', err.toString());
      next(err);
    });
}
```

Pretty simple, huh?

Let's create a new account with an image.

If everything's hooked up correctly you'll see a broken image link.

The problem is we've stored the filename, but not the url.

#### Adding the URL

When we upload a file to S3, it is stored on a different server. The path is quite long, something like this:

```
https://s3-eu-west-1.amazonaws.com/your-bucket-name/filename.png
```

We could add that whole URL to the database, but that's generally considered bad practice.

If we move our images or rename our bucket, we have to manually update our database, which is a quite a high-risk move.

Instead, let's add a virtual `imageSRC` which will return the full path:

```js
userSchema
  .virtual('imageSRC')
  .get(function getImageSRC() {
    if(!this.image) return null;
    return `https://s3-eu-west-1.amazonaws.com/mickyginger/${this.image}`;
  });
```

Now let's use our new virtual on the profile page:

```html
<div>
  <h1><%= user.username %></h1>
  <img src="<%= user.imageSRC %>" alt="<%= user.username %>">

  <form method="POST" action="/profile">
    <input type="hidden" name="_method" value="DELETE">
    <button>Delete Account</button>
  </form>
</div>
```

Now, anytime we get a user from the database, the virtual will add that url to the filename. If we change the location of our uploded file, we can simply change the URL in the virtual.

Try registering again. You should now have a profile image for all the world to see!

## Deleting a user (10 mins)

It's great that we can allow our users to upload a profile image, but what about when they want to close their accounts? As it stands their image would remain on the server, and since it's been renamed to a random string, we have no way of knowing which one it is!

Let's add some logic in our model to deal with this:

```js
userSchema.pre('remove', function removeImage(next) {
  s3.deleteObject({ Key: this.image }, next);
});
```

Now, when we delete the user, the file is deleted along with it.

## Making things watertight (10 mins)

We want to prevent users from uploading anything other than images, and we want to keep our uploads to a reasonable 2MB limit.

We can do this with `fileFilter` and `limits` options in our `multer` config, in the `lib/upload.js` file:

```js
module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key(req, file, next) {
      const ext = file.mimetype.replace('image/', '');
      next(null, `${uuid.v4()}.${ext}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  fileFilter(req, file, next) {
    const whitelist = ['image/png', 'image/jpeg', 'image/gif'];
    next(null, whitelist.includes(file.mimetype));
  },
  limits: {
    fileSize: 1024 * 1024 * 2
  }
});
```

Nice!

## Conclusion (5 mins)

Uploading files to a server is a security risk so we need to be careful how we go about it. Always whitelist the file types that your server should allow, pick a sensible maximum file size, and rename your file to something long, random and unique.

Happy coding!