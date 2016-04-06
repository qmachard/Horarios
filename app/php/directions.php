<?php
/**
 * Created by PhpStorm.
 * User: quentinmachard
 * Date: 09/04/15
 * Time: 22:15
 */

header('Content-type: text/plain');

if(	isset($_GET['station']) && !empty($_GET['station']) &&
	isset($_GET['line']) && !empty($_GET['line']) &&
	isset($_GET['direction']) && !empty($_GET['direction'])) {

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://open.tan.fr/ewp/horairesarret.json/' . $_GET['station'] . '/' . $_GET['line'] . '/' . $_GET['direction']);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$result = curl_exec($ch);

	curl_close($ch);

	if($result !== false) {
		print $result;
		die;
	}
}

print "[]";