# Genera recursos documentales con archivos, sin abrir ventanas.
param([string]$Captura)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$raizProyecto = Split-Path -Parent $PSScriptRoot
$destino = Join-Path $raizProyecto 'docs/imagenes'
$datos = Get-Content -LiteralPath (Join-Path $destino 'ejemplo.json') -Raw -Encoding utf8 | ConvertFrom-Json

function Nueva-Fuente([float]$Tamano, [bool]$Negrita = $false) {
    $estilo = if ($Negrita) { [Drawing.FontStyle]::Bold } else { [Drawing.FontStyle]::Regular }
    return [Drawing.Font]::new('Segoe UI', $Tamano, $estilo, [Drawing.GraphicsUnit]::Pixel)
}

function Texto($Grafico, [string]$Contenido, $Fuente, $Pincel, [float]$X, [float]$Y, [float]$Ancho, [bool]$Dibujar = $true) {
    $formato = [Drawing.StringFormat]::new()
    $formato.FormatFlags = [Drawing.StringFormatFlags]::LineLimit
    $medida = $Grafico.MeasureString($Contenido, $Fuente, [Drawing.SizeF]::new($Ancho, 3000), $formato)
    $alto = [Math]::Ceiling($medida.Height) + 4
    if ($Dibujar) {
        $Grafico.DrawString($Contenido, $Fuente, $Pincel, [Drawing.RectangleF]::new($X, $Y, $Ancho, $alto), $formato)
    }
    $formato.Dispose()
    return $alto
}

function Salida($Grafico, $Fuentes, $Pinceles, [float]$X, [float]$Y, [float]$Ancho, [bool]$Dibujar) {
    $inicio = $Y
    foreach ($linea in ($datos.salida -split "`n")) {
        if ($linea -eq '') { $Y += 13; continue }
        $esTitulo = $linea.StartsWith('## ')
        $contenido = if ($esTitulo) { $linea.Substring(3) } else { $linea }
        $fuente = if ($esTitulo) { $Fuentes.seccion } else { $Fuentes.cuerpo }
        $pincel = if ($esTitulo) { $Pinceles.azul } else { $Pinceles.tinta }
        $Y += Texto $Grafico $contenido $fuente $pincel $X $Y $Ancho $Dibujar
    }
    return $Y - $inicio
}

