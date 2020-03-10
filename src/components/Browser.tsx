import React, { ReactElement, useCallback, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import 'react-ui-tree/dist/react-ui-tree.css';
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
import '@blueprintjs/core/lib/css/blueprint.css';
import styled from 'styled-components';

import Color from '../common/Color';
import { styledScrollRenderer } from '../common/utils';
import { RootState } from '../reducers';
import { StudioState } from '../reducers/studios';
import { SongState } from '../reducers/songs';
import { VersionState } from '../reducers/versions';
import useBackendAPI from '../hooks/useBackendAPI';
import useDispatchWithAPICall from '../hooks/useDispatchWithAPICall';
import { useCurrentUser } from '../hooks/firebase';
import { useFetchStudios } from '../hooks/studios';
import { useAddSong, useDelSong } from '../hooks/songs';
import { useAddVersion, useDelVersion } from '../hooks/versions';

enum NodeKind {
  Studio,
  Song,
  Version,
}

type NodeData = StudioState | SongState | VersionState;

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
): 'home' | 'music' | 'document' | 'error' {
  switch (nodeKind) {
    case NodeKind.Studio:
      return 'home';
    case NodeKind.Song:
      return 'music';
    case NodeKind.Version:
      return 'document';
    default:
      return 'error';
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
  const dispatchWithAPICall = useDispatchWithAPICall();
  const addSong = useAddSong();
  const delSong = useDelSong();
  const addVersion = useAddVersion();
  const delVersion = useDelVersion();

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [groupId, setGroupId] = React.useState<{
    id: string;
    type: 'studio' | 'song';
  } | null>(null);

  const onInviteSubmit = () => {
    if (groupId === null) return;
    dispatchWithAPICall(
      'INVITE',
      // Since instance method is passed as callback, `this` is
      // missing without bind.
      backendAPI.invite.bind(backendAPI),
      groupId.id,
      email,
      groupId.type,
    );
    setDialogOpen(false);
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '20px 20px 0 20px',
          }}
        >
          <InputGroup
            large
            leftIcon="envelope"
            placeholder="test@example.com"
            fill
            style={{ marginBottom: 20 }}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setEmail(e.currentTarget.value)
            }
          />
          <Button text="Send Invitation" large onClick={onInviteSubmit} />
        </div>
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
            setGroupId({ id: data.id, type: 'studio' });
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
            setGroupId({ id: data.id, type: 'song' });
            setDialogOpen(true);
          }}
        />
        {/* <MenuItem icon="edit" text="Rename" /> */}
        <MenuItem
          icon="delete"
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
          text="Delete"
          onClick={() => {
            delVersion(data.id);
          }}
        />
      </Menu>
    ),
    [delVersion],
  );

  const confirmDelDialog = (
    <div>
      <H5>Confirm deletion</H5>
      <p>
        Are you sure you want to delete these items? You won't be able to
        recover them.
      </p>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}
      >
        <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
          Cancel
        </Button>
        <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}>
          Delete
        </Button>
      </div>
    </div>
  );

  const [collapsedNodes, setCollapsedNodes] = React.useState<string[]>([]);

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
    return {
      id: data.id,
      icon: iconForNodeKind(kind),
      label: data.name,
      kind: kind,
      // Doc says "selector function should be pure".
      // Maybe better not to rely on local state?
      // https://react-redux.js.org/api/hooks#useselector
      isExpanded: !collapsedNodes.includes(data.id),
      secondaryLabel: (
        // Prevent click events from bubbling up to node component,
        // which fire `onNodeClick` event handler.
        <span onClick={(e) => e.stopPropagation()}>
          <Popover minimal position={Position.RIGHT}>
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
      const songs: Node[] = state.songs.allIds
        .map((id) => {
          const song = state.songs.byId[id];
          const versions: Node[] = state.versions.allIds
            .map((id) => {
              const ver = state.versions.byId[id];
              return genNode(ver, NodeKind.Version);
            })
            .filter((ver) => ver.data.songId === song.id);
          return genNode(song, NodeKind.Song, versions);
        })
        .filter((song) => song.data.studioId === studio.id);
      return genNode(studio, NodeKind.Studio, songs);
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

  const handleNodeClick = (iTreeNode: ITreeNode) => {
    const node = iTreeNode as Node;
    switch (node.kind) {
      case NodeKind.Version:
        setVerId(node.id);
        break;
      default:
        break;
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
          onNodeClick={handleNodeClick}
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
