<?php
    if (isset($_GET['url'])) {
        $string = file_get_contents($_GET['url']);
        echo $string;
    }
?>
