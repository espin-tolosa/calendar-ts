<?php

$ip = $_SERVER["REMOTE_ADDR"];
if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
  $ip = $_SERVER["HTTP_CLIENT_IP"];
} elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
  $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
}

$lf = "./connections.log";
$dt = gmdate("Y-m-d\TH:i:s\Z");
$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$mg = "$ip $actual_link $dt\n";

error_log($mg, 3, $lf);

setcookie("build", "build_version" );

