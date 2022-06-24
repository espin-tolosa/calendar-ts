<?php

$ip = $_SERVER["REMOTE_ADDR"];
if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
  $ip = $_SERVER["HTTP_CLIENT_IP"];
} elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
  $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
}

$lf = "./connections.log";
$dt = gmdate("Y-m-d\TH:i:s\Z");
$mg = "$ip $dt\n";

error_log($mg, 3, $lf);

