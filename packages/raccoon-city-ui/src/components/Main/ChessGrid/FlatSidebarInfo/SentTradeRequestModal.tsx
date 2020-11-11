import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {Modal, ModalContainer, TextWrapper, MainColorPainter} from './styledComponents';

export default function SentTradeRequestModal({close}) {
    return (
        <ModalContainer>
            <Modal>
                <CloseIcon
                    onClick={() => close(false)}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        color: '#e84f1D'
                    }}
                />
                <TextWrapper>
                    <MainColorPainter>Спасибо!</MainColorPainter>
                </TextWrapper>
                <TextWrapper>Ваша заявка принята!</TextWrapper>
                <TextWrapper>В течение 10 мин с Вами свяжется наш менеджер</TextWrapper>
            </Modal>
        </ModalContainer>
    );
}
