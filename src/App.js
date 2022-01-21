import { Amplify } from 'aws-amplify';

import { I18n } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

I18n.setLanguage('en');
const dict = {
     'en': {
         'Username': 'Email'
      }
}
I18n.putVocabularies(dict);

function App({ signOut, user }) {
  return (
    <>
      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default withAuthenticator(App);