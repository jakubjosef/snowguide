<?php
//api.php
const APP_DIRECTORY="";

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

require 'vendor/autoload.php';
require 'services/base.php';

$app = new Application();
$app['debug'] = true;
//pripojeni servisy
$app['resorts'] = function() {
  require "services/resorts.php";
  return new ResortsService();
};
$app['mountains'] = function() {
  require "services/mountains.php";
  return new MountainsService();
};

$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});
//test api
$app->get(APP_DIRECTORY.'/api/test',function(){
   new BaseService(true); //this throw exception and 500 error automatically
   return new Response("",200); //otherwise we return 200
});
//get all resorts
$app->get(APP_DIRECTORY.'/api/resorts', function(Request $req) use ($app) {
    $result = $app['resorts']->findAll($req->query->all());
  return new Response(json_encode($result),200,array("Content-Type" => "application/json; charset=UTF-8"));
});
$app->get(APP_DIRECTORY.'/api/resorts/{id}',function($id) use ($app){
  $result=$app['resorts']->find($id);
  return new Response(json_encode($result),200,array("Content-Type" => "application/json; charset=UTF-8"));
});
//create or update
$app->post(APP_DIRECTORY.'/api/resorts/{id}',function($id,Request $reg) use ($app){
  $result=$app['resorts']->createOrUpdate($id,$reg->request->all());
  return new Response(json_encode($result),200,array("Content-Type" => "application/json; charset=UTF-8"));
});
$app->get(APP_DIRECTORY.'/api/mountains',function(Request $reg) use ($app){
    $result = $app['mountains']->findAll($reg->query->all());
    return new Response(json_encode($result),200,array("Content-Type" => "application/json; charset=UTF-8"));
});
//create or update
$app->post(APP_DIRECTORY.'/api/mountains/{id}',function($id,Request $reg) use ($app){
  $result=$app['mountains']->createOrUpdate($id,$reg->request->all());
  return new Response(json_encode($result),200,array("Content-Type" => "application/json; charset=UTF-8"));
});
/*
//create new book
$app->post('/book', function(Request $req) use ($app) {
  $result = $app['library']->register_new_book($req->request->all()); //equivalent of "$_POST"

  return new Response(201, json_encode($result));
});

//get specific book
$app->get('/book/{id}', function($id) use ($app) {
  $result = $app['library']->get_book_by_id($id);

  return new Response(200, json_encode($result));
});

//loan specific book
$app->put('/book/{id}', function($id, Request $req) use ($app) {
  $d = json_decode($req->getContents());
  $result = $app['library']->loan_book($d);

  return new Response(200, json_encode($result));
});

//delete specific book
$app->delete('/book/{id}', function($id) use ($app) {
  $result = $app['library']->delete_book($id);

  return new Response(200, json_encode($result));
});
*/
//run the app to handle the incoming request
//404, 405 responses are handled automatically
$app->run();