<?php
require "base.php";
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
                if(isset($params["favorite"])){
                    //oblibena strediska
                    $queryParams["_id"]=array('$lte'=>10);
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