import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import NodeUI from 'react-ui-tree/dist/node';
import Tree from 'react-ui-tree/dist/tree';
import 'react-ui-tree/dist/react-ui-tree.css';
import {
  Button,
  Dialog,
  Menu,
  MenuItem,
  InputGroup,
  Popover,
  Position,
  Icon,
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
  Root,
  Studio,
  Song,
  Version,
}

type NodeData = StudioState | SongState | VersionState | { id: string };

type Node = {
  module: string;
  kind: NodeKind;
  collapsed: boolean;
  children: Node[];
  data: NodeData;
};

function isFolder(node: Node) {
  return node.kind !== NodeKind.Version;
}

// Recursively compare every nodes.
function nodeDeepEquals(prev: Node, curr: Node): boolean {
  if (prev.children.length != curr.children.length) {
    return false;
  }
  return (
    shallowEqual(prev.data, curr.data) &&
    prev.children.reduce((acc: boolean, child, i) => {
      return acc && nodeDeepEquals(child, curr.children[i]);
    }, true)
  );
}

type Props = {
  setVerId: any;
};

const Browser: React.FC<Props> = ({ setVerId }) => {
  const user = useCurrentUser();
  // API call
  useFetchStudios(user?.id);

  const [collapsedNodes, setCollapsedNodes] = React.useState<string[]>([]);
  // Construct tree-like data structure for browser.
  // Root -> Studio -> Song -> Version
  const treeData = useSelector((state: RootState) => {
    const studios: Node[] = state.studios.allIds.map((id) => {
      const studio = state.studios.byId[id];
      const songs: Node[] = state.songs.allIds
        .map((id) => {
          const song = state.songs.byId[id];
          const versions: Node[] = state.versions.allIds
            .map((id) => {
              const ver = state.versions.byId[id];
              return {
                module: ver.name,
                kind: NodeKind.Version,
                children: [],
                // Doc says "selector function should be pure".
                // Maybe better not to rely on local state?
                // https://react-redux.js.org/api/hooks#useselector
                collapsed: collapsedNodes.includes(ver.id),
                data: ver,
              };
            })
            .filter((ver) => ver.data.songId === song.id);
          return {
            module: song.name,
            kind: NodeKind.Song,
            collapsed: collapsedNodes.includes(song.id),
            children: versions,
            data: song,
          };
        })
        .filter((song) => song.data.studioId === studio.id);
      return {
        module: studio.name,
        kind: NodeKind.Studio,
        collapsed: collapsedNodes.includes(studio.id),
        children: songs,
        data: studio,
      };
    });
    return {
      module: 'root',
      kind: NodeKind.Root,
      collapsed: false,
      children: studios,
      data: { id: 'root' },
    };
  }, nodeDeepEquals);

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

  const inviteDialog = (
    <Dialog
      icon="new-person"
      onClose={() => {
        setGroupId(null);
        setDialogOpen(false);
      }}
      title="Invite Member to Studio"
      isOpen={isDialogOpen}
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
  );

  const genStudioMenu = (data: StudioState) => (
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
  );

  const genSongMenu = (data: SongState) => (
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
  );

  const genVerMenu = (data: VersionState) => (
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
  );

  const handleNodeClick = (e: any, node: Node) => {
    if (e.target.id !== 'folder-node') return;
    if (isFolder(node)) {
      const collapsed = collapsedNodes.includes(node.data.id);
      node.collapsed = !collapsed;
      collapsed
        ? setCollapsedNodes(collapsedNodes.filter((id) => id !== node.data.id))
        : setCollapsedNodes(collapsedNodes.concat(node.data.id));
    } else {
      setVerId(node.data.id);
    }
  };

  const renderNode = (node: Node) => {
    const renderFileFolderToolbar = (caption: string) => (
      <Toolbar onClick={(e) => handleNodeClick(e, node)}>
        <FloatLeft>
          <Icon icon="folder-close" />
          {caption}
        </FloatLeft>
        <ToolbarFileFolder id="folder-node">
          {node.kind === NodeKind.Studio && (
            <Popover minimal position={Position.RIGHT}>
              <Icon icon="more" style={{ transform: 'rotate(90deg)' }} />
              {genStudioMenu(node.data as StudioState)}
            </Popover>
          )}
          {node.kind === NodeKind.Song && (
            <Popover minimal position={Position.RIGHT}>
              <Icon icon="more" style={{ transform: 'rotate(90deg)' }} />
              {genSongMenu(node.data as SongState)}
            </Popover>
          )}
          {node.kind === NodeKind.Version && (
            <Popover minimal position={Position.RIGHT}>
              <Icon icon="more" style={{ transform: 'rotate(90deg)' }} />
              {genVerMenu(node.data as VersionState)}
            </Popover>
          )}
        </ToolbarFileFolder>
      </Toolbar>
    );
    return <div>{renderFileFolderToolbar(node.module)}</div>;
  };

  const tree = new Tree(treeData);
  tree.renderNode = renderNode;
  tree.updateNodesPosition();
  return (
    <div>
      {inviteDialog}
      {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
      <Scrollbar style={Scroll} contentProps={styledScrollRenderer(Container)}>
        <div className="m-tree">
          <NodeUI
            paddingLeft={20}
            tree={tree}
            index={tree.getIndex(1)}
            key={1}
            onChange={(tree: Node) => {
              console.log(tree);
            }}
            renderNode={renderNode}
          />
        </div>
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

const Toolbar = styled.div`
  position: relative;
  display: flex;
  color: #d8e0f0;
  z-index: +1;
  /*border: 1px solid white;*/
  padding-bottom: 4px;
  i {
    margin-right: 5px;
    cursor: pointer;
  }
  i :hover {
    color: #d8e0f0;
  }
`;

const FloatLeft = styled.span`
  padding-left: 4px;
  width: 100%;
`;

const ToolbarFileFolder = styled.div`
  position: absolute;
  text-align: right;
  width: 92%;
  color: transparent;
  &:hover {
    color: #d8e0f0;
  }
`;

export default Browser;
