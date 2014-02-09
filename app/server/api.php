<?php
//api.php

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

require 'vendor/autoload.php';

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

//get all resorts
$app->get('/api/resorts', function(Request $req) use ($app) {
    $result = $app['resorts']->findAll($req->query->all());
  return new Response(json_encode($result),200,array("Content-Type" => "application/json; charset=UTF-8"));
});
$app->get('/api/resorts/{id}',function($id) use ($app){
  $result=$app['resorts']->find($id);
  return new Response(json_encode($result),200,array("Content-Type" => "application/json; charset=UTF-8"));
});
$app->get('api/mountains',function(Request $reg) use ($app){
    $result = $app['mountains']->findAll();
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