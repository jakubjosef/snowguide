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
                if(isset($params["filter"]) && is_array($params["filter"])){
                    //filtr
                    $filterNames=array_keys($params["filter"]);
                    $cursor=$resorts->find(array($filterNames[0] => array('$regex' => urldecode($params["filter"][$filterNames[0]]),'$options' => 'i')));
                }elseif(isset($params["favorite"])){
                    //oblibena strediska
                    $cursor=$resorts->find(array("_id"=>array('$lte'=>10)));
                }elseif(isset($params["mountains"])){
                    //podle pohori
                    $cursor=$resorts->find(array("mountains"=>(int)$params["mountains"]));
                }else{
                    //vsechny
                    $cursor=$resorts->find();
                }
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