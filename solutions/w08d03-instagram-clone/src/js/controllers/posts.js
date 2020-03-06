angular
  .module('instagramApp')
  .controller('PostsIndexCtrl', PostsIndexCtrl)
  .controller('PostsNewCtrl', PostsNewCtrl)
  .controller('PostsShowCtrl', PostsShowCtrl)
  .controller('PostsEditCtrl', PostsEditCtrl);

PostsIndexCtrl.$inject = ['Post'];
function PostsIndexCtrl(Post) {
  const vm = this;

  vm.all = Post.query();
}

PostsNewCtrl.$inject = ['Post', '$state'];
function PostsNewCtrl(Post, $state) {
  const vm = this;
  vm.post = {};

  function postsCreate() {
    if(vm.newForm.$valid) {
      Post
        .save(vm.post)
        .$promise
        .then(() => $state.go('postsIndex'));
    }
  }

  vm.create = postsCreate;
}

PostsShowCtrl.$inject = ['Post', 'PostComment', '$stateParams', '$state'];
function PostsShowCtrl(Post, PostComment, $stateParams, $state) {
  const vm = this;
  vm.newComment = {};
  vm.post = Post.get($stateParams);

  function postsDelete() {
    vm.post
      .$remove()
      .then(() => $state.go('postsIndex'));
  }

  vm.delete = postsDelete;

  function addComment() {
    PostComment
      .save({ postId: vm.post.id }, vm.newComment)
      .$promise
      .then((comment) => {
        vm.post.comments.push(comment);
        vm.newComment = {};
      });
  }

  vm.addComment = addComment;

  function deleteComment(comment) {
    PostComment
      .delete({ postId: vm.post.id, id: comment.id })
      .$promise
      .then(() => {
        const index = vm.post.comments.indexOf(comment);
        vm.post.comments.splice(index, 1);
      });
  }

  vm.deleteComment = deleteComment;
}

PostsEditCtrl.$inject = ['Post', '$stateParams', '$state'];
function PostsEditCtrl(Post, $stateParams, $state) {
  const vm = this;

  vm.post = Post.get($stateParams);

  function postsUpdate() {
    vm.post
      .$update()
      .then(() => $state.go('postsShow', $stateParams));
  }

  vm.update = postsUpdate;
}
