<?php 
if(!empty($_POST['data'])){
  $data = $_POST['data'];
  $file = fopen("data/Data.json", 'w'); //creates new file
  fwrite($file, $data);
  fclose($file);
}
?>
