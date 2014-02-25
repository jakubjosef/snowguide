<?php

class MountainsService extends BaseService {
    protected $collectionName="mountains";

    public function findAll($params){
        $mountains = $this->db->{$this->collectionName};
        if(isset($params["nextId"]) && $params["nextId"]){
                    //get next resort id
                     $cursor=$mountains->find(array(),array("_id"=>true))->sort(array("_id"=>-1))->limit(1);
                     return array("_id" => $cursor->getNext()["_id"]+1);
        }
        return iterator_to_array($mountains->find(), false);
    }

}

?>