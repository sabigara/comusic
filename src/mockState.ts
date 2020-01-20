export default {
  playback: {
    status: 2,
    time: 0,
    masterVolume: 1,
  },
  studio: {
    id: 'bc1575c9-dba2-48d8-8137-2f0164464617',
    name: 'Studio Rubik',
  },
  login: {
    // Giles, admin & owner of the Studio Rubik
    user: '903238a7-000b-4bd3-a247-75806cda0286',
  },
  members: {
    byId: {
      '903238a7-000b-4bd3-a247-75806cda0286': {
        id: '903238a7-000b-4bd3-a247-75806cda0286',
        name: 'Giles Marvin',
        email: 'giles@gmail.com',
        belongsTo: [
          // Studio Rubik
          'bc1575c9-dba2-48d8-8137-2f0164464617'
        ],
        adminOf: [
          'bc1575c9-dba2-48d8-8137-2f0164464617',
        ],
        ownerOf: [
          'bc1575c9-dba2-48d8-8137-2f0164464617',
        ],
      },
      'b1b20d65-9495-4188-84f9-84993f75f2cd': {
        id: 'b1b20d65-9495-4188-84f9-84993f75f2cd',
        name: 'Camila Schiller',
        email: 'camila@gmail.com',
        belongsTo: [
          'bc1575c9-dba2-48d8-8137-2f0164464617',
        ],
        adminOf: [
          // Co-admin with Giles
          'bc1575c9-dba2-48d8-8137-2f0164464617',
        ],
        ownerOf: [],
      },
      '808a40cd-e2ab-4930-bc54-4fababa2cb46': {
        id: '808a40cd-e2ab-4930-bc54-4fababa2cb46',
        name: 'Avis Keebler',
        email: 'avis@gmail.com',
        belongsTo: [
          'bc1575c9-dba2-48d8-8137-2f0164464617',
        ],
        adminOf: [],
        ownerOf: [],
      },
      '38241809-f3c1-4606-a54c-e37b632b388e': {
        id: '38241809-f3c1-4606-a54c-e37b632b388e',
        name: 'Deborah Von',
        email: 'deborah@gmail.com',
        belongsTo: [
          // Song, 'Foxy Girl'
          '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3',
        ],
        adminOf: [],
        ownerOf: [],
      },
    },
    allIds: [
      '903238a7-000b-4bd3-a247-75806cda0286',
      'b1b20d65-9495-4188-84f9-84993f75f2cd',
      '808a40cd-e2ab-4930-bc54-4fababa2cb46',
      '38241809-f3c1-4606-a54c-e37b632b388e',
    ]
  },
  songs: {
    byId: {
      '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3': {
        id: '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3',
        name: 'Foxy Girl',
        studio: 'bc1575c9-dba2-48d8-8137-2f0164464617'
      },
      '6001b758-86ab-4db0-bbe9-ba2a6c257a6c': {
        id: '6001b758-86ab-4db0-bbe9-ba2a6c257a6c',
        name: 'White Bird',
        studio: 'bc1575c9-dba2-48d8-8137-2f0164464617',
      },
    } ,
    allIds: [
      '6001b758-86ab-4db0-bbe9-ba2a6c257a6c',
      '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3',
    ],
  },
  versions: {
    byId: {
      'd5f46684-aee7-46f2-b5c3-e64e4b449fbb': {
        id: 'd5f46684-aee7-46f2-b5c3-e64e4b449fbb',
        name: 'ver. 1',
        // Foxy Girl
        song: '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3'
      },
      'ff6bb9d1-2eee-47c1-a65d-4d7f7f2446d2': {
        id: 'ff6bb9d1-2eee-47c1-a65d-4d7f7f2446d2',
        name: 'ver. 2',
        // Foxy Girl
        song: '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3'
      },
      '178d8c04-8330-4efb-a141-5a07dce54da5': {
        id: '178d8c04-8330-4efb-a141-5a07dce54da5',
        name: 'ver. 1',
        // White Bird
        song: '6001b758-86ab-4db0-bbe9-ba2a6c257a6c'
      },
    },
    allIds: [
      'd5f46684-aee7-46f2-b5c3-e64e4b449fbb',
      'ff6bb9d1-2eee-47c1-a65d-4d7f7f2446d2',
      '178d8c04-8330-4efb-a141-5a07dce54da5',
    ],
  },
  tracks: {
    byId: {
      '116c2e4e-ea34-49d7-8a2a-9b2da03d7048': {
        id: '116c2e4e-ea34-49d7-8a2a-9b2da03d7048',
        name: 'Drums',
        volume: 0.7,
        pan: 0,
        mute: false,
        solo: false,
        icon: 0,
        // Foxy Girl
        song: '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3',
        // ver. 1
        version: 'd5f46684-aee7-46f2-b5c3-e64e4b449fbb',
        // Giles
        player: '903238a7-000b-4bd3-a247-75806cda0286',
        activeTake: '4c92e8b3-9456-4d8b-aec4-2d23b9bbaaff'
      },
      '1c1052f9-eabf-4000-99d8-8d5bfa8ce407': {
        id: '1c1052f9-eabf-4000-99d8-8d5bfa8ce407',
        name: 'Bass',
        volume: 0.56,
        pan: 0,
        mute: false,
        solo: false,
        icon: 1,
        song: '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3',
        version: 'd5f46684-aee7-46f2-b5c3-e64e4b449fbb',
        // Camila
        player: 'b1b20d65-9495-4188-84f9-84993f75f2cd',
        activeTake: '4ca93020-ef65-4851-9940-91b3ae10a1f8',
      },
      '441de958-51d8-4bf0-8949-296ca134771c': {
        id: '441de958-51d8-4bf0-8949-296ca134771c',
        name: 'Rhodes',
        volume: 0.7,
        pan: 0,
        mute: false,
        solo: false,
        icon: 6,
        song: '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3',
        version: 'd5f46684-aee7-46f2-b5c3-e64e4b449fbb',
        // Avis
        player: '808a40cd-e2ab-4930-bc54-4fababa2cb46',
        activeTake: '7071f0ee-c1cf-4e7e-90ab-e4a634a720d2',
      },
      'ca169a55-0f6b-489b-9cce-a3bfd6cc7113': {
        id: 'ca169a55-0f6b-489b-9cce-a3bfd6cc7113',
        name: 'Vocal',
        volume: 0.8,
        pan: 0,
        mute: false,
        solo: false,
        icon: 4,
        song: '0e5e3ab1-3bbc-4345-a365-6f6326c3f2c3',
        version: 'd5f46684-aee7-46f2-b5c3-e64e4b449fbb',
        // Deborah
        player: '38241809-f3c1-4606-a54c-e37b632b388e',
        activeTake: 'd7f4dbfb-7cac-4990-a3a8-b6fea650615d',
      },
    },
    allIds: [
      '116c2e4e-ea34-49d7-8a2a-9b2da03d7048',
      '1c1052f9-eabf-4000-99d8-8d5bfa8ce407',
      '441de958-51d8-4bf0-8949-296ca134771c',
      'ca169a55-0f6b-489b-9cce-a3bfd6cc7113',
    ]
  },
  takes: {
    byId: {
      '4c92e8b3-9456-4d8b-aec4-2d23b9bbaaff': {
        id: '4c92e8b3-9456-4d8b-aec4-2d23b9bbaaff',
        name: 'with ride cymbal',
        // Foxy Girl > ver. 1 > Drums
        track: '116c2e4e-ea34-49d7-8a2a-9b2da03d7048',
        file: '16229d8b-e4e3-41e6-85e3-5ce847ae7fa4',
      },
      '7599b9e5-6055-4917-b183-e59bd4ec429e': {
        id: '7599b9e5-6055-4917-b183-e59bd4ec429e',
        name: 'with hihat',
        // Foxy Girl > ver. 1 > Drums
        track: '116c2e4e-ea34-49d7-8a2a-9b2da03d7048',
        file: '21c64940-fbca-470d-9b5d-99db5c98efee',
      },
      '4ca93020-ef65-4851-9940-91b3ae10a1f8': {
        id: '4ca93020-ef65-4851-9940-91b3ae10a1f8',
        name: 'take 1',
        // Foxy Girl > ver. 1 > Bass
        track: '1c1052f9-eabf-4000-99d8-8d5bfa8ce407',
        file: '2cc03f8d-fe09-41ad-8fc1-e3e1847e9111',
      },
      '7071f0ee-c1cf-4e7e-90ab-e4a634a720d2': {
        id: '7071f0ee-c1cf-4e7e-90ab-e4a634a720d2',
        name: 'with dumper',
        // Foxy Girl > ver. 1 > Rhodes
        track: '441de958-51d8-4bf0-8949-296ca134771c',
        file: '8e49cb39-7414-45d7-897c-4edd47b3f91d',
      },
      'd7f4dbfb-7cac-4990-a3a8-b6fea650615d': {
        id: 'd7f4dbfb-7cac-4990-a3a8-b6fea650615d',
        name: 'Lyrics 1',
        // Foxy Girl > ver. 1 > Vocal
        track: 'ca169a55-0f6b-489b-9cce-a3bfd6cc7113',
        file: 'b9c76f66-c284-4a30-a7e9-876880541ba6',
      },
    },
    allIds: [
      '4c92e8b3-9456-4d8b-aec4-2d23b9bbaaff',
      '7599b9e5-6055-4917-b183-e59bd4ec429e',
      '4ca93020-ef65-4851-9940-91b3ae10a1f8',
      '7071f0ee-c1cf-4e7e-90ab-e4a634a720d2',
      'd7f4dbfb-7cac-4990-a3a8-b6fea650615d',
    ],
  },
  files: {
    byId: {
      '16229d8b-e4e3-41e6-85e3-5ce847ae7fa4': {
        id: '16229d8b-e4e3-41e6-85e3-5ce847ae7fa4',
        uri: 'sounds/Drums.wav',
      },
      '2cc03f8d-fe09-41ad-8fc1-e3e1847e9111': {
        id: '2cc03f8d-fe09-41ad-8fc1-e3e1847e9111',
        uri: 'sounds/Bass.wav',
      },
      '8e49cb39-7414-45d7-897c-4edd47b3f91d': {
        id: '8e49cb39-7414-45d7-897c-4edd47b3f91d',
        uri: 'sounds/Rhodes.wav',
      },
      'b9c76f66-c284-4a30-a7e9-876880541ba6': {
        id: 'b9c76f66-c284-4a30-a7e9-876880541ba6',
        uri: 'sounds/LeadVocal.wav',
      },
      '21c64940-fbca-470d-9b5d-99db5c98efee': {
        id: '21c64940-fbca-470d-9b5d-99db5c98efee',
        uri: 'sounds/Guitar.wav',
      }
    },
    allIds: [
      '16229d8b-e4e3-41e6-85e3-5ce847ae7fa4',
      '2cc03f8d-fe09-41ad-8fc1-e3e1847e9111',
      '8e49cb39-7414-45d7-897c-4edd47b3f91d',
      'b9c76f66-c284-4a30-a7e9-876880541ba6',
    ],
  },
  fetching: [],
  loading: [],
}
