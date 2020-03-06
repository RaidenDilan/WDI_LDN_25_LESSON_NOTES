const mongoose = require('mongoose');
const s3 = require('../lib/s3');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
},{
  timestamps: true
});

const postSchema = new mongoose.Schema({
  image: { type: String },
  caption: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [ commentSchema ]
});

postSchema
  .path('image')
  .set(function getPreviousImage(image) {
    this._image = this.image;
    return image;
  });

postSchema
  .virtual('imageSRC')
  .get(function getImageSRC() {
    if(!this.image) return null;
    return `https://s3-eu-west-1.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${this.image}`;
  });

postSchema.pre('save', function checkPreviousImage(next) {
  if(this.isModified('image') && this._image) {
    return s3.deleteObject({ Key: this._image }, next);
  }
  next();
});

postSchema.pre('remove', function removeImage(next) {
  if(this.image) s3.deleteObject({ Key: this.image }, next);
  next();
});

module.exports = mongoose.model('Post', postSchema);