function Crear-Comparativa([bool]$Movil) {
    $ancho = if ($Movil) { 720 } else { 1280 }
    $margen = if ($Movil) { 36 } else { 48 }
    $separacion = 24
    $relleno = 28
    $anchoEntrada = if ($Movil) { 648 } else { 432 }
    $anchoSalida = if ($Movil) { 648 } else { 728 }
    $fuentes = @{
        titulo = Nueva-Fuente $(if ($Movil) { 36 } else { 44 }) $true
        cuerpo = Nueva-Fuente $(if ($Movil) { 32 } else { 28 })
        seccion = Nueva-Fuente $(if ($Movil) { 30 } else { 27 }) $true
        etiqueta = Nueva-Fuente $(if ($Movil) { 27 } else { 24 }) $true
        nota = Nueva-Fuente $(if ($Movil) { 23 } else { 22 })
    }
    $pinceles = @{
        fondo = [Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml('#f4f7fb'))
        blanco = [Drawing.SolidBrush]::new([Drawing.Color]::White)
        tinta = [Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml('#0f172a'))
        tenue = [Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml('#475569'))
        azul = [Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml('#2563eb'))
    }
    $borde = [Drawing.Pen]::new([Drawing.ColorTranslator]::FromHtml('#cbd5e1'), 1)
    $medidor = [Drawing.Bitmap]::new(1, 1)
    $gMedidor = [Drawing.Graphics]::FromImage($medidor)
    $altoEntrada = 96 + (Texto $gMedidor $datos.entrada $fuentes.cuerpo $pinceles.tinta 0 0 ($anchoEntrada - 2 * $relleno) $false) + $relleno
    $altoSalida = 96 + (Salida $gMedidor $fuentes $pinceles 0 0 ($anchoSalida - 2 * $relleno) $false) + $relleno
    $yPanel = 166
    $xSalida = if ($Movil) { $margen } else { $margen + $anchoEntrada + $separacion }
    $ySalida = if ($Movil) { $yPanel + $altoEntrada + $separacion } else { $yPanel }
    if (-not $Movil) { $altoEntrada = $altoSalida = [Math]::Max($altoEntrada, $altoSalida) }
    $yPie = $ySalida + $altoSalida + 32
    $altoPie = Texto $gMedidor $datos.grafica.pie $fuentes.nota $pinceles.tenue 0 0 ($ancho - 2 * $margen) $false
    $altoNota = Texto $gMedidor $datos.grafica.nota $fuentes.nota $pinceles.tenue 0 0 ($ancho - 2 * $margen) $false
    $alto = [int]($yPie + $altoPie + $altoNota + $margen + 8)
    $gMedidor.Dispose()
    $medidor.Dispose()

    $lienzo = [Drawing.Bitmap]::new($ancho, $alto, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [Drawing.Graphics]::FromImage($lienzo)
    $g.TextRenderingHint = [Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.FillRectangle($pinceles.fondo, 0, 0, $ancho, $alto)
    [void](Texto $g $datos.grafica.titulo $fuentes.titulo $pinceles.tinta $margen 34 ($ancho - 2 * $margen))
    [void](Texto $g $datos.grafica.subtitulo $fuentes.nota $pinceles.tenue $margen 99 ($ancho - 2 * $margen))

    foreach ($panel in @(
        @{ x = $margen; y = $yPanel; ancho = $anchoEntrada; alto = $altoEntrada; etiqueta = $datos.grafica.entrada },
        @{ x = $xSalida; y = $ySalida; ancho = $anchoSalida; alto = $altoSalida; etiqueta = $datos.grafica.salida }
    )) {
        $g.FillRectangle($pinceles.blanco, [float]$panel.x, [float]$panel.y, [float]$panel.ancho, [float]$panel.alto)
        $g.DrawRectangle($borde, [float]$panel.x, [float]$panel.y, [float]$panel.ancho, [float]$panel.alto)
        $g.FillRectangle($pinceles.azul, [float]$panel.x, [float]$panel.y, 44, 4)
        [void](Texto $g $panel.etiqueta $fuentes.etiqueta $pinceles.tenue ($panel.x + $relleno) ($panel.y + 27) ($panel.ancho - 2 * $relleno))
    }
    [void](Texto $g $datos.entrada $fuentes.cuerpo $pinceles.tinta ($margen + $relleno) ($yPanel + 96) ($anchoEntrada - 2 * $relleno))
    [void](Salida $g $fuentes $pinceles ($xSalida + $relleno) ($ySalida + 96) ($anchoSalida - 2 * $relleno) $true)
    [void](Texto $g $datos.grafica.pie $fuentes.nota $pinceles.tinta $margen $yPie ($ancho - 2 * $margen))
    [void](Texto $g $datos.grafica.nota $fuentes.nota $pinceles.tenue $margen ($yPie + $altoPie + 8) ($ancho - 2 * $margen))
    $nombre = if ($Movil) { 'ejemplo-movil.png' } else { 'ejemplo.png' }
    $lienzo.Save((Join-Path $destino $nombre), [Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $lienzo.Dispose()
    $borde.Dispose()
    foreach ($recurso in $fuentes.Values) { $recurso.Dispose() }
    foreach ($recurso in $pinceles.Values) { $recurso.Dispose() }
    Write-Output "$nombre : $ancho x $alto"
}

if ($Captura) {
    $original = [Drawing.Bitmap]::new((Resolve-Path -LiteralPath $Captura).Path)
    if ($original.Height -le 50) { throw 'La captura no contiene el area esperada.' }
    $recorte = $original.Clone([Drawing.Rectangle]::new(0, 50, $original.Width, $original.Height - 50), [Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $recorte.Save((Join-Path $destino 'interfaz.png'), [Drawing.Imaging.ImageFormat]::Png)
    Write-Output "interfaz.png : $($recorte.Width) x $($recorte.Height)"
    $recorte.Dispose()
    $original.Dispose()
}

Crear-Comparativa $false
Crear-Comparativa $true
