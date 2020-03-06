# Image upload with Rails and Angular

This walkthrough will guide you through the process of uploading an image to AWS with an Angular frontend, and a rails API.

## The starter code

We are re-creating our much loved bird app from module 3. Take a moment to have a look through the starter code.

- `angular-app` is the angular frontend. It is exactly the same as before, except `camelCase` properties have been replaced with `snake_case`, and all AJAX requests are pointing to `http://localhost:3000`
- `rails_api` is a Rails API with the birds resource scaffolded and `CORS` set up.

#### Setup

- Install all the frontend packages with `npm i` or `yarn install`.
- Set up the Rails api with `rails db:create db:migrate`.

## Carrierwave

Carrierwave is the de facto image uploading gem for Ruby on Rails. In its simplest form, carrierwave uploads images to a directory in our rails api.

We'll need to configure it to upload to our AWS account, and to handle base64 encoded images.

Add the following gems to your `Gemfile`

```
gem carrierwave
gem carrierwave-base64
gem fog-aws
```

And bundle!

>**Note:** `fog-aws` will handle uploading to AWS

## Generating an uploader

Now that we've installed `carrierwave`, we can use it to generate an uploader. Type the following command in your terminal:

```sh
$ rails g uploader Image
```

This should create the followig file: `app/uploaders/image_uploader.rb`

We need to modify it slightly:

```rb
class ImageUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  # include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  # storage :file
  storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    nil
  end

end
```

Firstly we are setting `fog` to handle our file storage, which will basically send the image to AWS

Secondly were are setting the storage directory to be `nil`. Otherwise fog will create unnecessary folders in our S3 bucket.

