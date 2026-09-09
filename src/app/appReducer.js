export const initialState = {

    theme: "dark",

    currentChat: null,

    messages: [],

    replyMessage: null,

    editMessage: null,

    selectedMessages: [],

    contextMenu: {

        visible: false,

        x: 0,

        y: 0,

        message: null

    },

    search: "",

    typing: false

};

function appReducer(state, action) {

    switch (action.type) {

        case "SET_REPLY":

            return {

                ...state,

                replyMessage: action.payload

            };

        case "CLEAR_REPLY":

            return {

                ...state,

                replyMessage: null

            };

        case "OPEN_CONTEXT_MENU":

            return {

                ...state,

                contextMenu: action.payload

            };

        case "CLOSE_CONTEXT_MENU":

            return {

                ...state,

                contextMenu: initialState.contextMenu

            };

        default:

            return state;

    }

}

export default appReducer;