export const setRouteParams = (params) => ({
    type: 'SET_ROUTES',
    payload: {
        params
    }
});

export const setTitle = (title) => ({
    type: 'SET_TITLE',
    payload: {
        title
    }
});
