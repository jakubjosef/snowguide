<?php
class BaseService{
	protected $db=null;
        protected $collectionName=null;
        /** @var \UserApp\API */
        protected $usersApi;

	const DB_HOST="localhost";
	const DB_NAME="snowguide";

	public function __construct($testMode=false){
                if(!$testMode && is_null($this->collectionName)){
                    throw new Exception("collectionName in service ".__CLASS__." must by specificated");
                }
		$connection=new Mongo("mongodb://".self::DB_HOST."/?journal=true&w=1&wTimeoutMS=20000");
		$this->db=$connection->selectDB(self::DB_NAME);
                $this->usersApi=new \UserApp\API("5307347d82a1a");
                // Log in
                $this->usersApi->user->login(array(
                    "login" => "server",
                    "password" => "snowguideserverpassword11"
                ));
	}

        public function createOrUpdate($id,$data,$collectionName=false){
        $collection=$this->db->{($collectionName)?$collectionName:$this->collectionName};
        $objectQuery=array("_id" => (int)$id);
        if(isset($data["provider"])){
            $isAdmin = self::isUserAdmin($this->usersApi->user->hasPermission(array(
                "user_id" => $data["provider"],
                "permission" => array("admin")
            )));
            if(!$isAdmin){
                $objectQuery["provider"]=$data["provider"];
            }
            $editedObject=$collection->findOne(array("_id"=>(int)$id));
            if($editedObject){
                unset($data["_id"]);
                return $collection->update(array("_id" => (int)$id),$data);
            }elseif($isAdmin){
                return $collection->insert($data);
            }
        }
    }
    public static function isUserAdmin($hasPermissionResult){
        return is_array($hasPermissionResult->missing_permissions) && empty($hasPermissionResult->missing_permissions);
    }
}




?>