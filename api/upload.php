<?php
include("./conn.php");

$msg = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $pergunta = $_POST['pergunta'];
    $resposta_verdadeira = $_POST['resposta_verdadeira'];
    $resposta1 = $_POST['resposta1'];
    $resposta2 = $_POST['resposta2'];
    $resposta3 = $_POST['resposta3'];
    $resposta4 = $_POST['resposta4'];

    $novo_nome = null; // Inicializa $novo_nome com null

    if (isset($_FILES["img"]) && $_FILES["img"]["name"]) {
        $ext = strtolower(substr($_FILES['img']['name'], -4));
        $novo_nome = md5(time()) . $ext;
        $dirr = "C:/xampp/htdocs/aquario/imagens/";

        move_uploaded_file($_FILES["img"]["tmp_name"], $dirr.$novo_nome);
    }

    $sql_code = "INSERT INTO question (pergunta, resposta_verdadeira, resposta1, resposta2, resposta3, resposta4, img) VALUES ('$pergunta', '$resposta_verdadeira', '$resposta1', '$resposta2', '$resposta3', '$resposta4', '$novo_nome')";

    if ($conn->query($sql_code)) {
        $msg = "Upload realizado com sucesso!!!";
    } else {
        $msg = "Erro ao executar a consulta SQL: " . $conn->error;
    }
}
?>

<h1>Upload de imagem</h1>
<?php if ($msg != false) echo "<p> $msg </p>"; ?>
<form action="upload.php" method="POST" enctype="multipart/form-data">
    pergunta: <input type="text" required name="pergunta"><br>
    resposta verdadeira: <input type="text" required name="resposta_verdadeira"><br>
    primeira resposta: <input type="text" required name="resposta1"><br>
    segunda resposta: <input type="text" required name="resposta2"><br>
    terceita resposta: <input type="text" required name="resposta3"><br>
    quarta resposta: <input type="text" required name="resposta4"><br>
    Arquivo: <input type="file" name="img">
    <input type="submit" value="Salvar">
</form>

