import React, { createContext, useReducer } from "react";

const CourseContext = createContext();

//Reducer function

export const courseReducer = (state, action) => {
  switch (action.type) {
    case "SET_COURSES":
      return {
        ...state,
        courses: action.payload,
      };
      case "CREATE_COURSES":
      return {
        ...state,
        courses: [action.payload, ...state.courses],
      };

      default:
        return state;
  }
};

// Context Provider Bileşeni

export const CourseContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(courseReducer, {
      courses: null,
    });

    return (
      <CourseContext.Provider value={{ ...state, dispatch }}>
        {children}
      </CourseContext.Provider>
    );
}

export { CourseContext };

