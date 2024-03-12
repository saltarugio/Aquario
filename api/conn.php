<?php
$username = "root";
$password = "root";
$database = "aquario";
$host = "localhost";
$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_errno) {
    die("Conexão falhou: (". $conn->connect_errno . ")" . $conn->connect_error); 
}