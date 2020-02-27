import React from 'react';
import { useSelector } from 'react-redux';
import FileBrowser, { FolderRenderers } from 'react-keyed-file-browser';
import { Scrollbar } from 'react-scrollbars-custom';

import Color from '../common/Color';
import { styledScrollRenderer } from '../common/utils';
import { RootState } from '../reducers';
import { SongState } from '../reducers/songs';
import { VersionState } from '../reducers/versions';
import { useFetchStudioContents } from '../hooks/studios';

type File = {
  key: string;
  obj: SongState | VersionState;
};

const studioId = 'ab18afe2-b0a2-4ec4-89ab-ae3570237a4e';

type Props = {
  setVerId: any;
};

const Browser: React.FC<Props> = ({ setVerId }) => {
  const files = useSelector(
    (state: RootState) => {
      const songs: File[] = state.songs.allIds.map((id) => {
        const song = state.songs.byId[id];
        return { key: song.name + '/', obj: song };
      });
      const vers: File[] = state.versions.allIds.map((id) => {
        const ver = state.versions.byId[id];
        return {
          key: state.songs.byId[ver.songId].name + '/versions/' + ver.name,
          obj: ver,
        };
      });
      return songs.concat(vers);
    },
    (prev, curr) => {
      return prev.every((file, i) => file.key === curr[i].key);
    },
  );

  useFetchStudioContents(studioId);

  return (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    <Scrollbar style={Scroll} contentProps={styledScrollRenderer(Container)}>
      <FileBrowser
        files={files}
        icons={{
          Folder: <i className="fas fa-angle-right" />,
          FolderOpen: <i className="fas fa-angle-down" />,
        }}
        onMoveFile={(old: string, newK: string) => console.log(old, newK)}
        onSelectFile={(file: File) => setVerId(file.obj.id)}
        fileRendererProps={{ size: null }}
        headerRenderer={null}
        folderRenderer={FolderRenderers.TableFolder}
        detailRenderer={() => <div></div>}
      ></FileBrowser>
    </Scrollbar>
  );
};

const Container = {
  background: Color.Waveform.Background,
};

const Scroll = {
  width: 300,
};

export default Browser;
