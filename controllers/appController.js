module.exports = function(){
  console.log('main');

}

module.exports.help = () =>{
  console.log('');
  console.log('Usage: coco <command>\n');
  console.log('Where <command> is one of:');
  console.log('    encode, decode');
}