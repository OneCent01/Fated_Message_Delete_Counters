import {
  incrementUserDeletionCounter, 
  updateUserDeletionConter
} from '../helpers/deleteCounters.js';

export const handleMessageDeleteEvent = (event, sessionData) => {
  const {msgId} = event;

  Object.entries(sessionData.deleteCounters).map(([userId, deleteCounterData]) => {
    if(deleteCounterData.messageIds[msgId]) {
      sessionData.deleteCounters[userId].messageIds = Object.entries(sessionData.deleteCounters[userId].messageIds).reduce((acc, el) => {
        const [messageId, val] = el;
        if(msgId !== messageId) {
          acc[msgId] = el;
        }
        return acc;
      }, {});

      incrementUserDeletionCounter(sessionData, userId)
    }
  })
}

export const handleMessagesDeleteEvent = (event, sessionData) => {
  const {userId} = event;
  const userDeleteCounterData = sessionData.deleteCounters[userId];

  if(userDeleteCounterData) {
    const deletedMessagesCount = (
      userDeleteCounterData.deletedMessages + 
      Object.values(userDeleteCounterData.messageIds).length
    );

    updateUserDeletionConter(sessionData, userId, deletedMessagesCount)

    sessionData.deleteCounters[userId].messageIds = {};
  }


}