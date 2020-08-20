const { firestore } = require('firebase-admin');

const supertest = require('supertest');

const functions = require('../index');

const request = supertest(functions.api);

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn().mockImplementation(() => jest.fn()),
  firestore: jest.fn(),
  credential: {
    cert: jest.fn().mockImplementation(() => jest.fn()),
  },
}));

// describe('/hello world', () => {
//   firestore.mockImplementation(() => ({
//     // batch: () => ({ commit: jest.fn(), set: setSpy }),
//     collection: () => ({ doc: jest.fn() }),
//   }));

//   it('successfully invokes function', async () => {
//     const actual = await request.get('/hello-world');
//     const { ok, status, body, text } = actual;
//     expect(ok).toBe(true);
//     expect(status).toBeGreaterThanOrEqual(200);
//     expect(body).toBeDefined();
//     expect(text).toEqual('Hello World!! /devlinktag-dev/');
//   });
// });

describe('/api/login', () => {
  firestore.mockImplementation(() => ({
    // batch: () => ({ commit: jest.fn(), set: setSpy }),
    // collection: () => ({ doc: jest.fn() }),

    collection: jest.fn().mockImplementation(() => {
      return {
        doc: jest.fn().mockImplementation(() => {
          return {
            get: jest.fn().mockImplementation(() => {
              return {
                data: jest.fn()
              };
            })
          };
        })
      };
    })
  }));

  const user = {
    uid: 'test_uid',
    email: 'test_email',
    photoURL: 'test_uid'
  };
  
  // 회원인 경우
  it('successfully invokes function', async () => {
    const actual = await request.post('/api/login').send({
      uid: 'test_uid',
      email: 'test_email',
      photoURL: 'test_uid'
    });

    
    const { ok, status, body, text } = actual;

    console.log("status : ", status);
    console.log("body : ", body);
    console.log("text : ", text);
    
    // expect(ok).toBe(true);
    expect(status).toEqual(201);
    expect(body).toEqual({
      message: "signup successfully",
        body : {
          uid: 'test_uid',
          email: 'test_email',
          photoURL: 'test_uid',
        }
    });

  });
  // 비회원인 경우

  
});

// TODO : Firestore CRUD 테스트 추가
