import {
  ROOT_HTML_TEMPLATE, 
  PAGE_CSS, 
  KDAWG_USER_ID, 
  FATED_USER_ID,
  ZULII_USER_ID,
} from './helpers/consts.js';
import {loadDeleteCounters} from './helpers/deleteCounters.js';

document.body.innerHTML = ROOT_HTML_TEMPLATE;

(() => {
  const head = document.getElementsByTagName('head')[0];
  const s = document.createElement('style');
  s.setAttribute('type', 'text/css');
  s.appendChild(document.createTextNode(PAGE_CSS));
  head.appendChild(s);
})();

import {handleMessageEvent} from './eventHandlers/message.js';
import {handleMessageDeleteEvent} from './eventHandlers/deleteMessage.js';
import {initSessionData} from './helpers/sessionState.js';
import {loadStreamerToken} from './helpers/fetch.js';

const sessionData = initSessionData();

window.addEventListener('onWidgetLoad', async event => {
  const {providerId, username} = event.detail.channel;
  // add streamer's ID to session data 
  const isDev = providerId === FATED_USER_ID;
  sessionData.streamer.username = isDev ? 'qZulli' : username;
  sessionData.streamer.id = isDev ? ZULII_USER_ID : providerId;

  // first get the streamer's access token and wait for it to load
  await loadStreamerToken(sessionData);
  await loadDeleteCounters(sessionData);
});

window.addEventListener('onEventReceived', event => {
  switch(event.detail.listener) {
    case('message'):
      handleMessageEvent(event.detail.event, sessionData);
      break;
    case('delete-message'):
      handleMessageDeleteEvent(event.detail.event, sessionData);
      break;
  }
});
