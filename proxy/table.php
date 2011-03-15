<?php

//proxy/table.php?q=slu%C5%BEby.%0A%0AJeh

$q = $_GET['q'];
$q = str_replace("\n", " ", $q);
$q = htmlspecialchars($q);
$q = urlencode($q);
//echo $_GET['q'];
//exit();

echo file_get_contents("http://localhost:8888/table?pair=".$_GET['pair']."&q=".$q);