const createKeccakHash = require('keccak')

function toChecksumAddress () {
  
  var address = '0xebc75bc3c8676e4b4edd1e665d09e499be9b9bdd'
  
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
