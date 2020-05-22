import {useQuery} from '@apollo/react-hooks';
import {Breadcrumbs, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {GET_BREADCRUMBS} from '../../../graphql/queries/breadcrumbQuery';
import {StyledLink} from '../../shared/components/styled';

const StyledBreadcrumbs = styled(Breadcrumbs)`
    h6,
    &.MuiTypography-colorTextSecondary {
        color: #fff;
    }
`;
export const AppBreadcrumbs = connect((state) => ({
    params: state.route.params,
    title: state.route.title
}))(({params, title}) => {
    const noParams = !params || params.length === 0;

    const {data, error, loading} = useQuery(GET_BREADCRUMBS, {
        variables: {
            args: params
        },
        skip: noParams
    });

    if (noParams && title) {
        return (
            <Typography variant="h6" color="textPrimary" style={{color: '#fff'}}>
                {title}
            </Typography>
        );
    }
    if (error || loading || !data) {
        return null;
    }
    return (
        <StyledBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            {data.getBreadcrumbs.map((breadcrumb, i) => {
                return (
                    <StyledLink key={breadcrumb.url} to={breadcrumb.url}>
                        <Typography variant="h6" color="textPrimary">
                            {breadcrumb.name}
                        </Typography>
                    </StyledLink>
                );
            })}
        </StyledBreadcrumbs>
    );
});
