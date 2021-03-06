import React, { ReactElement, useCallback, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import {
  Classes,
  Intent,
  H5,
  Button,
  Dialog,
  Menu,
  MenuItem,
  InputGroup,
  Popover,
  Position,
  Icon,
  Tree,
  ITreeNode,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import '@blueprintjs/core/lib/css/blueprint.css';
import styled from 'styled-components';

import Color from '../common/Color';
import { GroupType } from '../common/Domain';
import toaster from '../common/toaster';
import { styledScrollRenderer } from '../common/utils';
import { RootState } from '../reducers';
import { StudioState } from '../reducers/studios';
import { ProfileState } from '../reducers/profiles';
import { SongState } from '../reducers/songs';
import { VersionState } from '../reducers/versions';
import useBackendAPI from '../hooks/useBackendAPI';
import useAsyncCallback from '../hooks/useAsyncCallback';
import { useCurrentUser } from '../hooks/firebase';
import { useFetchStudios } from '../hooks/studios';
import { useAddSong, useDelSong } from '../hooks/songs';
import { useAddVersion, useDelVersion } from '../hooks/versions';

enum NodeKind {
  Studio,
  Member,
  Song,
  Version,
}

type ProfileNodeData = {
  name: string;
} & ProfileState;

type NodeData = StudioState | ProfileNodeData | SongState | VersionState;

type Node = {
  kind: NodeKind;
  data: NodeData;
} & ITreeNode;

// Recursively compare every nodes.
function nodeDeepEquals(prev?: Node, curr?: Node): boolean {
  if (prev === undefined || curr === undefined) {
    return prev === curr;
  }
  if (prev.childNodes === undefined || curr.childNodes === undefined) {
    return prev.childNodes === curr.childNodes;
  }
  if (prev.childNodes?.length != curr.childNodes?.length) {
    return false;
  }
  return (
    prev.id === curr.id &&
    shallowEqual(prev.data, curr.data) &&
    prev.childNodes?.reduce((acc: boolean, child, i) => {
      return (
        acc &&
        nodeDeepEquals(
          child as Node,
          curr.childNodes ? (curr.childNodes[i] as Node) : undefined,
        )
      );
    }, true)
  );
}

function nodeListDeepEquals(prev: Node[], curr: Node[]): boolean {
  return prev.reduce((acc: boolean, child, i) => {
    return acc && nodeDeepEquals(child as Node, curr[i] as Node);
  }, true);
}

function iconForNodeKind(
  nodeKind: NodeKind,
): 'home' | 'person' | 'music' | 'document' | 'error' {
  switch (nodeKind) {
    case NodeKind.Studio:
      return IconNames.HOME;
    case NodeKind.Member:
      return IconNames.PERSON;
    case NodeKind.Song:
      return IconNames.MUSIC;
    case NodeKind.Version:
      return IconNames.DOCUMENT;
    default:
      return IconNames.ERROR;
  }
}

type Props = {
  setVerId: any;
};

const Browser: React.FC<Props> = ({ setVerId }) => {
  const user = useCurrentUser();
  // API call
  useFetchStudios(user?.id);

  const backendAPI = useBackendAPI();
  const addSong = useAddSong();
  const delSong = useDelSong();
  const addVersion = useAddVersion();
  const delVersion = useDelVersion();

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [groupId, setGroupId] = React.useState<{
    id: string;
    type: GroupType;
  } | null>(null);

  const { callback, loading } = useAsyncCallback(
    backendAPI.invite.bind(backendAPI),
    () => toaster.success('success'),
    (err) => toaster.error(err),
    () => setDialogOpen(false),
  );

  const onInviteSubmit = async () => {
    if (groupId === null) return;
    callback(groupId.id, email, groupId.type);
  };

  const inviteDialog = useMemo(
    () => (
      <Dialog
        icon="new-person"
        onClose={() => {
          setGroupId(null);
          setDialogOpen(false);
        }}
        title="Invite Member to Studio"
        isOpen={isDialogOpen}
        usePortal={false}
      >
        <div className={Classes.DIALOG_BODY}>
          <InputGroup
            large
            leftIcon="envelope"
            placeholder="test@example.com"
            fill
            autoFocus
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setEmail(e.currentTarget.value)
            }
          />
        </div>
        {loading ? (
          <span>sending</span>
        ) : (
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                intent={Intent.PRIMARY}
                text="Send Invitation"
                large
                onClick={onInviteSubmit}
              />
            </div>
          </div>
        )}
      </Dialog>
    ),
    [setGroupId, setDialogOpen, setEmail, onInviteSubmit],
  );

  const genStudioMenu = useCallback(
    (data: StudioState) => (
      <Menu>
        <MenuItem
          icon="add"
          text="Add Song"
          onClick={() => {
            addSong(data.id, 'new song');
          }}
        />
        <MenuItem
          icon="new-person"
          text="Invite"
          onClick={() => {
            setGroupId({ id: data.id, type: GroupType.Studio });
            setDialogOpen(true);
          }}
        />
        {/* <MenuItem icon="edit" text="Rename" /> */}
      </Menu>
    ),
    [addSong, setGroupId, setDialogOpen],
  );

  const genSongMenu = useCallback(
    (data: SongState) => (
      <Menu>
        <MenuItem
          icon="add"
          text="Add Version"
          onClick={() => {
            addVersion(data.id, 'new version');
          }}
        />
        <MenuItem
          icon="new-person"
          text="Invite"
          onClick={() => {
            setGroupId({ id: data.id, type: GroupType.Song });
            setDialogOpen(true);
          }}
        />
        {/* <MenuItem icon="edit" text="Rename" /> */}
        <MenuItem
          icon="delete"
          intent={Intent.DANGER}
          text="Delete"
          onClick={() => {
            delSong(data.id);
          }}
        />
      </Menu>
    ),
    [addVersion, setGroupId, setDialogOpen, delSong],
  );

  const genVerMenu = useCallback(
    (data: VersionState) => (
      <Menu>
        {/* <MenuItem icon="edit" text="Rename" /> */}
        <MenuItem
          icon="delete"
          intent={Intent.DANGER}
          text="Delete"
          onClick={() => {
            delVersion(data.id);
          }}
        />
      </Menu>
    ),
    [delVersion],
  );

  const genConfirmDialog = (
    title: string,
    message: string,
    onConfirm: (e: React.MouseEvent) => void,
    onDismiss?: (e: React.MouseEvent) => void,
  ) => (
    <div>
      <H5>{title}</H5>
      <p>{message}</p>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}
      >
        <Button
          className={Classes.POPOVER_DISMISS}
          style={{ marginRight: 10 }}
          onClick={onDismiss}
        >
          Cancel
        </Button>
        <Button
          intent={Intent.PRIMARY}
          className={Classes.POPOVER_DISMISS}
          onClick={onConfirm}
        >
          OK
        </Button>
      </div>
    </div>
  );

  const genVerNodeLabel = (data: VersionState) => (
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      position={Position.BOTTOM}
      modifiers={{
        preventOverflow: { enabled: false },
        hide: { enabled: false },
      }}
    >
      {/* Somehow, using block element as popover target here causes misplaced popover issue. 
      (Pops up remote location) */}
      <div style={{ cursor: 'pointer', display: 'inline-flex', width: '100%' }}>
        {data.name}
      </div>
      {genConfirmDialog('Open This Version?', '', () => setVerId(data.id))}
    </Popover>
  );

  const [collapsedNodes, setCollapsedNodes] = React.useState<string[]>([]);
  const [visibleMoreBtn, setVisibleMoreBtn] = React.useState('');
  const [openingMoreMenu, setOpeningMoreMenu] = React.useState('');

  const genNode = <T extends NodeData>(
    data: T,
    kind: NodeKind,
    childNodes?: Node[],
  ) => {
    let menu: ReactElement;
    switch (kind) {
      case NodeKind.Studio:
        menu = genStudioMenu(data as StudioState);
        break;
      case NodeKind.Song:
        menu = genSongMenu(data as SongState);
        break;
      case NodeKind.Version:
        menu = genVerMenu(data as VersionState);
        break;
      default:
        menu = <span />;
    }
    const label: JSX.Element =
      kind === NodeKind.Version ? (
        genVerNodeLabel(data as VersionState)
      ) : (
        <span>{data.name}</span>
      );
    return {
      id: data.id,
      icon: iconForNodeKind(kind),
      label: label,
      kind: kind,
      // Doc says "selector function should be pure".
      // Maybe better not to rely on local state?
      // https://react-redux.js.org/api/hooks#useselector
      isExpanded: !collapsedNodes.includes(data.id),
      secondaryLabel: (
        // Prevent click events from bubbling up to node component,
        // which fire `onNodeClick` event handler.
        <span
          style={{ display: visibleMoreBtn === data.id ? 'inline' : 'none' }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setVisibleMoreBtn(data.id)}
          onMouseLeave={() => setVisibleMoreBtn(data.id)}
        >
          <Popover
            position={Position.RIGHT}
            onOpening={() => setOpeningMoreMenu(data.id)}
            onClosing={() => {
              setOpeningMoreMenu('');
              setVisibleMoreBtn('');
            }}
          >
            <Icon
              icon="more"
              style={{ transform: 'rotate(90deg)', cursor: 'pointer' }}
            />
            {menu}
          </Popover>
        </span>
      ),
      data: data,
      childNodes,
    };
  };

  // Construct tree-like data structure for browser.
  // Studio -> Song -> Version
  const treeData: Node[] = useSelector((state: RootState) => {
    return state.studios.allIds.map((id) => {
      const studio = state.studios.byId[id];
      const members: Node[] = state.profiles.allIds.map((id) => {
        const member = state.profiles.byId[id];
        return genNode({ ...member, name: member.nickname }, NodeKind.Member);
      });
      const songs: Node[] = state.songs.allIds
        .map((id) => {
          const song = state.songs.byId[id];
          const versions = state.versions.allIds
            .map((id) => {
              const ver = state.versions.byId[id];
              return genNode(ver, NodeKind.Version);
            })
            .filter((ver) => ver.data.songId === song.id);
          return genNode(song, NodeKind.Song, versions);
        })
        .filter((song) => song.data.studioId === studio.id);
      return genNode(studio, NodeKind.Studio, members.concat(songs));
    });
  }, nodeListDeepEquals);

  const handleNodeExpand = (node: ITreeNode) => {
    node.isExpanded = true;
    setCollapsedNodes(collapsedNodes.filter((id) => id !== node.id));
  };

  const handleNodeCollapse = (node: ITreeNode) => {
    node.isExpanded = false;
    setCollapsedNodes(collapsedNodes.concat([node.id.toString()]));
  };

  const handleNodeMouseEnter = (node: ITreeNode) => {
    if (openingMoreMenu == '') {
      setVisibleMoreBtn(node.id.toString());
    }
  };

  const handleNodeMouseLeave = () => {
    if (openingMoreMenu == '') {
      setVisibleMoreBtn('');
    }
  };

  return (
    <div>
      {inviteDialog}
      {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
      <Scrollbar style={Scroll} contentProps={styledScrollRenderer(Container)}>
        <Tree
          contents={treeData}
          onNodeExpand={handleNodeExpand}
          onNodeCollapse={handleNodeCollapse}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
        />
      </Scrollbar>
    </div>
  );
};

const Container = {
  background: Color.Waveform.Background,
};

const Scroll = {
  width: 300,
};

export default Browser;
