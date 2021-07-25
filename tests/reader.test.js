const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

describe('/readers', () => {
  before(async () => Reader.sequelize.sync());

  afterEach(async () => {
    await Promise.all([Reader.destroy({ where: {} })]);
  });

  describe('with no records in the database', () => {
    describe('POST /readers', () => {
      it('creates a new reader in the database', async () => {
        const response = await request(app).post('/reader').send({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'password',
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Elizabeth Bennet');
        expect(newReaderRecord.name).to.equal('Elizabeth Bennet');
        expect(newReaderRecord.email).to.equal('future_ms_darcy@gmail.com');
        expect(newReaderRecord.password).to.equal('password');
      });
    });
  });

  describe('with records in the database', async () => {
    let readers;
    beforeEach(async () => {
      readers = await Promise.all([
        Reader.create({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'password',
        }),
        Reader.create({
          name: 'Arya Stark',
          email: 'vmorgul@me.com',
          password: '12341234',
        }),
        Reader.create({
          name: 'Lyra Belacqua',
          email: 'darknorth123@msn.org',
          password: 'pa55word',
        }),
      ]);
    });
    describe('GET /readers', () => {
      it('gets all readers records', async () => {
        const response = await request(app).get('/reader');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(reader.password).to.equal(undefined);
        });
      });
    });

    describe('GET /reader/:id', () => {
      it('gets readers record by id', async () => {
        const reader = readers[0];
        const response = await request(app).get(`/reader/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
        expect(response.body.password).to.equal(undefined);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).get('/reader/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });

    describe('PATCH /readers/:id', () => {
      it('updates readers email by id', async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/reader/${reader.id}`)
          .send({ email: 'miss_e_bennet@gmail.com' });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal('miss_e_bennet@gmail.com');
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app)
          .patch('/reader/12345')
          .send({ email: 'some_new_email@gmail.com' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });

    describe('DELETE /readers/:id', () => {
      it('deletes reader record by id', async () => {
        const reader = readers[0];
        const response = await request(app).delete(`/reader/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).delete('/reader/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });

    describe('validation tests', () => {
      it('returns an error if email is invalid', async () => {
        const response = await request(app).post('/reader').send({
          name: 'test name',
          email: 'future_ms_darcy',
          password: 'password123',
        });
        expect(response.status).to.equal(400);
        expect(response.body.error.validatorKey).to.equal('isEmail');
      });

      it('returns an error if password length is too short', async () => {
        const response = await request(app).post('/reader').send({
          name: 'test name',
          email: 'future_ms_darcy@name.com',
          password: '123',
        });
        expect(response.status).to.equal(400);
        expect(response.body.error.validatorKey).to.equal('len');
      });
      it('return an error if value is empty', async () => {
        const response = await request(app).post('/reader').send({
          name: '',
          email: 'future_ms_darcy@email.com',
          password: '123123123',
        });
        expect(response.status).to.equal(400);
        expect(response.body.error.validatorKey).to.equal('notEmpty');
      });
      it('return an error if value is null', async () => {
        const response = await request(app).post('/reader').send({
          name: null,
          email: 'future_ms_darcy@gmail.com',
          password: '123123123',
        });
        expect(response.status).to.equal(400);
        expect(response.body.error.validatorKey).to.equal('is_null');
      });

      it('does not return password', async () => {
        const response = await request(app).get('/reader').send();
        expect(response.status).to.equal(200);
        expect(response.body.password).to.equal(undefined);
      });
    });
  });
});
