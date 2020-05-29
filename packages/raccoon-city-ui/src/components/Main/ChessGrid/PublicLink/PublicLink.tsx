import {useMutation} from '@apollo/react-hooks';
import {Fab} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {AUTH_APP} from '../../../../graphql/mutations/authMutation';

const StyledFab = styled(Fab)`
    margin-bottom: 16px !important;
`;

export function PublicLink() {
    const {developerUuid, apartmentComplexUuid, houseUuid} = useParams();
    const [auth, {data, loading, error}] = useMutation(AUTH_APP);

    useEffect(() => {
        auth({
            variables: {
                apiKey: process.env.REACT_APP_API_KEY
            }
        });
        // eslint-disable-next-line
    }, []);

    if (!data || loading || error) {
        return null;
    }
    let url = '';

    if (apartmentComplexUuid && houseUuid && developerUuid) {
        url = `/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/houseGrid/${houseUuid}`;
    } else if (developerUuid) {
        url = `/developers/${developerUuid}/chessgrid`;
    }

    url += `?authToken=${data.authApp.token}`;

    return (
        <a href={`${process.env.REACT_APP_PUBLIC_BASE_URL}${url}`} target="_blank" rel="noopener noreferrer">
            <StyledFab size="small" color="primary" aria-label="copy">
                <LinkIcon />
            </StyledFab>
        </a>
    );
}
