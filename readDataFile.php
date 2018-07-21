<?php
if (isset($_GET['file_name'])) {
    $string = file_get_contents($_GET['file_name']);
    echo $string;
}
?>
