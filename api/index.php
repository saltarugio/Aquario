<?php
include('./conn.php');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
$sql_code = 'SELECT * FROM question';
$sql_query = $conn->query($sql_code) or die($conn->error);
$arr = array();
if ($sql_query === false) {
    echo json_encode(['error' => 'Erro na execução da consulta SQL']);
} else {
    while ($row = $sql_query->fetch_assoc()) {
        $arr[] = $row;
    }
    echo json_encode($arr);
}

?>