<?php
include('includes/simple_html_dom.php');

$url = "http://www.friidrott.se/rs/resultat.aspx?page=results&year=2016&type=7";

// Retrieve the DOM from a given URL
$html = file_get_html($url);

// Find all "A" tags and print their HREFs
foreach($html->find('p[class=resultat] a') as $link)
//foreach($html->find('a') as $e) 
   echo $link->outertext . $link->href . '<br>';

?>