import Container from '@material-ui/core/Container';
import React from 'react';
import {HouseForm} from './HouseForm/HouseForm';
import styled from 'styled-components';

const FormContainer = styled.div`
    border: 1px solid #aaa;
`;

const FormBlock = styled.div`
    padding: 16px;
`;

export function HouseBuilder() {
    return (
        <Container maxWidth="md">
            <FormContainer>
                <FormBlock>
                    <HouseForm />
                </FormBlock>
            </FormContainer>
        </Container>
    );
}
