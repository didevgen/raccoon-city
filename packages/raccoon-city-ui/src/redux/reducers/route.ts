const route = (state: any = {}, action) => {
    switch (action.type) {
        case 'SET_ROUTES':
            if (!!action.payload.params['0']) {
                return {...state, params: null};
            }
            return {...state, params: action.payload.params};
        case 'SET_TITLE':
            return {...state, title: action.payload.title};
        default:
            return state;
    }
};

export default route;
