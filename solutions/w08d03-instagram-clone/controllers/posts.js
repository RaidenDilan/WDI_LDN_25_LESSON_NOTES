const Post = require('../models/post');

function indexRoute(req, res, next) {
  Post
    .find()
    .populate('createdBy')
    .exec()
    .then((posts) => res.json(posts))
    .catch(next);
}

function createRoute(req, res, next) {

  if(req.file) req.body.image = req.file.filename;
  req.body.createdBy = req.user;

  Post
    .create(req.body)
    .then((post) => res.status(201).json(post))
    .catch(next);
}

function showRoute(req, res, next) {
  Post
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then((post) => {
      if(!post) return res.notFound();

      res.json(post);
    })
    .catch(next);
}

function deleteRoute(req, res, next) {
  Post
    .findById(req.params.id)
    .exec()
    .then((post) => {
      if(!post) return res.notFound();

      return post.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

function addCommentRoute(req, res, next) {

  req.body.createdBy = req.user;

  Post
    .findById(req.params.id)
    .exec()
    .then((post) => {
      if(!post) return res.notFound();

      const comment = post.comments.create(req.body);
      post.comments.push(comment);

      return post.save()
        .then(() => res.json(comment));
    })
    .catch(next);
}

function deleteCommentRoute(req, res, next) {
  Post
    .findById(req.params.id)
    .exec()
    .then((post) => {
      if(!post) return res.notFound();

      const comment = post.comments.id(req.params.commentId);
      comment.remove();

      return post.save();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  delete: deleteRoute,
  addComment: addCommentRoute,
  deleteComment: deleteCommentRoute
};
