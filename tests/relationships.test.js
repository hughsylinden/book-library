/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const request = require('supertest');
const { Reader, Book, Genre, Author } = require('../src/models');
const app = require('../src/app');

describe('relationships', () => {
  before(async () => Reader.sequelize.sync());

  let books;
  let readers;
  let genres;
  let authors;

  before(async () => {
    readers = await Promise.all([
      Reader.create({
        name: 'Hugh Kristiansen',
        email: 'hughk@gmail.com',
        password: 'password',
      }),
      Reader.create({
        name: 'Joan Linden',
        email: 'joanl@me.com',
        password: '12341234',
      }),
    ]);

    genres = await Promise.all([
      Genre.create({
        genre: 'Fiction',
      }),
      Genre.create({
        genre: 'Fantasy',
      }),
    ]);

    authors = await Promise.all([
      Author.create({
        author: 'JRR Tolkien',
      }),
      Author.create({
        author: 'Fyodor Dostoevsky',
      }),
    ]);

    books = await Promise.all([
      Book.create({
        title: 'Crime and Punishment',
        author: 'Placeholder',
        GenreId: genres[0].id,
        ReaderId: readers[0].id,
        AuthorId: authors[1].id,
      }),
      Book.create({
        title: 'Fellowship of the Ring',
        GenreId: genres[1].id,
        ReaderId: readers[1].id,
        AuthorId: authors[0].id,
      }),
      Book.create({
        title: 'Two Towers',
        GenreId: genres[1].id,
        ReaderId: readers[0].id,
        AuthorId: authors[0].id,
      }),
    ]);
  });


  describe('reader response', () => {
    let hughsBooks;
    let joansBooks;
    it('responds with an array of reader objects', async () => {
      const readerResponse = await request(app).get('/reader');
      hughsBooks = readerResponse.body[0].Books;
      joansBooks = readerResponse.body[1].Books;
      expect(readerResponse.body[0].name).to.equal('Hugh Kristiansen');
      expect(readerResponse.body[1].name).to.equal('Joan Linden');
    });
    it('each reader holds a book array', async () => {
      expect(hughsBooks[0].title).to.equal('Crime and Punishment');
      expect(hughsBooks[1].title).to.equal('Two Towers');
      expect(joansBooks[0].title).to.equal('Fellowship of the Ring');
    });
  });

  describe('genre response', async () => {
    let fantasyBooks;
    let fictionBooks;
    it('responds with an array of genre objects', async () => {
      const genreResponse = await request(app).get('/genre');
      fantasyBooks = genreResponse.body[1].Books;
      fictionBooks = genreResponse.body[0].Books;
      expect(genreResponse.body[0].genre).to.equal('Fiction');
      expect(genreResponse.body[1].genre).to.equal('Fantasy');
    });
    it('each genre holds a book array', async () => {
      expect(fantasyBooks[0].title).to.equal('Fellowship of the Ring');
      expect(fantasyBooks[1].title).to.equal('Two Towers');
      expect(fictionBooks[0].title).to.equal('Crime and Punishment');
    });
  });

  let tolkienBooks;
  let dostoevskyBooks;
  describe('author response', async () => {
    it('responds with an array of author objects', async () => {
      let authorResponse = await request(app).get('/author');
      tolkienBooks = authorResponse.body[0].Books;
      dostoevskyBooks = authorResponse.body[1].Books;
      expect(authorResponse.body[0].author).to.equal('JRR Tolkien');
      expect(authorResponse.body[1].author).to.equal('Fyodor Dostoevsky');
    });
    it('each author holds a book array', async () => {
      expect(tolkienBooks[0].title).to.equal('Fellowship of the Ring');
      expect(tolkienBooks[1].title).to.equal('Two Towers');
      expect(dostoevskyBooks[0].title).to.equal('Crime and Punishment');
    });
  });

  let crimeAndPunishment;
  let fellowship;
  let twoTowers;
  describe('book response', async () => {
    it('responds with an array of book objects', async () => {
      let bookResponse = await request(app).get('/book');
      crimeAndPunishment = bookResponse.body[0];
      fellowship = bookResponse.body[1];
      twoTowers = bookResponse.body[2];
      expect(crimeAndPunishment.title).to.equal('Crime and Punishment');
      expect(fellowship.title).to.equal('Fellowship of the Ring');
      expect(twoTowers.title).to.equal('Two Towers');
    });
    it('each book holds a genre object', async () => {
      expect(crimeAndPunishment.Genre.genre).to.equal('Fiction');
      expect(fellowship.Genre.genre).to.equal('Fantasy');
      expect(twoTowers.Genre.genre).to.equal('Fantasy');
    });
    it('each book holds a reader object', async () => {
      expect(crimeAndPunishment.Reader.name).to.equal('Hugh Kristiansen');
      expect(crimeAndPunishment.Reader.email).to.equal('hughk@gmail.com');
      expect(fellowship.Reader.name).to.equal('Joan Linden');
      expect(fellowship.Reader.email).to.equal('joanl@me.com');
      expect(twoTowers.Reader.name).to.equal('Hugh Kristiansen');
      expect(twoTowers.Reader.email).to.equal('hughk@gmail.com');
    });
  });
});
