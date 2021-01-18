import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { PostValidators } from "../validators/PostValidators";

class PostRouter {
  public router: Router;
  constructor() {
    this.router = Router();

    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get(
      "/me",
      GlobalMiddleware.authenticate,
      PostController.getPostByUser
    );
    this.router.get(
      "/all",
      GlobalMiddleware.authenticate,
      PostController.getAllPost
    );
    this.router.get(
      "/:id",
      GlobalMiddleware.authenticate,
      PostValidators.getPostById(),
      GlobalMiddleware.checkError,
      PostController.getPostById
    );
  }

  postRoutes() {
    this.router.post(
      "/addPost",
      GlobalMiddleware.authenticate,
      PostValidators.addPost(),
      GlobalMiddleware.checkError,
      PostController.addPost
    );
  }

  patchRoutes() {}

  deleteRoutes() {}
}

export default new PostRouter().router;
