<?php

class MountainsService extends BaseService {

    public function findAll(){
        $mountains = $this->db->mountains;
        return iterator_to_array($mountains->find(), false);
    }

}

?>