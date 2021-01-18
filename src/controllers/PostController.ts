import Post from "../models/Post";

export class PostController {
  static addPost(req, res, next) {
    const userId = req.user.user_id;
    const content = req.body.content;

    const post = new Post({
      user_id: userId,
      content: content,
      created_at: new Date(),
      updated_at: new Date(),
    });

    post
      .save()
      .then((post) => {
        res.send(post);
      })
      .catch((err) => {
        next(err);
      });
  }

  static async getPostByUser(req, res, next) {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const perPage = 2;
    let currentPage = page;
    let prevPage = page === 1 ? null : page - 1;
    let pageToken = page + 1;
    let totalPage;
    try {
      const postCount = await Post.countDocuments({ user_id: userId });
      totalPage = Math.ceil(postCount / perPage);
      if (totalPage === page || totalPage === 0) {
        pageToken = null;
      }

      if (page > totalPage) {
        throw Error("NO More Page to Show");
      }
      const posts = await Post.find({ user_id: userId }, { user_id: 0, __v: 0 })
        .populate("comments")
        .skip(perPage * page - perPage)
        .limit(perPage);

      res.json({
        post: posts,
        pageToken: pageToken,
        totalPage: totalPage,
        currentPage: currentPage,
        prevPage: prevPage,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAllPost(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    let perPage = 2;
    let currentPage = page;
    let prevPage = page === 1 ? null : page - 1;
    let pageToken = page + 1;
    let totalPage;
    try {
      const postCount = await Post.estimatedDocumentCount();
      totalPage = postCount / perPage;
      if (page > totalPage) {
        throw Error("No More Page To Show");
      }
      const posts = await Post.find({}, { __v: 0, user_id: 0 })
        .populate("comments")
        .skip(perPage * page - perPage)
        .limit(perPage);
      res.json({
        post: posts,
        pageToken: pageToken,
        totalPage: totalPage,
        currentPage: currentPage,
        prevPage: prevPage,
        count: posts[0].commentCount
      });
    } catch (e) {
      next(e);
    }
  }

  static async getPostById(req, res, next) {
        res.json({
            post: req.post,
            commentCount: req.post.commentCount
        })
  }
}
