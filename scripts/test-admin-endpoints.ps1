<#
.SYNOPSIS
  Test all Trios /admin/* endpoints against the live backend.

.DESCRIPTION
  Logs in with admin credentials, captures the JWT, and exercises every
  documented admin route. Safe GETs run automatically; mutations are limited
  to echo/read-only probes unless -IncludeMutations is passed.

.PARAMETER Email
  Admin email address.

.PARAMETER Password
  Admin password.

.PARAMETER BaseUrl
  API base including /api/v1 (default: https://trios.viaspark.site/api/v1).

.PARAMETER IncludeMutations
  When set, runs POST/PATCH/DELETE smoke tests (may create test data).

.EXAMPLE
  .\scripts\test-admin-endpoints.ps1 -Email admin@example.com -Password 'secret'
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$Email,

  [Parameter(Mandatory = $true)]
  [string]$Password,

  [string]$BaseUrl = 'https://trios.viaspark.site/api/v1',

  [switch]$IncludeMutations
)

$ErrorActionPreference = 'Continue'
$results = @()

function Write-Result {
  param([string]$Method, [string]$Path, [int]$Status, [string]$Note = '')
  $icon = if ($Status -ge 200 -and $Status -lt 300) { 'OK' } elseif ($Status -eq 401) { 'AUTH' } elseif ($Status -eq 404) { '404' } else { 'ERR' }
  $line = ('{0,-4} {1,-6} {2,-55} {3}' -f $icon, $Method, $Path, $Status)
  if ($Note) { $line += "  ($Note)" }
  Write-Host $line
  $script:results += [pscustomobject]@{ Icon = $icon; Method = $Method; Path = $Path; Status = $Status; Note = $Note }
}

function Invoke-AdminRequest {
  param(
    [string]$Method = 'GET',
    [string]$Path,
    [object]$Body = $null,
    [hashtable]$Headers = @{}
  )

  $uri = "$BaseUrl$Path"
  $params = @{
    Uri     = $uri
    Method  = $Method
    Headers = $Headers
  }

  if ($Body -ne $null) {
    $params['Body'] = ($Body | ConvertTo-Json -Depth 6 -Compress)
    $params['ContentType'] = 'application/json'
  }

  try {
    $response = Invoke-WebRequest @params -UseBasicParsing
    return @{ Status = [int]$response.StatusCode; Body = $response.Content }
  }
  catch {
    if ($_.Exception.Response) {
      $status = [int]$_.Exception.Response.StatusCode.value__
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $body = $reader.ReadToEnd()
      return @{ Status = $status; Body = $body }
    }
    return @{ Status = 0; Body = $_.Exception.Message }
  }
}

function Get-TokenFromLoginBody {
  param([string]$Json)
  try {
    $obj = $Json | ConvertFrom-Json
    foreach ($key in @('token', 'access_token', 'accessToken', 'jwt', 'admin_token')) {
      if ($obj.PSObject.Properties.Name -contains $key -and $obj.$key) { return [string]$obj.$key }
    }
    if ($obj.data) {
      foreach ($key in @('token', 'access_token', 'accessToken', 'jwt')) {
        if ($obj.data.PSObject.Properties.Name -contains $key -and $obj.data.$key) { return [string]$obj.data.$key }
      }
    }
    if ($obj.admin -and $obj.admin.token) { return [string]$obj.admin.token }
  }
  catch { }
  return $null
}

Write-Host ''
Write-Host '=== Trios Admin API Endpoint Test ===' -ForegroundColor Cyan
Write-Host "Base: $BaseUrl"
Write-Host ''

# --- Login ---
$login = Invoke-AdminRequest -Method POST -Path '/admin/login' -Body @{ email = $Email; password = $Password }
Write-Result -Method POST -Path '/admin/login' -Status $login.Status -Note $(if ($login.Status -eq 200) { 'token capture' } else { 'check credentials' })

if ($login.Status -ne 200) {
  Write-Host ''
  Write-Host 'Login failed. Aborting protected endpoint tests.' -ForegroundColor Red
  if ($login.Body) { Write-Host $login.Body }
  exit 1
}

$token = Get-TokenFromLoginBody -Json $login.Body
if (-not $token) {
  Write-Host 'Warning: login succeeded but token field not found in JSON. Trying Authorization from Set-Cookie is not supported in this script.' -ForegroundColor Yellow
  Write-Host "Response body: $($login.Body)"
  exit 1
}

$auth = @{ Authorization = "Bearer $token" }
Write-Host "Token captured (${token.Substring(0, [Math]::Min(12, $token.Length))}...)" -ForegroundColor Green
Write-Host ''

# --- Helper to run GET and record ---
function Test-Get {
  param([string]$Path, [string]$Note = '')
  $r = Invoke-AdminRequest -Method GET -Path $Path -Headers $auth
  Write-Result -Method GET -Path $Path -Status $r.Status -Note $Note
  return $r
}

# --- Protected GET endpoints ---
Test-Get '/admin/profile'
Test-Get '/admin/dashboard'
Test-Get '/admin/reports/analytics'
Test-Get '/admin/reports?page=1&limit=5'
Test-Get '/admin/admins?page=1&limit=5'
Test-Get '/admin/broadcasts?page=1&limit=5'
Test-Get '/admin/users?page=1&limit=5'
Test-Get '/admin/vendors?page=1&limit=5'
Test-Get '/admin/events?page=1&limit=5'
Test-Get '/admin/transactions?page=1&limit=5'
Test-Get '/admin/withdrawals?page=1&limit=5'
Test-Get '/admin/disputes?page=1&limit=5'
Test-Get '/admin/faqs'
Test-Get '/admin/subscription-plans'
Test-Get '/admin/subscriptions?page=1&limit=5'
Test-Get '/admin/support?page=1&limit=5'
Test-Get '/admin/settings'

# --- Detail endpoints (use first ID from list when possible) ---
function Get-FirstId {
  param([string]$Json, [string[]]$Fields = @('id', 'user_id', 'vendor_id', 'event_id', 'ticket_id', 'transaction_id', 'dispute_id', 'faq_id', 'plan_id', 'subscription_id'))
  try {
    $obj = $Json | ConvertFrom-Json
    $items = $null
    if ($obj.items) { $items = $obj.items }
    elseif ($obj.data) { $items = $obj.data }
    elseif ($obj.results) { $items = $obj.results }
    elseif ($obj -is [System.Array]) { $items = $obj }
    if ($items -and $items.Count -gt 0) {
      $first = $items[0]
      foreach ($f in $Fields) {
        if ($first.PSObject.Properties.Name -contains $f -and $first.$f) { return [string]$first.$f }
      }
    }
  }
  catch { }
  return $null
}

$users = Invoke-AdminRequest -Method GET -Path '/admin/users?page=1&limit=1' -Headers $auth
$userId = Get-FirstId -Json $users.Body -Fields @('user_id', 'id')
if ($userId) {
  Test-Get "/admin/users/$userId"
  Test-Get "/admin/users/$userId/bookings?page=1&limit=5"
}

$vendors = Invoke-AdminRequest -Method GET -Path '/admin/vendors?page=1&limit=1' -Headers $auth
$vendorId = Get-FirstId -Json $vendors.Body -Fields @('vendor_id', 'id')
if ($vendorId) {
  Test-Get "/admin/vendors/$vendorId"
  Test-Get "/admin/vendors/$vendorId/events?page=1&limit=5"
  Test-Get "/admin/vendors/$vendorId/kyc"
  Test-Get "/admin/vendors/$vendorId/page?page=1&limit=5"
}

$events = Invoke-AdminRequest -Method GET -Path '/admin/events?page=1&limit=1' -Headers $auth
$eventId = Get-FirstId -Json $events.Body -Fields @('event_id', 'id')
if ($eventId) {
  Test-Get "/admin/events/$eventId"
}

$tickets = Invoke-AdminRequest -Method GET -Path '/admin/support?page=1&limit=1' -Headers $auth
$ticketId = Get-FirstId -Json $tickets.Body -Fields @('ticket_id', 'id')
if ($ticketId) {
  Test-Get "/admin/support/$ticketId"
}

if ($IncludeMutations) {
  Write-Host ''
  Write-Host '--- Mutation smoke tests ---' -ForegroundColor Yellow

  $faq = Invoke-AdminRequest -Method POST -Path '/admin/faqs' -Headers $auth -Body @{
    question = 'Script test FAQ'
    answer   = 'Automated test entry — safe to delete'
  }
  Write-Result -Method POST -Path '/admin/faqs' -Status $faq.Status -Note 'create FAQ'

  $faqId = $null
  try {
    $faqObj = $faq.Body | ConvertFrom-Json
    if ($faqObj.faq_id) { $faqId = $faqObj.faq_id }
    elseif ($faqObj.id) { $faqId = $faqObj.id }
  }
  catch { }

  if ($faqId) {
    $patch = Invoke-AdminRequest -Method PATCH -Path "/admin/faqs/$faqId" -Headers $auth -Body @{
      question   = 'Script test FAQ (updated)'
      answer     = 'Updated'
      is_active  = $true
    }
    Write-Result -Method PATCH -Path "/admin/faqs/$faqId" -Status $patch.Status

    $del = Invoke-AdminRequest -Method DELETE -Path "/admin/faqs/$faqId" -Headers $auth
    Write-Result -Method DELETE -Path "/admin/faqs/$faqId" -Status $del.Status
  }

  $logout = Invoke-AdminRequest -Method POST -Path '/admin/logout' -Headers $auth
  Write-Result -Method POST -Path '/admin/logout' -Status $logout.Status
}

Write-Host ''
$ok = ($results | Where-Object { $_.Status -ge 200 -and $_.Status -lt 300 }).Count
$fail = ($results | Where-Object { $_.Status -lt 200 -or $_.Status -ge 300 }).Count
Write-Host "Summary: $ok passed, $fail failed/non-2xx (of $($results.Count) calls)" -ForegroundColor Cyan
Write-Host ''
Write-Host 'Re-run with -IncludeMutations to test FAQ create/patch/delete and logout.' -ForegroundColor DarkGray
Write-Host 'Document any 404/500 routes in BACKEND-HANDOFF.md.' -ForegroundColor DarkGray
