export const defaultUserState = {
  displayController: true,
  darkMode: false,
  logged: true, //this property is not used, as loggin has its own context-reducer, but I will explore the possibility to centralize it here or not
};
export type UserPreferencesState = typeof defaultUserState;
