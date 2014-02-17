<?php
class ResortsService extends BaseService{
	public function find($id){
		$resorts=$this->db->resorts;
		$resort=$resorts->findOne(array("_id" => (int)$id));
		return $resort;
	}
	public function findAll($params){
		$resorts=$this->db->resorts;
                $queryParams=array();
                if(isset($params["filter"]) && is_array($params["filter"])){
                    //filtr
                    $filterNames=array_keys($params["filter"]);
                    $queryParams[$filterNames[0]] = array('$regex' => urldecode($params["filter"][$filterNames[0]]),'$options' => 'i');
                }
                if(isset($params["favorite"]) && $params["favorite"]){
                    if(isset($params["favoriteSkiResorts"]) && $params["favoriteSkiResorts"]){
                        //oblibena strediska lyzaru
                        $queryParams["favoriteSkiResort"]=array('$exists'=>true);
                    }elseif(isset($params["favoriteSkiRaces"]) && $params["favoriteSkiRaces"]){
                        //oblibena strediska s lyzarskymi zavody
                        $queryParams["favoriteSkiRace"]=array('$exists'=>true);
                    }elseif(isset($params["favoriteSnbResorts"]) && $params["favoriteSnbResorts"]){
                        //oblibena strediska snowboardistu
                        $queryParams["favoriteSnbResort"]=array('$exists'=>true);
                    }elseif(isset($params["favoriteSnbParks"]) && $params["favoriteSnbParks"]){
                        //oblibena strediska snowboardistu
                        $queryParams["favoriteSnbPark"]=array('$exists'=>true);
                    }elseif(isset($params["favoriteCCSkiResorts"]) && $params["favoriteCCSkiResorts"]){
                        //oblibene bezkarske trasy
                        $ccSkiResorts=true;
                        $queryParams["favoriteCCSkiResort"]=array('$exists'=>true);
                    }elseif(isset($params["favoriteCCSkiKidResorts"]) && $params["favoriteCCSkiKidResorts"]){
                        //oblibene bezkarske trasy pro deti
                        $ccSkiResorts=true;
                        $queryParams["favoriteCCSkiKidResort"]=array('$exists'=>true);
                    }else{
                        // obecne oblibena strediska
                        $queryParams["favorite"]=array('$exists'=>true);
                    }
                }
                if(isset($params["mountains"])){
                    //podle pohori
                    $mountainsArray=  array_map('intval',  array_filter(json_decode($params["mountains"]), 'is_numeric'));
                    $queryParams["mountains"]=array('$in' => $mountainsArray);
                }
                if(isset($params["artificialSnow"]) && $params["artificialSnow"]==="true"){
                    //umele zasnezovani
                    $queryParams["artificialSnow"]=true;
                }
                if(isset($params["nightSkiing"]) && $params["nightSkiing"]==="true"){
                    //umele zasnezovani
                    $queryParams["nightSkiing"]=true;
                }
                //vy vychozim stavu nechceme ziskavat bezecke trasy
                if(!isset($ccSkiResorts)){
                    $queryParams["ccresort"]=array('$exists'=>false);
                }
                $cursor=$resorts->find($queryParams);
                if(isset($params["sorting"]) && is_array($params["sorting"])){
                    $sortNames=  array_keys($params["sorting"]);
                    $cursor->sort(array($sortNames[0] => ($params["sorting"][$sortNames[0]]=="asc")?-1:1));
                }
                $resortsArray=array();
                foreach($cursor as $resort){
                    if(isset($resort["mountains"])){
                        //namapujeme pohoří
                        $mountains=$this->db->mountains;
                        $mountain=$mountains->findOne(array("_id" => $resort["mountains"]));
                        $resortsArray[]=array_merge($resort,array("mountains" =>$mountain["name"]));
                    }else{
                        $resortsArray[]=$resort;
                    }
                }
                return $resortsArray;
	}
}
?>