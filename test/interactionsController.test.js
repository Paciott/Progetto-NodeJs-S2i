// Imports
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { getAllInteractions, getAllInteractionsOfAPost, createNewInteraction, updateInteraction, deleteInteraction } from '../src/controllers/interactionsController.js';
import pool from '../src/utils/dbPool.js';
chai.use(sinonChai);

// Tests
describe("Testing: INTERACTIONS crud operations", () => {

  let poolQueryStub;
  let poolInsertStub;
  let res;

  describe("Testing: getAllInteractions", () => {

    beforeEach(() => {
      // Mocking the response object
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stubbing the pool.query
      poolQueryStub = sinon.stub(pool, 'query');
    });

    it('should retrieve all interactions with valid results', async () => {
      const mockInteractions = [
        { id: 1, type: 'comment', content: 'Test comment', author_id: 1, post_id: 1 }
      ];
      poolQueryStub.resolves([mockInteractions]);

      await getAllInteractions({}, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: "Here are all the interactions currently present on the app!", interactions: mockInteractions });
    });

    it('should return a 404 if there are no interactions', async () => {
      poolQueryStub.resolves([[]]);

      await getAllInteractions({}, res);

      chai.expect(res.status).to.have.been.calledWith(404);
      chai.expect(res.json).to.have.been.calledWith({ message: "There are still no interactions on the app!" });
    });

    it('should return a 400 error if there is a database error', async () => {
      const mockError = new Error('Database error');
      poolQueryStub.rejects(mockError);

      await getAllInteractions({}, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: mockError.message });
    });
  });

  describe("Testing: getAllInteractionsOfAPost", () => {

    beforeEach(() => {
      // Mocking the response object
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stubbing the pool.query
      poolQueryStub = sinon.stub(pool, 'query');
    });

    it('should retrieve all interactions for a specific post with valid results', async () => {
      const mockInteractions = [
        { id: 1, type: 'comment', content: 'Test comment', author_id: 1, post_id: 1 }
      ];
      poolQueryStub.resolves([mockInteractions]);

      await getAllInteractionsOfAPost({ params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: "Here is the list of interactions of the selected Post!", count: mockInteractions.length, interactions: mockInteractions });
    });

    it('should return a 404 if the post has no interactions', async () => {
      poolQueryStub.resolves([[]]);

      await getAllInteractionsOfAPost({ params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(404);
      chai.expect(res.json).to.have.been.calledWith({ message: "The selected Post has no interactions yet!" });
    });

    it('should return a 400 error if there is a database error', async () => {
      const mockError = new Error('Database error');
      poolQueryStub.rejects(mockError);

      await getAllInteractionsOfAPost({ params: { slug: '1' } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: mockError.message });
    });
  });

  describe("Testing: createNewInteraction", () => {

    beforeEach(() => {
      // Mocking the response object
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stubbing the pool.query
      poolQueryStub = sinon.stub(pool, 'query');
      poolInsertStub = sinon.stub(pool, 'execute');
    });

    it('should create a comment interaction with valid data', async () => {
      poolQueryStub.onFirstCall().resolves([[{ id: 1 }]]);
      poolQueryStub.onSecondCall().resolves([[{ id: 1 }]]);
      poolInsertStub.resolves([{}]);

      const req = {
        body: {
          type: 'comment',
          author_id: 1,
          post_id: 1,
          content: 'Valid comment'
        }
      };

      await createNewInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWithMatch({ message: 'Interaction of type comment successfully created!' });
    });

    it('should create a like interaction with valid data', async () => {
      poolQueryStub.onFirstCall().resolves([[{ id: 1 }]]);
      poolQueryStub.onSecondCall().resolves([[{ id: 1 }]]);
      poolQueryStub.onThirdCall().resolves([[]]);
      poolInsertStub.resolves([{}]);

      const req = {
        body: {
          type: 'like',
          author_id: 1,
          post_id: 1,
          content: null
        }
      };

      await createNewInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWithMatch({ message: 'Interaction of type like successfully created!' });
    });

    it('should handle invalid interaction type', async () => {
      const req = {
        body: {
          type: '',
          author_id: 1,
          post_id: 1,
          content: 'Comment content'
        }
      };

      await createNewInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle invalid author_id', async () => {
      const req = {
        body: {
          type: 'comment',
          author_id: NaN,
          post_id: 1,
          content: 'Comment content'
        }
      };

      await createNewInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle invalid post_id', async () => {
      const req = {
        body: {
          type: 'comment',
          author_id: 1,
          post_id: NaN,
          content: 'Comment content'
        }
      };

      await createNewInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle non-existing author', async () => {
      poolQueryStub.onFirstCall().resolves([[]]);

      const req = {
        body: {
          type: 'comment',
          author_id: 99,
          post_id: 1,
          content: 'Comment content'
        }
      };

      await createNewInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle non-existing post', async () => {
      poolQueryStub.onFirstCall().resolves([[{ id: 1 }]]);
      poolQueryStub.onSecondCall().resolves([[]]);

      const req = {
        body: {
          type: 'comment',
          author_id: 1,
          post_id: 99,
          content: 'Comment content'
        }
      };

      await createNewInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle an existing like', async () => {
      poolQueryStub.onFirstCall().resolves([[{ id: 1 }]]);
      poolQueryStub.onSecondCall().resolves([[{ id: 1 }]]);
      poolQueryStub.onThirdCall().resolves([{ type: 'like' }]);

      const req = {
        body: {
          type: 'like',
          author_id: 1,
          post_id: 1,
          content: null
        }
      };

      await createNewInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle a database error', async () => {
      poolQueryStub.rejects(new Error('Database error'));

      const req = {
        body: {
          type: 'comment',
          author_id: 1,
          post_id: 1,
          content: 'Comment content'
        }
      };

      await createNewInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });
  });

  describe("Testing: updateInteraction", () => {

    beforeEach(() => {
      // Mock dell'oggetto di risposta
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stub per pool.query
      poolQueryStub = sinon.stub(pool, 'query');
    });

    it('should successfully update a comment interaction', async () => {
      poolQueryStub.resolves([{ affectedRows: 1 }]);

      const req = {
        params: { slug: '1' },
        body: {
          type: 'comment',
          author_id: 1,
          content: 'Updated comment'
        }
      };

      await updateInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: 'Comment updated successfully!' });
    });

    it('should handle invalid author_id', async () => {
      const req = {
        params: { slug: '1' },
        body: {
          type: 'comment',
          author_id: NaN,
          content: 'Content here'
        }
      };

      await updateInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should not allow updates for likes', async () => {
      const req = {
        params: { slug: '1' },
        body: {
          type: 'like',
          author_id: 1,
          content: null
        }
      };

      await updateInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle invalid comment content', async () => {
      const req = {
        params: { slug: '1' },
        body: {
          type: 'comment',
          author_id: 1,
          content: ''
        }
      };

      await updateInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle non-existent interaction', async () => {
      poolQueryStub.resolves([{ affectedRows: 0 }]);

      const req = {
        params: { slug: '1' },
        body: {
          type: 'comment',
          author_id: 1,
          content: 'Valid comment'
        }
      };

      await updateInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle a database error', async () => {
      poolQueryStub.rejects(new Error('Database error'));

      const req = {
        params: { slug: '1' },
        body: {
          type: 'comment',
          author_id: 1,
          content: 'Comment content'
        }
      };

      await updateInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });
  });

  describe("Testing: deleteInteraction", () => {

    beforeEach(() => {
      // Mock dell'oggetto di risposta
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      // Stub per pool.query
      poolQueryStub = sinon.stub(pool, 'query');
    });

    it('should successfully delete an interaction', async () => {
      poolQueryStub.resolves([{ affectedRows: 1 }]);

      const req = {
        params: { slug: '1' },
        body: { author_id: 1 }
      };

      await deleteInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: 'Interaction successfully deleted!' });
    });

    it('should handle invalid author_id', async () => {
      const req = {
        params: { slug: '1' },
        body: { author_id: NaN }
      };

      await deleteInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });

    it('should handle non-existent interaction', async () => {
      poolQueryStub.resolves([{ affectedRows: 0 }]);

      const req = {
        params: { slug: '1' },
        body: { author_id: 1 }
      };

      await deleteInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(404);
    });

    it('should handle a database error', async () => {
      poolQueryStub.rejects(new Error('Database error'));

      const req = {
        params: { slug: '1' },
        body: { author_id: 1 }
      };

      await deleteInteraction(req, res);
      chai.expect(res.status).to.have.been.calledWith(400);
    });
  });

  // Restore every stub and mock after each test
  afterEach(() => {
    sinon.restore();
  });

});