>**Note:** The uploader can do a number of cool things including: creating thumbnails, returning a default image if none is provided, whitelist the file extensions to ensure only certain file types are accepted.
>
> Check out the [Carrierwave Documentation](https://github.com/carrierwaveuploader/carrierwave) for more info.

## Mounting our uploader

Now we need to `mount` the uploader to the `image` property in our model:

```rb
class Bird < ApplicationRecord
  mount_uploader :image, ImageUploader
end
```

This tells Rails that the `image` property is more than just a string, but should be treated as a file that is stored on AWS.

## Configuring `carrierwave`

We now need to let carrierwave know our AWS details.

>**Note:** You must have an `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` environment variables!

Create a new initializer:

```sh
$ touch config/initializers/carrierwave.rb
```

And add the following code:

```rb
CarrierWave.configure do |config|

  config.fog_provider = 'fog/aws'

  config.fog_credentials = {
    provider: "AWS",
    region: "eu-west-1",
    aws_access_key_id: ENV["AWS_ACCESS_KEY"],
    aws_secret_access_key: ENV["AWS_SECRET_KEY"]
  }


  if Rails.env.production?
    config.root = Rails.root.join("tmp")
    config.cache_dir = "#{Rails.root}/tmp/uploads"
  end

  config.fog_directory = ENV["AWS_BUCKET_NAME"]

end
```

>**Note:** If you don't have an `AWS_BUCKET_NAME` environment variable, you'll need to hardcode your bucket name instead.

The `initializer` files configure Rails and will be loaded before all your controllers and models.

## Handling base64

### The controller

Firstly we need to add `base64` into our strong params in `birds_controller.rb`. This string will contain the encoded image data from our frontend. We won't be storing it on our model, but we do need to whitelist it.

```rb
# Only allow a trusted parameter "white list" through.
def bird_params
  params.require(:bird).permit(:name, :latin_name, :family, :base64)
end
```

### The uploader

We now need to create a module which will take our `base64` encoded string from the frontend, and convert it back into an image, and upload it to AWS.

This is identical to the `lib/imageUpload.js` file we created in the last module, except we doing it with ruby!

Create a new file `lib/uploader.rb`.

Inside we're going to create a new class, with two class methods:

- `split_base64` will extract the base64 data, and the mimetype from the string we send from the frontend
- `upload` will create the image from that string and upload it to AWS

We'll do them one at a time:

### `split_base64`

```rb
class Uploader

  def self.split_base64(string)
    if string.present? && string.match(%r{^data:(.*?);(.*?),(.*)$})
      return { type: $1, encoding: $2, data: $3, extension: $1.split('/')[1] }
    else
      return nil
    end
  end

end
```

Here we are using a regular expression to grab the various parts of the string.

>**Note** Remember a base64 encoded string looks someting like this `data:mimetype;encoding,base64Data`
> The `split_base64` method returns the following hash: `{ type: mimetype, encoding: encoding, data: base64Data }`

### `upload`

OK, let's add the actual uploading functionality now:

```rb
class Uploader

  def self.split_base64(string)
    .
    .
    .
  end
  

  def self.upload(params)
    
    image_data = split_base64(params[:base64])
    
    if image_data
      base64_data = image_data[:data]
      image = Base64.decode64(base64_data)

      temp_img_file = Tempfile.new("")
      temp_img_file.binmode
      temp_img_file << image
      temp_img_file.rewind

      img_params = {
        filename: "#{SecureRandom.hex}.#{image_data[:extension]}",
        type: image_data[:type],
        tempfile: temp_img_file
      }

      uploaded_file = ActionDispatch::Http::UploadedFile.new(img_params)
      params[:image] = uploaded_file
      params.delete(:base64)
    end
    return params
  end
  

end
```

Here we get the data from the `split_base64` method and use it to firstly decode the `base64_data` back into an image ready to upload.

We then create a hash called `img_params` which is the data we'll send on to AWS.

>**Note**: `SecureRandom` is an in-built Rails module that can be used to create random, unique strings, similar to the `uuid` module we used with Express.

We use `ActionDispatch` to upload the file, then set that to the image property of `params` ready to be saved into our database.

Finally we delete the `base64` property from the `params` so it **doesn't** cause any issues in our controller.

>**Note:** Since we are creating a custom module in our `lib` folder we need to ensure that we are loading it in. The line to do this has been added to the starter code for you in `config/application.rb`
>
>```config.eager_load_paths << Rails.root.join('lib')```

## Updating the controller

We now need to actually use this in our `bird_controller.rb` file **before** we create the image record.

Update the `create` action accordingly:

```rb
# POST /images
def create
  @bird = Bird.new(Uploader.upload(bird_params))

  .
  .
  .
end
```

So we pass the `image_params` to the `Uploader.upload` method, that will do the work of uploading the image, then we send the updated params on to the `Image.new` method, which will store the data in the database.

## Getting back the actual image url

In the last module we created an `imageSRC` virtual property which added the full AWS url to the start of the filename that was stored in our database. Let's create something similar here.

Inside `app/serializers/bird_serializer.rb` we can create an `image_src` method and replace it for the `image` attribute like so:

```rb
class BirdSerializer < ActiveModel::Serializer
  attributes :id, :name, :latin_name, :family, :image_src
  
  def image_src
  	object.image.url
  end
end
```

## Test it out!

Make sure the frontend is running with `gulp`, and start the rails api with `rails s`.

Navigate to `http://localhost:7000/birds/new` and fill in the form. Don't forget to add an image!

Once you hit save, you should be redirected to the `birdsIndex` route. But where's the image?

## Modifying the Angular app

In the rails controller in the strong params, you'll notice that rails would like all the data sent from the client to be wrapped in an object which matches the name of the model.

That's what the `require(:bird)` part is doing:

```rb
params.require(:bird).permit(:name, :latin_name, :family, :base64)
```

We _should_ really be sending the data from our Angular app like this:

```json
{
  "bird": {
    "name": "Blue Tit",
    "latin_name": "Cyanistes caeruleus",
    "family": "Paridae",
    "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."
  }
}
```

However, we are currently sending the data like this:

```json
{
  "name": "Blue Tit",
  "latin_name": "Cyanistes caeruleus",
  "family": "Paridae",
  "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."
}
```

Rails will attempt to modify the data we send it to match the desired payload, but it can't do that if we add extra properties that aren't actually present in the database. So our `base64` property gets removed.

We could remove the `require(:bird)` method from our strong params, but that would be frowned upon by Rails developers.

Instead, let's update our Angular app to work with the API.

In `src/js/controllers/birds.js` modify the `BirdsNewCtrl` and `BirdsEditCtrl` like so:

```js
BirdsNewCtrl.$inject = ['Bird', '$state'];
function BirdsNewCtrl(Bird, $state) {
  const vm = this;
  vm.bird = {};

  function birdsCreate() {
    // wrap the data in a `bird` object
    Bird
      .save({ bird: vm.bird })
      .$promise
      .then(() => $state.go('birdsIndex'));
  }

  vm.create = birdsCreate;
}

.
.
.

BirdsEditCtrl.$inject = ['Bird', '$stateParams', '$state'];
function BirdsEditCtrl(Bird, $stateParams, $state) {
  const vm = this;

  vm.bird = Bird.get($stateParams);

  function birdsUpdate() {
    // wrap the data in a `bird` object and pass the bird's id
    // to the model so it can generate the correct URL
    Bird.update({ id: vm.bird.id, bird: vm.bird }) 
      .$promise
      .then(() => $state.go('birdsShow', $stateParams));
  }

  vm.update = birdsUpdate;
}

```

Great, have another go at creating a bird with an image. Everything should work fine now!

## Bonus

Update the `birds_controller` to allow you to modify and existing bird's image.

>**Note:** `carrierwave` and `fog` work together to ensure that the previous image is deleted from your S3 bucket, when you modify or delete a bird from the API.

## Conclusion

Rails favours **convention over configuration** which allows us to build out project very quickly. However when we need to create something bespoke its no different to any other framework.

Luckily there's a huge community of Rails developers out there, and some great articles and blog posts. This walkthrough was inspired by [this excellent article by Sebastian Dobrincu](https://sebastiandobrincu.com/blog/how-to-upload-images-to-rails-api-using-s3)
