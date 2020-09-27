import styled from 'styled-components';

export const ListContainer = styled.div`
    width: 90%;
    background-color: #fff;
`;

export const TableRowCellContainer = styled.div`
    width: 11.111%;
    (height):100% ;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 16px;
    border-right: 1px solid #3f51b5;
`;

export const RowContainer = styled.div`
    display: flex;
    justify-content: space-around;
    transition: all 0.3s;
    cursor: pointer;
    border-bottom: 1px solid #3f51b5;

    &:hover {
        background-color: #3f51b5;
        color: #fff;
    }
`;

export const Header = styled.div`
    display: flex;
    padding-right: 15px;
    border-bottom: 1px solid #3f51b5;
`;

export const TableCellContainer = styled.div`
    width: 11.111%;
    border-right: 1px solid #3f51b5;
    display: flex;
    justify-content: center;
    padding: 10px 0px;
`;

export const DataTable = styled.div`
    background-color: #fff;
    margin-top: 5px;
    padding: 10px 0px;
`;
