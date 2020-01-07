import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import {Fragment} from 'react';
import {FabButtonContainer, StyledFab} from '../../../../shared/components/styled';
import {FlatFormDialog} from '../FlatForm/FlatForm';

interface AddFlatCardProps {
    level: number;
    sectionId: string;
    section: string;
    maxLevel: number;
}
export function AddFlatCard(props: AddFlatCardProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <Fragment>
            <FabButtonContainer>
                <StyledFab
                    color="secondary"
                    aria-label="add"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <AddIcon />
                </StyledFab>
            </FabButtonContainer>
            <FlatFormDialog
                open={open}
                setOpen={setOpen}
                isNew={true}
                sectionId={props.sectionId}
                maxLevel={props.maxLevel}
                flat={{level: props.level, section: props.section} as any}
            />
        </Fragment>
    );
}
