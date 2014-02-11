var gm=require('googlemaps'),
    _=require('underscore'),
    util=require('util'),
    sleep=require('sleep'),
    MongoClient = require('mongodb').MongoClient,counter=0;
util.puts("Importuji GPS souradnice resortu...");
MongoClient.connect('mongodb://127.0.0.1:27017/snowguide',function(err,db){
	util.puts("Pripojeni k DB navazano");
	if(err) throw err;
	var collection = db.collection('resorts');
	collection.find().toArray(function(err,results){
		util.puts("Nalezeno "+results.length+" resortu");
		_.each(results,function(resort){
			sleep.usleep(500);
			if(!resort.lat || !resort.lng){
				gm.geocode(resort.name,function(err,data){
					if(typeof data === 'object' && data.hasOwnProperty("status") && data.status==="OK"){
						collection.update({_id:resort._id},{$set:{lat:data.results[0].geometry.location.lat,lng:data.results[0].geometry.location.lng}},{multi:true},function(){
							util.puts("Zapsany GPS souradnice pro resort "+resort.name);
						});
					}
				});
			}
		});
		process.exit(0);
 	});
});
