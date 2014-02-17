<?php
class BaseService{
	protected $db=null;

	const DB_HOST="localhost";
	const DB_NAME="snowguide";

	public function __construct(){
		$connection=new Mongo("mongodb://".self::DB_HOST);
		$this->db=$connection->selectDB(self::DB_NAME);
	}
}




?>