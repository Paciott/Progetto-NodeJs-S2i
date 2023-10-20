// Imports
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { getAllUsers, getUserById, createNewUser, updateUser, deleteUser } from '../src/controllers/usersController.js';
import pool from '../src/utils/dbPool.js';
chai.use(sinonChai);

// Tests
describe("Testing: USERS crud operations", () => {
  let poolQueryStub, res;

  beforeEach(() => {
    // Mocking the response object
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    // Stubbing the pool.query
    poolQueryStub = sinon.stub(pool, 'query');
  });

  describe("Testing: getAllUsers", () => {
    it('should return registered users if they exist', async () => {
      const mockUsers = [
        { id: 1, nickname: 'Test', age: 25, city: 'TestCity' }
      ];
      poolQueryStub.resolves([mockUsers]);

      await getAllUsers({}, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({
        message: "Here is the registered users list!",
        users: mockUsers
      });
    });

    it('should return a 404 if no users are registered', async () => {
      poolQueryStub.resolves([[]]);

      await getAllUsers({}, res);

      chai.expect(res.status).to.have.been.calledWith(404);
      chai.expect(res.json).to.have.been.calledWith({
        message: "No user is registered to the app yet!"
      });
    });

    it('should return a 400 if there is a database error', async () => {
      const mockError = new Error('Database error');
      poolQueryStub.rejects(mockError);

      await getAllUsers({}, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({
        error: mockError.message
      });
    });
  });

  describe("Testing: getUserById", () => {
    it('should return user details if the user exists', async () => {
      const mockUserId = 1;
      const mockUser = {
        id: mockUserId,
        nickname: 'Test',
        age: 25,
        city: 'TestCity'
      };

      poolQueryStub.resolves([[mockUser]]);

      await getUserById({ params: { slug: mockUserId.toString() } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({
        message: "Here is the selected user!",
        user: mockUser
      });
    });

    it('should return a 404 if the user is not found', async () => {
      const mockUserId = 1;
      poolQueryStub.resolves([[]]);

      await getUserById({ params: { slug: mockUserId.toString() } }, res);

      chai.expect(res.status).to.have.been.calledWith(404);
      chai.expect(res.json).to.have.been.calledWith({
        message: "No user found!"
      });
    });

    it('should return a 400 if there is a database error', async () => {
      const mockUserId = 1;
      const mockError = new Error('Database error');
      poolQueryStub.rejects(mockError);

      await getUserById({ params: { slug: mockUserId.toString() } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({
        error: mockError.message
      });
    });
  });


  describe("Testing: createNewUser", () => {
    it('should create a new user when valid data is provided', async () => {
      const mockBody = {
        nickname: 'Test',
        age: 25,
        city: 'TestCity'
      };
      poolQueryStub.resolves();
      await createNewUser({ body: mockBody }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: "User was created successfully!" });
    });

    it('should return a 400 error for invalid nickname', async () => {
      const mockBody = {
        nickname: ' ',
        age: 25,
        city: 'TestCity'
      };

      await createNewUser({ body: mockBody }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({error: "Enter all the required parameters to create a new user! Nickname must necessarily be a not empty string!"});
    });

    it('should return a 400 error for invalid age', async () => {
      const mockBody = {
        nickname: 'Test',
        age: -1,
        city: 'TestCity'
      };

      await createNewUser({ body: mockBody }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({error: "Enter all the required parameters to create a new user! Age must necessarily be a number greater than zero!"});
    });

    it('should return a 400 error for invalid city', async () => {
      const mockBody = {
        nickname: 'Test',
        age: 25,
        city: ''
      };

      await createNewUser({ body: mockBody }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Enter all the required parameters to create a new user! City must necessarily be a not empty string!" });
    });

    it('should return a 400 error for duplicate nickname', async () => {
      const mockBody = {
        nickname: 'Test',
        age: 25,
        city: 'TestCity'
      };

      poolQueryStub.rejects({ code: 'ER_DUP_ENTRY' });

      await createNewUser({ body: mockBody }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Sorry, the selected nickname it's already used" });
    });
  });

  describe("Testing: updateUser", () => {
    it('should update user when valid data is provided', async () => {
      const mockBody = {
        nickname: 'Test',
        age: 28,
        city: 'TestCity'
      };
      const mockUserId = 1;

      poolQueryStub.resolves([{ affectedRows: 1 }]);

      await updateUser({ body: mockBody, params: { slug: mockUserId.toString() } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: "User updated successfully" });
    });
    
    it('should return a 400 error for invalid nickname', async () => {
      const mockBody = {
        nickname: '',
        age: 25,
        city: 'TestCity'
      };
      const mockUserId = 1;

      await updateUser({ body: mockBody, params: { slug: mockUserId.toString() }  }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Enter all the required parameters to update an existing user! Nickname must necessarily be a not empty string!" });
    });

    it('should return a 400 error for invalid age', async () => {
      const mockBody = {
        nickname: 'Test',
        age: -1,
        city: 'TestCity'
      };
      const mockUserId = 1;

      await updateUser({ body: mockBody, params: { slug: mockUserId.toString() }  }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: "Enter all the required parameters to update an existing user! Age must necessarily be a number greater than zero!" });
    });

    it('should return a 400 error for invalid city', async () => {
      const mockBody = {
        nickname: 'Test',
        age: 28,
        city: ''
      };
      const mockUserId = 1;


      await updateUser({ body: mockBody, params: { slug: mockUserId.toString() }  }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ message: "Enter all the required parameters to update an existing user! City must necessarily be a not empty string!" });
    });

    it('should return a 400 error if user does not exist', async () => {
      const mockBody = {
        nickname: 'Test',
        age: 28,
        city: 'TestCity'
      };
      const mockUserId = 1;

      poolQueryStub.resolves([{ affectedRows: 0 }]);

      await updateUser({ body: mockBody, params: { slug: mockUserId.toString() } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ message: "Can't update user. Selected user doesn't exist!" });

    });
  });

  describe("Testing: deleteUser", () => {
    it('should delete a user when a valid ID is provided', async () => {
      const mockUserId = 1;

      poolQueryStub.resolves([{ affectedRows: 1 }]);

      await deleteUser({ params: { slug: mockUserId.toString() } }, res);

      chai.expect(res.status).to.have.been.calledWith(200);
      chai.expect(res.json).to.have.been.calledWith({ message: "User successfully deleted!" });
    });

    it('should return a 404 error when trying to delete a non-existent user', async () => {
      const mockUserId = 1;

      poolQueryStub.resolves([{ affectedRows: 0 }]);

      await deleteUser({ params: { slug: mockUserId.toString() } }, res);

      chai.expect(res.status).to.have.been.calledWith(404);
      chai.expect(res.json).to.have.been.calledWith({ error: "There is no user to delete with the selected ID" });
    });

    it('should return a 400 error if there is a problem deleting the user', async () => {
      const mockUserId = 1;
      const mockError = new Error('Database error');

      poolQueryStub.rejects(mockError);

      await deleteUser({ params: { slug: mockUserId.toString() } }, res);

      chai.expect(res.status).to.have.been.calledWith(400);
      chai.expect(res.json).to.have.been.calledWith({ error: mockError.message });
    });
  });

  // Restore every stub and mock after each test
  afterEach(() => {
    sinon.restore();
  });

});