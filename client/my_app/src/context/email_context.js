import { createContext } from 'react';

const email_context = createContext({
  i_email: '',
  set_i_email: () => {},
});

export default email_context;
