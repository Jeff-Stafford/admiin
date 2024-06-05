import { makeVar } from '@apollo/client';

export const isLoggedInVar = makeVar<boolean | null>(
  !!window.localStorage.getItem('sub')
);

export const subInVar = makeVar<string | null>(
  window.localStorage.getItem('sub')
);

export const selectedEntityIdInVar = makeVar<string | null>(
  window.localStorage.getItem('selectedEntityId')
);

export const userTypeInVar = makeVar<string | null>(
  window.localStorage.getItem('userType')
);

export const isHideToDoVar = makeVar<string | null>(
  window.localStorage.getItem('hideToDo')
);

export const unreadChatInVar = makeVar<boolean>(false);
