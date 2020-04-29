const route = (state = [], action) => {
    switch (action.type) {
        case 'SET_ROUTES':
            return {...state, params: action.payload.params};
        default:
            return state;
    }
};

export default route;
