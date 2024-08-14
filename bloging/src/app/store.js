import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from '../redux/user/userSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { version } from 'mongoose'
import persistStore from 'redux-persist/es/persistStore'
import themeReducer from '../redux/theme/themeSlice'
const rootReducer = combineReducers({
  user: userReducer,
  theme:themeReducer,
})


const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const _persistReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
  reducer: _persistReducer,
  middleware:(getDefaultMiddleWare)=>getDefaultMiddleWare(
    {
      serializableCheck:false
    }
  )
})




export const persistor=persistStore(store);