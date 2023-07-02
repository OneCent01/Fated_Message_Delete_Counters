import {
  FATED_USER_ID
} from '../helpers/consts.js';
import {getUsers} from '../helpers/fetch.js';
import {
  showCounter, 
  hideCounter, 
  flashCounter, 
  getDeleteCounterByNickname,
  initDeleteCounterData, 
  saveUserDeletionCounters, 
  removeUserDeletionCounter,
} from '../helpers/deleteCounters.js';

export const handleMessageEvent = async (event, sessionData) => {
  const {userId, msgId, text, tags} = event.data;

  if(!sessionData.users[userId]) {
    const users = await getUsers(sessionData, [userId], []);
    if(users?.length) {
      const [user] = users;
      sessionData.users[userId] = user;
    }
  }

  const counter = sessionData.deleteCounters[userId];
  if(counter) {
    counter.messageIds[msgId] = true;
  }

  const isMod = tags?.mod === '1';
  const isStreamer = userId === sessionData.streamer.id;
  const isDev = userId === FATED_USER_ID;
  if(isMod || isStreamer || isDev) {
    handleAdminMessage(text, sessionData);
  }
}

/*
ADMIN WIDGET COMMANDS
------------------------
** DELETION COUNTERS **

!showDeleteCounter USERNAME
!hideDeleteCounter USERNAME
!flashDeleteCounter USERNAME
!makeDeleteCounter USERNAME NICKNAME1,NICKNAME2
!removeDeleteCounter USERNAME/NICKNAME
*/

const handleAdminMessage = (message, sessionData) => {
  const [firstWord, secondWord] = message.trim().split(' ');

  switch(firstWord) {
    case('!showDeleteCounter'):
      handleShowDeleteCounter(sessionData, message);
      break;
    case('!hideDeleteCounter'):
      handleHideDeleteCounter(sessionData, message);
      break;
    case('!flashDeleteCounter'):
      handleFlashDeleteCounter(sessionData, message);
      break;
    case('!makeDeleteCounter'):
      handleMakeDeleteCounter(sessionData, message);
      break;
    case('!removeDeleteCounter'):
      handleRemoveDeleteCounter(sessionData, message);
      break;
    default:
      break;
  }
};

const handleDeleteCounterLookup = (sessionData, message) => {
  const messageFragments = message.trim().split(' ');
  if(messageFragments.length !== 2) {
    return;
  }

  const [command, nickname] = messageFragments;
  return getDeleteCounterByNickname(sessionData, nickname);
};

const handleShowDeleteCounter = (sessionData, message) => {
  const counter = handleDeleteCounterLookup(sessionData, message);
  counter?.element && showCounter(sessionData, counter.element);
};

const handleHideDeleteCounter = (sessionData, message) => {
  const counter = handleDeleteCounterLookup(sessionData, message);
  counter?.element && hideCounter(sessionData, counter.element);
};

const handleFlashDeleteCounter = (sessionData, message) => {
  const counter = handleDeleteCounterLookup(sessionData, message);
  counter?.element && flashCounter(sessionData, counter.element);
};

const handleMakeDeleteCounter = async (sessionData, message) => {
  const messageFragments = message.trim().split(' ');
  if(messageFragments.length < 2 || messageFragments.length > 3) {
    return;
  }
  
  const [command, username, nicknames] = messageFragments;
  const users = await getUsers(sessionData, [], [username])
  if(!users?.length) {
    return;
  }

  const [user] = users;
  const formattedNicknames = nicknames?.split(',') || [];
  
  await initDeleteCounterData(sessionData, user.id, formattedNicknames)
  await saveUserDeletionCounters(sessionData);

  return;
};

const handleRemoveDeleteCounter = (sessionData, message) => {
  const messageFragments = message.trim().split(' ');
  if(messageFragments.length !== 2) {
    return;
  }
  removeUserDeletionCounter(sessionData, messageFragments[1]);
  return;
};
