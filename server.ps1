# PowerShell Static File Server for Climate Comfort
$port = 8000
$httpListener = New-Object System.Net.HttpListener
$httpListener.Prefixes.Add("http://localhost:$port/")
$httpListener.Start()

Write-Host "=================================================="
Write-Host "Climate Comfort Web Server Started!"
Write-Host "Navigate to: http://localhost:$port/"
Write-Host "Press Ctrl+C in this terminal to stop the server."
Write-Host "=================================================="

try {
    while ($httpListener.IsListening) {
        $context = $httpListener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested local path
        $urlPath = $request.Url.LocalPath
        if ($urlPath.EndsWith("/")) {
            $urlPath = $urlPath + "index.html"   # "/" and "/admin/" serve their index.html
        }
        
        # Clean up path to prevent directory traversal out of the workspace
        $cleanPath = $urlPath.Replace("/", "\").TrimStart('\')
        $filePath = Join-Path $PSScriptRoot $cleanPath
        
        # Double check if file exists and is within script directory
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Determine Content Type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            if ($ext -eq ".html" -or $ext -eq ".htm") { 
                $response.ContentType = "text/html; charset=utf-8" 
            }
            elseif ($ext -eq ".css") { 
                $response.ContentType = "text/css; charset=utf-8" 
            }
            elseif ($ext -eq ".js") { 
                $response.ContentType = "application/javascript; charset=utf-8" 
            }
            elseif ($ext -eq ".png") { $response.ContentType = "image/png" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $response.ContentType = "image/jpeg" }
            elseif ($ext -eq ".svg") { $response.ContentType = "image/svg+xml" }
            elseif ($ext -eq ".ico") { $response.ContentType = "image/x-icon" }
            
            # Always serve fresh files — browsers must not cache stale app code
            $response.Headers.Add("Cache-Control", "no-store")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[200] Served: $urlPath"
        } else {
            $response.StatusCode = 404
            $responseString = "<h3>404 File Not Found</h3><p>The file '$urlPath' could not be found on the server.</p>"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($responseString)
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[404] Not Found: $urlPath"
        }
        $response.Close()
    }
}
catch {
    Write-Host "Error in server loop: $_"
}
finally {
    $httpListener.Stop()
    $httpListener.Close()
    Write-Host "Server stopped."
}
