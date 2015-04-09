<?php
/**
 * Created by PhpStorm.
 * User: quentinmachard
 * Date: 09/04/15
 * Time: 22:09
 */

header('Content-type: text/plain');

if(isset($_GET['station']) && !empty($_GET['station'])) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "https://open.tan.fr/ewp/tempsattente.json/" . $_GET['station']);
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