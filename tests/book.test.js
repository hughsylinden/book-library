const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  afterEach(async () => {
    await Promise.all([Book.destroy({ where: {} })]);
  });

  describe('with no records in the database', () => {
    describe('POST /book', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/book').send({
          title: 'The Goldfinch',
          author: 'Donna Tartt',
          genre: 'fiction',
          ISBN: '1234',
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('The Goldfinch');
        expect(newBookRecord.title).to.equal('The Goldfinch');
        expect(newBookRecord.author).to.equal('Donna Tartt');
        expect(newBookRecord.genre).to.equal('fiction');
        expect(newBookRecord.ISBN).to.equal('1234');
      });
    });
  });

  describe('with records in the database', () => {
    let books;
    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
          title: 'Trainspotting',
          author: 'Irvine Welsh',
          genre: 'fiction',
          ISBN: '5678',
        }),
        Book.create({
          title: 'Any Human Heart',
          author: 'William Boyd',
          genre: 'fiction',
          ISBN: '0987',
        }),
        Book.create({
          title: 'Harry Potter',
          author: 'JKR',
          genre: 'fantasy',
          ISBN: '4321',
        }),
      ]);
    });
    describe('GET /books', () => {
      it('gets all book records', async () => {
        const response = await request(app).get('/book');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe('GET /book/:id', () => {
      it('gets book record by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/book/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/book/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /book/:id', () => {
      it('updates book email by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/book/${book.id}`)
          .send({ author: 'JKR' });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.author).to.equal('JKR');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/book/12345')
          .send({ email: 'JKD' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /book/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/book/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/book/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });

  describe('validation tests', () => {
    it('return an error if value is empty', async () => {
      const response = await request(app).post('/book').send({
        author: '',
        title: 'book title',
      });
      expect(response.status).to.equal(400);
      expect(response.body.error.validatorKey).to.equal('notEmpty');
    });
    it('return an error if value is null', async () => {
      const response = await request(app).post('/book').send({
        name: null,
        title: 'author',
      });
      expect(response.status).to.equal(400);
      expect(response.body.error.validatorKey).to.equal('is_null');
    });
  });
});
