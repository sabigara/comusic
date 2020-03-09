import React from 'react';
import { useSelector } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import NodeUI from 'react-ui-tree/dist/node';
import Tree from 'react-ui-tree/dist/tree';
import Icon from 'react-icons-kit';
import { folder } from 'react-icons-kit/feather/folder';
import { file } from 'react-icons-kit/feather/file';
import { filePlus } from 'react-icons-kit/feather/filePlus';
import 'react-ui-tree/dist/react-ui-tree.css';
import styled from 'styled-components';

import Color from '../common/Color';
import { styledScrollRenderer } from '../common/utils';
import { RootState } from '../reducers';
import { useCurrentUser } from '../hooks/firebase';
import { useFetchStudios } from '../hooks/studios';
import { useAddVersion, useDelVersion } from '../hooks/versions';

enum NodeKind {
  Root,
  Studio,
  Song,
  Version,
}

interface NodeData {
  id: string;
}

type Node = {
  module: string;
  kind: NodeKind;
  collapsed: boolean;
  children: Node[];
  data: NodeData;
};

function isFolder(node: Node) {
  return node.children.length > 0;
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
  const [collapsedNodes, setCollapsedNodes] = React.useState<string[]>([]);
  const user = useCurrentUser();
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

  useFetchStudios(user?.id);
  const addVersion = useAddVersion();
  const delVersion = useDelVersion();

  const handleNodeClick = (node: Node) => {
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

  const handleAddVersion = (node: NodeData) => {
    addVersion(node.id, 'new ver.');
  };

  const handleDelVersion = (node: NodeData) => {
    delVersion(node.id);
  };

  const renderNode = (node: any) => {
    const renderFileFolderToolbar = (isFolder: boolean, caption: string) => (
      <Toolbar onClick={() => handleNodeClick(node)}>
        <FloatLeft>
          <Icon icon={isFolder ? folder : file} />
          {caption}
        </FloatLeft>
        <ToolbarFileFolder>
          {isFolder && (
            <React.Fragment>
              <Icon
                icon={filePlus}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddVersion(node.data);
                }}
              />
            </React.Fragment>
          )}
          {!isFolder && (
            <React.Fragment>
              <Icon
                icon={filePlus}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelVersion(node.data);
                }}
              />
            </React.Fragment>
          )}
        </ToolbarFileFolder>
      </Toolbar>
    );
    return <div>{renderFileFolderToolbar(isFolder(node), node.module)}</div>;
  };

  const tree = new Tree(treeData);
  tree.renderNode = renderNode;
  tree.updateNodesPosition();
  return (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
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
