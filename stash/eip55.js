const createKeccakHash = require('keccak')

function toChecksumAddress () {

  var address = '0x8a03de909d9b7794cd262c96be961097d7c9d880'

  address = address.toLowerCase().replace('0x','');
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  console.log(ret)
}

toChecksumAddress()
