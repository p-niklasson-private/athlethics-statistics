<?php
date_default_timezone_set('Europe/Stockholm');
$filename = 'data/Data.json';
if (file_exists($filename)) {
    echo "Data updated: " . date ("Y-m-d H:i:s", filemtime($filename));
}
?>
