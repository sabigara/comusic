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

import toaster from '../common/toaster';
import ToolBarItem from '../atoms/ToolBarItem';
import ToolBackItemContainer from '../atoms/ToolBarItemContainer';
import useBackendAPI from '../hooks/useBackendAPI';
import useAsyncCallback from '../hooks/useAsyncCallback';
import { useInvitations } from '../hooks/invitations';
import { useCurrentUser } from '../hooks/firebase';

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

type InvitationNotificationProps = {
  invitation: any;
};

const InvitationNotification: React.FC<InvitationNotificationProps> = ({
  invitation,
}) => {
  const backendAPI = useBackendAPI();
  const [accept, resp, err, loading] = useAsyncCallback(
    backendAPI.acceptInvitation.bind(backendAPI),
  );

  React.useEffect(() => {
    if (resp !== null) toaster.success('Success');
    if (err !== '') toaster.error('Sorry, something went wrong.');
  }, [resp, err]);

  return (
    <>
      <NotificationItem
        title="Invitation from Studio"
        message="You are invited. Press Accept to join them!"
      >
        {loading ? (
          <span>sending...</span>
        ) : (
          <>
            <Button intent={Intent.DANGER} onClick={() => {}}>
              Decline
            </Button>
            <Button
              intent={Intent.PRIMARY}
              onClick={() => accept(invitation.groupId)}
            >
              Accept
            </Button>
          </>
        )}
      </NotificationItem>
    </>
  );
};

const Notification: React.FC = () => {
  const user = useCurrentUser();
  const [invitations, resp, loading] = useInvitations(user?.email);

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
          {invitations.map((inv: any) => (
            <InvitationNotification key={inv.id} invitation={inv} />
          ))}
        </div>
      </Popover>
    </ToolBackItemContainer>
  );
};

export default Notification;
