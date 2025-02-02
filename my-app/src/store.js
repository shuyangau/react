import { configureStore } from '@reduxjs/toolkit'
import reducer from './itemSlice';

export default configureStore({
    reducer: {
        itemDetails: reducer,
    },
})