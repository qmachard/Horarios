<?php
/**
 * Created by PhpStorm.
 * User: quentinmachard
 * Date: 09/04/15
 * Time: 22:14
 */

header('Content-type: text/plain');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://open.tan.fr/ewp/arrets.json");
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);

curl_close($ch);

if($result !== false) {
	print $result;
	die;
}

print "[]";