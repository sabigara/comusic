import React, { useState } from 'react';
import {
  Classes,
  Card,
  H5,
  Intent,
  Button,
  Popover,
  Position,
  Icon,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import styled from 'styled-components';

import ToolBarItem from '../atoms/ToolBarItem';
import ToolBackItemContainer from '../atoms/ToolBarItemContainer';

type ItemProps = {
  title: string;
  message: string;
};

const NotificationItem: React.FC<ItemProps> = ({
  title,
  message,
  children,
}) => {
  return (
    <Card elevation={3}>
      <H5>{title}</H5>
      <p>{message}</p>
      <ActionList>{children}</ActionList>
    </Card>
  );
};

const ActionList = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Notification: React.FC = () => {
  const [isActive, setActive] = useState(false);
  return (
    <ToolBackItemContainer>
      <Popover
        popoverClassName={Classes.POPOVER_CONTENT_SIZING}
        position={Position.LEFT}
        onOpening={() => setActive(true)}
        onClosing={() => setActive(false)}
      >
        <ToolBarItem isActive={isActive} isLeftMost={true} isRightMost={true}>
          <Icon icon={IconNames.NOTIFICATIONS} iconSize={Icon.SIZE_LARGE} />
        </ToolBarItem>
        <div style={{ width: 300, maxHeight: 500, overflowY: 'auto' }}>
          <NotificationItem
            title="Invitation from Studio"
            message="You are invited. Press Accept to join them!"
          >
            <Button intent={Intent.DANGER}>Decline</Button>
            <Button intent={Intent.PRIMARY}>Accept</Button>
          </NotificationItem>
          <NotificationItem
            title="Invitation from Studio"
            message="You are invited. Press Accept to join them!"
          >
            <Button intent={Intent.DANGER}>Decline</Button>
            <Button intent={Intent.PRIMARY}>Accept</Button>
          </NotificationItem>
          <NotificationItem
            title="Invitation from Studio"
            message="You are invited. Press Accept to join them!"
          >
            <Button intent={Intent.DANGER}>Decline</Button>
            <Button intent={Intent.PRIMARY}>Accept</Button>
          </NotificationItem>
          <NotificationItem
            title="Invitation from Studio"
            message="You are invited. Press Accept to join them!"
          >
            <Button intent={Intent.DANGER}>Decline</Button>
            <Button intent={Intent.PRIMARY}>Accept</Button>
          </NotificationItem>
          <NotificationItem
            title="Invitation from Studio"
            message="You are invited. Press Accept to join them!"
          >
            <Button intent={Intent.DANGER}>Decline</Button>
            <Button intent={Intent.PRIMARY}>Accept</Button>
          </NotificationItem>
          <NotificationItem
            title="Invitation from Studio"
            message="You are invited. Press Accept to join them!"
          >
            <Button intent={Intent.DANGER}>Decline</Button>
            <Button intent={Intent.PRIMARY}>Accept</Button>
          </NotificationItem>
        </div>
      </Popover>
    </ToolBackItemContainer>
  );
};

export default Notification;
