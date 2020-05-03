const route = (state: any = {}, action) => {
    switch (action.type) {
        case 'SET_ROUTES':
            return {...state, params: action.payload.params};
        case 'SET_TITLE':
            return {...state, title: action.payload.title};
        default:
            return state;
    }
};

export default route;
