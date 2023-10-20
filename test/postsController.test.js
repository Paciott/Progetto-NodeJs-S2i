// Imports
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { getAllPosts, getPostById, createNewPost, updatePost, deletePost } from '../src/controllers/postsController.js';
import pool from '../src/utils/dbPool.js';
chai.use(sinonChai);

// Tests
describe("Testing: POSTS crud operations", () => {

  let poolQueryStub;
  let poolExecuteStub;
  let res;

  describe("Testing: getAllPosts", () => {

    beforeEach(() => {
      // Mocking the response object
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stubbing the pool.query
      poolQueryStub = sinon.stub(pool, 'query');
    });

    it('should retrieve all posts if no filter is provided', async () => {
      poolQueryStub.onFirstCall().resolves([[{ id: 1, title: "Test Post" }]]);
      poolQueryStub.onSecondCall().resolves([[{ id: 1, type: "comment", content: "Test comment" }]]);

      await getAllPosts({ query: {} }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWithMatch({ count: 1 });
    });

    it('should retrieve posts filtered by author_id', async () => {
      poolQueryStub.onFirstCall().resolves([[{ id: 2, title: "Author's Post" }]]);
      poolQueryStub.onSecondCall().resolves([[{ id: 2, type: "comment", content: "Author's comment" }]]);

      await getAllPosts({ query: { author_id: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWithMatch({ count: 1 });
    });

    it('should retrieve posts filtered by date', async () => {
      poolQueryStub.onFirstCall().resolves([[{ id: 3, title: "Post on a Specific Date" }]]);
      poolQueryStub.onSecondCall().resolves([[{ id: 3, type: "comment", content: "Comment on that date" }]]);

      await getAllPosts({ query: { date: '2023-10-20' } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWithMatch({ count: 1 });
    });

    it('should retrieve posts filtered by both author_id and date', async () => {
      poolQueryStub.onFirstCall().resolves([[{ id: 4, title: "Author's Post on a Specific Date" }]]);
      poolQueryStub.onSecondCall().resolves([[{ id: 4, type: "comment", content: "Author's comment on that date" }]]);

      await getAllPosts({ query: { author_id: '1', date: '2023-10-20' } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWithMatch({ count: 1 });
    });

    it('should return 404 if no posts are found', async () => {
      poolQueryStub.resolves([[]]);

      await getAllPosts({ query: {} }, res);

      chai.expect(res.status).to.have.been.calledWith(404);
      chai.expect(res.json).to.have.been.calledWith({ message: "No posts found!" });
    });

    it('should return 400 if there is a database error', async () => {
      const mockError = new Error('Database error');
      poolQueryStub.rejects(mockError);

      await getAllPosts({ query: {} }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: mockError.message });
    });
  });

  describe("Testing: getPostById", () => {

    beforeEach(() => {
      // Mocking the response object
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stubbing the pool.query
      poolQueryStub = sinon.stub(pool, 'query');
    });

    it('should retrieve the post and its interactions if no filter is provided', async () => {
      const mockPostId = 1;
      poolQueryStub.onFirstCall().resolves([[{ id: mockPostId, title: "Test Post" }]]);
      poolQueryStub.onSecondCall().resolves([[{ id: 1, type: "comment", content: "Test comment", post_id: mockPostId }]]);

      await getPostById({ params: { slug: mockPostId.toString() }, query: {} }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWithMatch({ post: { id: mockPostId } });
    });

    // Repeat the same structure for other scenarios like filtering by date, city, or both.

    it('should return 404 if no post is found', async () => {
      poolQueryStub.resolves([[]]);

      await getPostById({ params: { slug: '999' }, query: {} }, res);

      chai.expect(res.status).to.have.been.calledWith(404);
      chai.expect(res.json).to.have.been.calledWith({ message: "No post found with selected ID!" });
    });

    it('should return 400 if there is a database error', async () => {
      const mockError = new Error('Database error');
      poolQueryStub.rejects(mockError);

      await getPostById({ params: { slug: '1' }, query: {} }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: mockError.message });
    });
  });

  describe("Testing: createNewPost", () => {

    beforeEach(() => {
      // Mocking the response object
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stubbing the pool.query and pool.execute
      poolQueryStub = sinon.stub(pool, 'query');
      poolExecuteStub = sinon.stub(pool, 'execute');
    });

    it('should successfully create a post with valid data', async () => {
      poolQueryStub.resolves([[{ id: 1, nickname: "TestUser", age: 25, city: "TestCity" }]]);
      poolExecuteStub.resolves([{}]);

      await createNewPost({ body: { title: 'Test Post', author_id: 1 } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: "Post successfully created!" });
    });

    it('should return a 400 error for invalid title', async () => {
      await createNewPost({ body: { title: '', author_id: 1 } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Please insert all the required parameters for the creation of a Post! Post title must be a not empty string" });
    });

    it('should return a 400 error for invalid author_id', async () => {
      await createNewPost({ body: { title: 'Test Post', author_id: 'invalid' } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Please insert all the required parameters for the creation of a Post! The post's author_id must be a number!" });
    });

    it('should return a 400 error if the author does not exist', async () => {
      poolQueryStub.resolves([[]]);

      await createNewPost({ body: { title: 'Test Post', author_id: 999 } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "The user who's trying to make a post doesn't exist!" });
    });

    it('should return a 400 error if there is a database error', async () => {
      const mockError = new Error('Database error');
      poolQueryStub.rejects(mockError);

      await createNewPost({ body: { title: 'Test Post', author_id: 1 } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: mockError.message });
    });
  });

  describe("Testing: updatePost", () => {

    beforeEach(() => {
      // Mocking the response object
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stubbing the pool.execute
      poolExecuteStub = sinon.stub(pool, 'execute');
    });

    it('should successfully update a post with valid data', async () => {
      poolExecuteStub.resolves([{ affectedRows: 1 }]);

      await updatePost({ body: { title: 'Updated Post', author_id: 1 }, params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: "Post successfully updated!" });
    });

    it('should return a 400 error for invalid title', async () => {
      await updatePost({ body: { title: '', author_id: 1 }, params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Please insert all the required parameters for the update of a Post! Post title must be a not empty string!" });
    });

    it('should return a 400 error for invalid author_id', async () => {
      await updatePost({ body: { title: 'Updated Post', author_id: 'invalid' }, params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Please insert all the required parameters for the update of a Post! The post's author_id must be a number!" });
    });

    it('should return a 400 error if the post does not exist', async () => {
      poolExecuteStub.resolves([{ affectedRows: 0 }]);

      await updatePost({ body: { title: 'Updated Post', author_id: 1 }, params: { slug: '999' } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Can't update post. Selected Post doesn't exist!" });
    });

    it('should return a 400 error if there is a database error', async () => {
      const mockError = new Error('Database error');
      poolExecuteStub.rejects(mockError);

      await updatePost({ body: { title: 'Updated Post', author_id: 1 }, params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: mockError.message });
    });
  });

  describe("Testing: deletePost", () => {

    beforeEach(() => {
      // Mocking the response object
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stubbing the pool.execute
      poolExecuteStub = sinon.stub(pool, 'execute');
    });

    it('should successfully delete a post with valid data', async () => {
      poolExecuteStub.onFirstCall().resolves([{ affectedRows: 1 }]);
      poolExecuteStub.onSecondCall().resolves([{}]);

      await deletePost({ body: { author_id: 1 }, params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: "Post successfully deleted!" });
    });

    it('should return a 400 error for invalid author_id', async () => {
      await deletePost({ body: { author_id: 'invalid' }, params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Please insert all the required parameters to delete a Post! The post's author_id must be a number!" });
    });

    it('should return a 404 error if the post does not exist', async () => {
      poolExecuteStub.resolves([{ affectedRows: 0 }]);

      await deletePost({ body: { author_id: 1 }, params: { slug: '999' } }, res);

      chai.expect(res.status).to.have.been.calledWith(404);
      chai.expect(res.json).to.have.been.calledWith({ error: "Can't delete post. The selected Post doesn't already exist!" });
    });

    it('should return a 400 error if there is a database error', async () => {
      const mockError = new Error('Database error');
      poolExecuteStub.rejects(mockError);

      await deletePost({ body: { author_id: 1 }, params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: mockError.message });
    });
  });
  
  // Restore every stub and mock after each test
  afterEach(() => {
    sinon.restore();
  });
});