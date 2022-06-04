/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  id: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal(state, { payload }) {
      const { type, id } = payload;
      state.type = type;
      state.id = id;
    },
    hideModal(state) {
      state.type = null;
      state.id = null;
    },
  },
});

export const { actions } = modalsSlice;
export default modalsSlice.reducer;
