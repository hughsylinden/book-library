const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genre', () => {
  before(async () => Genre.sequelize.sync());

  afterEach(async () => {
    await Promise.all([Genre.destroy({ where: {} })]);
  });

  describe('with no records in the database', () => {
    describe('POST /genre', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genre').send({
          genre: 'Fiction',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal('Fiction');
        expect(newGenreRecord.genre).to.equal('Fiction');
      });
    });
  });

  describe('with records in the database', () => {
    let genres;
    beforeEach(async () => {
      genres = await Promise.all([
        Genre.create({
          genre: 'Sci-Fi',
        }),
        Genre.create({
          genre: 'Ficton',
        }),
        Genre.create({
          genre: 'Horror',
        }),
      ]);
    });
    describe('GET /genre', () => {
      it('gets all genre records', async () => {
        const response = await request(app).get('/genre');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.genre).to.equal(expected.genre);
        });
      });
    });

    describe('GET /genre/:id', () => {
      it('gets genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genre/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).get('/genre/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genre/:id', () => {
      it('updates genre by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genre/${genre.id}`)
          .send({ genre: 'Fantasy' });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal('Fantasy');
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .patch('/genre/12345')
          .send({ genre: 'sport' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('DELETE /genre/:id', () => {
      it('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genre/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).delete('/genre/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });

  describe('validation tests', () => {
    it('return an error if value is empty', async () => {
      const response = await request(app).post('/genre').send({
        genre: '',
      });
      expect(response.status).to.equal(400);
      expect(response.body.error.validatorKey).to.equal('notEmpty');
    });
    it('return an error if value is null', async () => {
      const response = await request(app).post('/genre').send({});
      expect(response.status).to.equal(400);
      expect(response.body.error.validatorKey).to.equal('is_null');
    });
  });
});
