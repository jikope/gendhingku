const state = () => ({
  isLoggedIn: false
});

const mutations = {
  setIsLoggedIn(state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
