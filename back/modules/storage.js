let Storage = (function () {

let getJSONData =( function (name){
  let data = fs.readFileSync('../storage/'+name+'.json','utf8')
return (JSON.parse(data));
});

let editJSONData = (function (name, edit){
  fs.readFile('../storage/'+name+'.json',function(err,content){
    if(err) throw err;
    let inputVar = JSON.parse(content);
  
    inputVar = edit(inputVar);
  
    let json = JSON.stringify(inputVar);
  
    fs.writeFile('../storage/'+name+'.json',json,'utf8',function(err) {
      if (err) throw err;
    })
  })
})

return {
  getData: (name) => getJSONData(name),
  editData: (name, edit) => editJSONData(name, edit),
};

})();

module.exports = { storage: Storage };
