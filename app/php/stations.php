<?php

$stations = array();

// Récupération de tous les arrêts
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://open.tan.fr/ewp/arrets.json");
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$data = json_decode(curl_exec($ch), true);
curl_close($ch);

foreach($data as $s) {
	$station = array(
		'code' => $s['codeLieu'],
		'name' => $s['libelle'],
		'lines' => array(),
	);

	foreach($s['ligne'] as $i => $l) {
		$station['lines'][$i]['line'] = $l['numLigne'];

		// Récupération de toutes les lignes
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "https://open.tan.fr/ewp/horairesarret.json/" . $s['codeLieu'] . '/' . $l['numLigne'] . "/1");
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$sens1 = json_decode(curl_exec($ch), true);
		curl_close($ch);
		$station['lines'][$i]['sens1'] = array(
			'code' => $sens1['arret']['codeArret'],
			'terminus' => $sens1['ligne']['directionSens1'],
		);

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "https://open.tan.fr/ewp/horairesarret.json/" . $s['codeLieu'] . '/' . $l['numLigne'] . "/2");
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$sens2 = json_decode(curl_exec($ch), true);
		curl_close($ch);

		$station['lines'][$i]['sens2'] = array(
			'code' => $sens2['arret']['codeArret'],
			'terminus' => $sens2['ligne']['directionSens2'],
		);
	}

	$stations[] = $station;
}

$file = fopen("./stations.json", "a");
fwrite($file, json_encode($stations));
fclose($file);