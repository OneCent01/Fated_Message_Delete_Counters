export const initSessionData = () => {
  const state = {
    streamer: {
      id: null,
      username: null,
      token: null,
    },
    users: {},
    deleteCounters: {},
    shownCounters: new Set(),
  };

  return state;
};
