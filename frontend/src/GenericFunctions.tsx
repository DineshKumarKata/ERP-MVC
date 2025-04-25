import { PopupAction, LoadingAction } from "./redux/commonSlice";
import { store } from "./redux/store";
import { saveLoginDetails } from "../src/redux/loginSlice";

/**
 * Shows a message popup for user notification
 * @param type Boolean indicating success (true) or failure (false)
 * @param message Message text to display
 * @param redirectOnSuccess URL to redirect to after displaying the message
 * @param time Optional time in milliseconds to display the message
 */
export const ShowMessagePopup = (
  type: boolean,
  message: string,
  redirectOnSuccess: string,
  time?: number
): void => {
  try {
    store.dispatch(
      PopupAction({
        enable: true,
        type: type,
        message: message,
        redirectOnSuccess,
        time: time || null,
      })
    );
  } catch (error) {
    console.error("Error showing message popup:", error);
    alert("An error occurred while showing a notification");
  }
};

/**
 * Shows or hides the loading indicator
 * @param value Boolean indicating whether to show (true) or hide (false) the loader
 */
export const Loading = (value: boolean): void => {
  store.dispatch(LoadingAction({ enable: value }));
};

/**
 * Shows loading indicator while an async function is being executed
 * @param myFunction The async function to execute
 * @returns Result of the executed function
 */
export const CallingAxios = async <T,>(myFunction: Promise<T>): Promise<T> => {
  Loading(true);
  try {
    const result = await myFunction;
    return result;
  } finally {
    Loading(false);
  }
};

/**
 * Checks if user is logged in and updates Redux store if needed
 * @returns Boolean indicating if user is authenticated
 */
export const KeepLoggedIn = (): boolean => {
  try {
    const data: string | null = localStorage.getItem("LoginDetails");

    if (!data) {
      return false;
    }

    const parsedData = JSON.parse(data);

    if (parsedData && parsedData.token) {
      // Get current redux state to check if we need to update
      const currentState = store.getState().login.loginDetails;

      // Only dispatch if the login state is empty or different
      if (
        !currentState ||
        !currentState.token ||
        currentState.token !== parsedData.token
      ) {
        store.dispatch(saveLoginDetails(parsedData));
      }

      return true;
    } else {
      localStorage.clear();
      return false;
    }
  } catch (error) {
    console.error("Error in KeepLoggedIn:", error);
    localStorage.clear();
    return false;
  }
};

/**
 * Logs out the user by clearing their session data
 */
export const LoggedOut = (): void => {
  store.dispatch(saveLoginDetails(null));
  localStorage.clear();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/vignan";
  ShowMessagePopup(
    true,
    "Logged out successfully.",
    `${basePath}/StudentLoginPage`
  );
};
