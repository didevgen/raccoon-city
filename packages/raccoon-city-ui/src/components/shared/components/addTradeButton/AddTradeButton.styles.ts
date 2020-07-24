import styled from 'styled-components';

export const AddTradeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 0px;
    cursor: pointer;
`;

export const AddTradeIcon = styled.div`
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #2196f3;
    margin-bottom: 15px;

    &::after,
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2px;
        height: 20px;
        background-color: #fff;
    }

    &::after {
        width: 20px;
        height: 2px;
    }
`;
