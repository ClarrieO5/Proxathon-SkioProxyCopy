import React from 'react';
import { renderToString } from 'react-dom/server';
import PopupWindow from '../components/PopupWindow';

export function renderPopup(popupProps, children) {
  return (
    <ReactComponent component={PopupWindow} {...popupProps}>
      {children}
    </ReactComponent>
  );
}
