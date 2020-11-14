import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://${process.env.FIREBASE_NAME}.firebaseio.com`,
});

export const auth = admin.auth();
