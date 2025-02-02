import { createSlice } from '@reduxjs/toolkit'

export const itemSlice = createSlice({
    name: 'itemDetails',
    initialState: {
        fetching: false,
        hasError: false,
        allItemsDetails: [],
    },
    reducers: {
        fetchAllItemsRequest(state) {
            state.fetching = true
        },
        fetchAllItemsSuccess(state, action) {
            state.fetching = false
            state.allItemsDetails.push(action.payload)
        },
        fetchAllItemsFailure(state) {
            state.fetching = false
            state.hasError = true
        }
    }
});

export const { fetchAllItemsRequest, fetchAllItemsSuccess, fetchAllItemsFailure } = itemSlice.actions;
export default itemSlice.reducer;