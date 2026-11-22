param(
  [Parameter(Mandatory = $true)][string]$Origen,
  [Parameter(Mandatory = $true)][string]$OrigenVentana
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
function Convertir-Png([System.Drawing.Image]$imagen, [int]$lado) {
    $lienzo = [System.Drawing.Bitmap]::new($lado, $lado, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $grafico = [System.Drawing.Graphics]::FromImage($lienzo)
    $flujo = [System.IO.MemoryStream]::new()
    try {
      $grafico.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
      $grafico.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $grafico.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $grafico.Clear([System.Drawing.Color]::Transparent)
      $escala = [Math]::Min($lado / $imagen.Width, $lado / $imagen.Height)
      $ancho = [single]($imagen.Width * $escala)
      $alto = [single]($imagen.Height * $escala)
      $rectangulo = [System.Drawing.RectangleF]::new([single](($lado - $ancho) / 2), [single](($lado - $alto) / 2), $ancho, $alto)
      $grafico.DrawImage($imagen, $rectangulo)
      $lienzo.Save($flujo, [System.Drawing.Imaging.ImageFormat]::Png)
      return [Convert]::ToBase64String($flujo.ToArray())
    } finally {
      $flujo.Dispose()
      $grafico.Dispose()
      $lienzo.Dispose()
    }
}
$imagen = [System.Drawing.Image]::FromFile($Origen)
$imagenVentana = $null
try {
  $imagenVentana = [System.Drawing.Image]::FromFile($OrigenVentana)
  $resultado = [ordered]@{}
  foreach ($lado in @(32, 48, 64, 192, 256, 512)) { $resultado[[string]$lado] = Convertir-Png $imagen $lado }
  foreach ($lado in @(16, 32)) { $resultado["ventana$lado"] = Convertir-Png $imagenVentana $lado }
  $resultado | ConvertTo-Json -Compress
} finally {
  $imagen.Dispose()
  if ($imagenVentana) { $imagenVentana.Dispose() }
}
