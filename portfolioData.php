<?php
//header("Access-Control-Allow-Origin: http://localhost:8000");

// to display errors in browser
ini_set('display_errors', 1);

$servername = "db.nscctruro.ca";
$username = "sean_classsample";
$password = "Forrester308";
$dbname = "sean_clientSideSamples";

try {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
    //echo "Connected successfully<br>";

    // query the data
    $sql = "SELECT * FROM tblPortfolio";
    $result = $conn->query($sql);

    // construct XMLWriter object
    $xml = new XMLWriter();
    // to write xml-data directly to the user instead of memory or file
    $xml->openURI("php://output");
    // indent XML so it can be read easily
    $xml->setIndent(true);

    $xml->startDocument();
    $xml->startElement("samples");

    while($row = $result->fetch_assoc()) {
        $xml->startElement("sample");
        $xml->writeAttribute("id", $row["id"]);
        $xml->startElement("name");
        $xml->writeRaw(htmlspecialchars($row["name"]));
        $xml->endElement();
        $xml->startElement("description");
        $xml->writeRaw(htmlspecialchars($row["description"]));
        $xml->endElement();
        $xml->startElement("url");
        $xml->writeRaw(htmlspecialchars($row["URL"]));
        $xml->endElement();
        $xml->startElement("images");
            $xml->startElement("image");
            $xml->writeRaw(htmlspecialchars($row["image1"]));
            $xml->endElement();
            $xml->startElement("image");
            $xml->writeRaw(htmlspecialchars($row["image2"]));
            $xml->endElement();
            $xml->startElement("image");
            $xml->writeRaw(htmlspecialchars($row["image3"]));
            $xml->endElement();
            $xml->startElement("image");
            $xml->writeRaw(htmlspecialchars($row["image4"]));
            $xml->endElement();
        $xml->endElement();
        $xml->endElement();
    }

    $xml->endElement();
    header("Content-type: text/xml");
    $xml->flush();
    $xml->endDocument();
} finally {
    // php will automatically close the connection when the script ends
    $conn->close();
}
?>