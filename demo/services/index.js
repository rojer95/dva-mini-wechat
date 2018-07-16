import { 
  request,
  regenerator as regeneratorRuntime
} from '../lib/index.js'

import config from '../config'


const { api } = config
const { roomList, allGameCategory, roomDetail } = api



const getRoomList = async function (categoryId, offset) {

  return request({
    url: roomList.replace(':categoryId', categoryId),
    method: 'get',
    data: {
      offset
    }
  })
}

const getAllGameCategory = async function() {
  return request({
    url: allGameCategory,
    method: 'get',
  })
}

const getRoomDetail = async function (id) {
  return request({
    url: roomDetail.replace(':id', id),
    method: 'get',
  })
}

export {
  getRoomList,
  getAllGameCategory,
  getRoomDetail
}

