<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

$q = $_GET['q'];
$q = str_replace("\n", " ", $q);
$q = htmlspecialchars($q);
$q = urlencode($q);

$translated = $_GET['translated'];
$translated = str_replace("\n", " ", $translated);
$translated = htmlspecialchars($translated);
$translated = urlencode($translated);

//echo $_GET['q'];
//exit();

$covered = $_GET['covered'];

//echo "http://localhost:8888/suggestion?translated=todlencto&covered=".$covered."&q=das%20ist%20kleines%20hau";

echo file_get_contents("http://localhost:8888/suggestion?pair=".$_GET['pair']."&translated=".$translated."&covered=".$covered."&q=".$q);