const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/author', () => {
  before(async () => Author.sequelize.sync());

  afterEach(async () => {
    await Promise.all([Author.destroy({ where: {} })]);
  });

  describe('with no records in the database', () => {
    describe('POST /author', () => {
      it('creates a new author in the database', async () => {
        const response = await request(app).post('/author').send({
          author: 'Donna Tartt',
        });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.author).to.equal('Donna Tartt');
        expect(newAuthorRecord.author).to.equal('Donna Tartt');
      });
    });
  });

  describe('with records in the database', () => {
    let authors;
    beforeEach(async () => {
      authors = await Promise.all([
        Author.create({
          author: 'Irvine Welsh'
        }),
        Author.create({
          author: 'William Boyd'
        }),
        Author.create({
          author: 'JKR'
        }),
      ]);
    });
    describe('GET /authors', () => {
      it('gets all author records', async () => {
        const response = await request(app).get('/author');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);

          expect(author.author).to.equal(expected.author);
        });
      });
    });

    describe('GET /author/:id', () => {
      it('gets author record by id', async () => {
        const author = authors[0];
        const response = await request(app).get(`/author/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.author).to.equal(author.author);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app).get('/author/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });

    describe('PATCH /author/:id', () => {
      it('updates author by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .patch(`/author/${author.id}`)
          .send({ author: 'Hugh Kristiansen' });
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedAuthorRecord.author).to.equal('Hugh Kristiansen');
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .patch('/author/12345')
          .send({ email: 'JKD' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });

    describe('DELETE /author/:id', () => {
      it('deletes author record by id', async () => {
        const author = authors[0];
        const response = await request(app).delete(`/author/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app).delete('/author/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });
  });

  describe('validation tests', () => {
    it('return an error if value is empty', async () => {
      const response = await request(app).post('/author').send({
        author: ''
      });
      expect(response.status).to.equal(400);
      expect(response.body.error.validatorKey).to.equal('notEmpty');
    });
    it('return an error if value is null', async () => {
      const response = await request(app).post('/author').send({});
      expect(response.status).to.equal(400);
      expect(response.body.error.validatorKey).to.equal('is_null');
    });
  });
});
