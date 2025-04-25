import {useSelector, useDispatch,TypedUseSelectorHook} from 'react-redux';
import {
    LoadingAction,
    PopupAction,
  } from "./commonSlice";
  import { AppDispatch, RootState, store } from "./store";
  
  export const Loading = (value: boolean) => {
    store.dispatch(LoadingAction({ enable: value }));
  };
  
  export const ShowMessagePopup = (
    type: boolean,
    message: string,
    redirectOnSuccess: string
  ) => {
    store.dispatch(
      PopupAction({
        enable: true,
        type: type,
        message: message,
        redirectOnSuccess,
      })
    );
  };

export const useAppSelector: TypedUseSelectorHook<RootState> =  useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

