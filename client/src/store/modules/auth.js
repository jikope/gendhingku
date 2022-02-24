const state = () => ({
  user: null
});

const mutations = {
  setUser(state, user) {
    state.user = user;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
