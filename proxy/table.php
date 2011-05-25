<?php

$q = $_GET['q'];
$q = str_replace("\n", " ", $q);
$q = htmlspecialchars($q);
$q = urlencode($q);

echo file_get_contents("http://localhost:8888/table?pair=".$_GET['pair']."&q=".$q);
