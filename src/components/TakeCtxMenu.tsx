import React from 'react';
import { useDispatch } from 'react-redux';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import { deleteTake } from '../actions/takes';

type Props = {
  takeId: string;
};

type Data = {
  id: string;
  method: string;
};

const TakeContextMenu: React.FC<Props> = ({ takeId, children }) => {
  const dispatch = useDispatch();

  const handler = (e: any, data: Data) => {
    e.stopPropagation();
    switch (data.method) {
      case 'DELETE':
        dispatch(deleteTake(data.id));
        break;
    }
  };
  return (
    <div>
      <ContextMenu id={`take-ctx-${takeId}`}>
        <MenuItem data={{ method: 'DELETE', id: takeId }} onClick={handler}>
          Delete
        </MenuItem>
      </ContextMenu>
      <ContextMenuTrigger id={`take-ctx-${takeId}`} holdToDisplay={0}>
        {children}
      </ContextMenuTrigger>
    </div>
  );
};

export default TakeContextMenu;
