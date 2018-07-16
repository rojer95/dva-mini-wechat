const HOST = 'http://open.douyucdn.cn/api';

export default {
  api: {
    roomList: `${HOST}/RoomApi/live/:categoryId`,
    allGameCategory: `${HOST}/RoomApi/game`,
    roomDetail: `${HOST}/RoomApi/room/:id`,
  }
}