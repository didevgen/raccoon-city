import styled from 'styled-components';

export const ListContainer = styled.div`
    width: 90%;
    background-color: #fff;
`;

export const TableRowCellContainer = styled.div`
    width: calc(100% / 9);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border-right: 1px solid #e0e0e0;
`;

export const RowContainer = styled.div`
    display: flex;
    background-color: white;
    justify-content: space-around;
    transition: all 0.3s;
    cursor: pointer;
    border-bottom: 1px solid #e0e0e0;

    &:hover {
        background-color: rgba(232, 79, 29, 0.2);
    }
`;

export const Header = styled.div`
    display: flex;
    background-color: white;
    border-bottom: 1px solid #e0e0e0;
`;

export const TableCellContainer = styled.div`
    width: calc(100% / 9);
    border-right: 1px solid #e0e0e0;
    display: flex;
    justify-content: center;
    padding: 8px 0;
`;

export const DataTable = styled.div`
    padding: 0;
`;
