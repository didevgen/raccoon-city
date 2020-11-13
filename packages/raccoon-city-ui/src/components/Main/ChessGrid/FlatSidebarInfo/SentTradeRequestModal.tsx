import React from 'react';
import {Modal, ModalContainer, TextWrapper, MainColorPainter, StyledCloseIcon} from './styledComponents';

export default function SentTradeRequestModal({close}) {
    return (
        <ModalContainer>
            <Modal>
                <StyledCloseIcon onClick={() => close(false)} />
                <TextWrapper>
                    <MainColorPainter>Спасибо!</MainColorPainter>
                </TextWrapper>
                <TextWrapper>Ваша заявка принята!</TextWrapper>
                <TextWrapper>В течение 10 мин с Вами свяжется наш менеджер</TextWrapper>
            </Modal>
        </ModalContainer>
    );
}
