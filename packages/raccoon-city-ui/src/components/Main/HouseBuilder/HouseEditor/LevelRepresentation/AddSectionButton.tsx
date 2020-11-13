import React from 'react';
import {StyledButton} from './styledComponents';
import {useMutation} from '@apollo/react-hooks';
import {ADD_SECTION} from '../../../../../graphql/mutations/flatMutation';
import {GET_GROUPED_FLATS} from '../../../../../graphql/queries/houseQuery';

function AddSectionButton({houseId}) {
    const [addSection] = useMutation(ADD_SECTION);

    return (
        <StyledButton
            className="addSectionBtn"
            variant="contained"
            onClick={async () => {
                await addSection({
                    variables: {
                        uuid: houseId
                    },
                    refetchQueries: [
                        {
                            query: GET_GROUPED_FLATS,
                            variables: {
                                uuid: houseId
                            }
                        }
                    ]
                });
            }}
        >
            Добавить секцию
        </StyledButton>
    );
}

export default AddSectionButton;
